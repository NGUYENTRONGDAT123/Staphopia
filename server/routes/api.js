const express = require ('express');
const router = express.Router ();
const redis = require ('redis');
const {promisify} = require ('util');

//  create redis client and connect to redis server
const redis_url = process.env.REDIS_URL || 'redis://127.0.0.1';
const redis_client = redis.createClient (redis_url);
const redis_get = promisify (redis_client.get).bind (redis_client);

router.get ('/regions', async (req, res, next) => {
  const covid19jhu = req.app.mongodb.db ('covid19jhu');
  let country = req.query.country === undefined ? '' : req.query.country;
  let state = req.query.state === undefined ? '' : req.query.state;
  let key = `regions_${country}_${state}`;

  let pipeline = [
    {
      $match: {
        Lat: {
          $nin: [''],
        },
        Long_: {
          $nin: [''],
        },
      },
    },
    {
      $group: {
        _id: {
          country: '$Country_Region',
        },
        lat: {
          $first: '$Lat',
        },
        lng: {
          $first: '$Long_',
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];

  if (country != '') {
    // if countries is defined return list of states without the country itself
    pipeline[0]['$match']['Country_Region'] = country;
    pipeline[0]['$match']['Province_State'] = {$nin: ['']};
    pipeline[1]['$group']['_id']['state'] = '$Province_State';

    // if state is defined return list of counties, without country and states itself
    if (state != '') {
      pipeline[0]['$match']['Province_State'] = state;
      pipeline[0]['$match']['Admin2'] = {$nin: ['']};
      pipeline[1]['$group']['_id']['county'] = '$Admin2';
    }
  }

  // try to get data from redis
  redis_get (key)
    .then (async result => {
      if (result) {
        res.status (200).json (JSON.parse (result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return covid19jhu
          .collection ('UID_ISO_FIPS_LookUp_Table')
          .aggregate (pipeline)
          .toArray ();
      }
    })
    .then (async result => {
      // store the result from mongodb to redis
      redis_client.setex (
        key,
        28800,
        JSON.stringify ({source: 'Redis Cache', result: result})
      );

      // send the result back to client
      return res.send ({source: 'Mongodb', result: result});
    })
    .catch (err => {
      console.log (err);
    });
});

router.get ('/test', async (req, res, next) => {
  res.status (200).json ({message: 'Test api'});
});

router.get ('/docs', async (req, res, next) => {
  res.sendFile ('public/api-docs/index.html', {root: './'});
});

module.exports = router;
