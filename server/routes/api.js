const express = require ('express');
const router = express.Router ();
const redis = require ('redis');
const {promisify} = require ('util');

//  create redis client and connect to redis server
const redis_url = process.env.REDIS_URL || 'redis://127.0.0.1';
const redis_client = redis.createClient (redis_url);
const redis_get = promisify (redis_client.get).bind (redis_client);

router.get ('/amr-sample', async (req, res, next) => {
  const AMR = req.app.mongodb.db ('AMR');
  let samples = null;
  let key = null;

  // Get all data if query not found
  try{
    if (req.query.samples === undefined) {
      pipeline = [
        {
          $match: {Name: {$exists: true}},
        },
      ];
    } else {
      samples = JSON.parse(req.query.samples.toString());
      key = samples.join('-');
      for (var i = 0; i< samples.length; i++){
        samples[i] = samples[i] +'.csv';
      }
      let pipeline = [
        {
          $match: {Name: {$in: samples}},
        },
      ]      
    }
  } catch (err) {
    res.status(400).send({'error': true, 'message':'Bad request!'})
  }

  // try to get data from redis
  redis_get (key)
    .then (async result => {
      if (result) {
        res.status (200).json (JSON.parse (result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection ('100Genes').aggregate (pipeline).toArray ();
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
