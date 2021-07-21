const express = require ('express');
const router = express.Router ();
const redis = require ('redis');
const {promisify} = require ('util');

//  create redis client and connect to redis server
const redis_url = process.env.REDIS_URL || 'redis://127.0.0.1';
const redis_client = redis.createClient (redis_url);
const redis_get = promisify (redis_client.get).bind (redis_client);
redis_client.flushdb (function (err, succeeded) {
  if (succeeded === 'OK') console.log ('Redis cache is clear');
  else console.log ('Fail to clear Redis cache');
});
// router.get ('/regions', async (req, res, next) => {
//   const covid19jhu = req.app.mongodb.db ('covid19jhu');
//   let country = req.query.country === undefined ? '' : req.query.country;
//   let state = req.query.state === undefined ? '' : req.query.state;
//   let key = `regions_${country}_${state}`;

//   let pipeline = [
//     {
//       $match: {
//         Lat: {
//           $nin: [''],
//         },
//         Long_: {
//           $nin: [''],
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           country: '$Country_Region',
//         },
//         lat: {
//           $first: '$Lat',
//         },
//         lng: {
//           $first: '$Long_',
//         },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ];

//   if (country != '') {
//     // if countries is defined return list of states without the country itself
//     pipeline[0]['$match']['Country_Region'] = country;
//     pipeline[0]['$match']['Province_State'] = {$nin: ['']};
//     pipeline[1]['$group']['_id']['state'] = '$Province_State';

//     // if state is defined return list of counties, without country and states itself
//     if (state != '') {
//       pipeline[0]['$match']['Province_State'] = state;
//       pipeline[0]['$match']['Admin2'] = {$nin: ['']};
//       pipeline[1]['$group']['_id']['county'] = '$Admin2';
//     }
//   }

//   // try to get data from redis
//   redis_get (key)
//     .then (async result => {
//       if (result) {
//         res.status (200).json (JSON.parse (result));
//         throw `Caught '${key}' in cache`;
//       } else {
//         // return data from mongodb
//         return covid19jhu
//           .collection ('UID_ISO_FIPS_LookUp_Table')
//           .aggregate (pipeline)
//           .toArray ();
//       }
//     })
//     .then (async result => {
//       // store the result from mongodb to redis
//       redis_client.setex (
//         key,
//         28800,
//         JSON.stringify ({source: 'Redis Cache', result: result})
//       );

//       // send the result back to client
//       return res.send ({source: 'Mongodb', result: result});
//     })
//     .catch (err => {
//       console.log (err);
//     });
// });

router.get ('/amr-sample', async (req, res, next) => {
  const AMR = req.app.mongodb.db ('AMR');
  let samples = null;
  let key = null;

  // Get all data if query not found
  try {
    if (req.query.samples === undefined) {
      key = 'amr-sample';
      pipeline = [
        {
          $match: {Name: {$exists: true}},
        },
      ];
    } else {
      samples = JSON.parse (req.query.samples.toString ());
      key = samples.join ('-');
      for (var i = 0; i < samples.length; i++) {
        samples[i] = samples[i] + '.csv';
      }
      pipeline = [
        {
          $match: {Name: {$in: samples}},
        },
      ];
    }
  } catch (err) {
    res.status (400).send ({error: true, message: 'Bad request!'});
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

router.get ('/available-sample', async (req, res, next) => {
  const AMR = req.app.mongodb.db ('AMR');

  let key = 'available-sample';
  let pipeline = [
    {
      $group: {
        _id: '$Name',
      },
    },
    {
      $group: {
        _id: null,
        sample_ids: {
          $push: '$_id',
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

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
      result = result[0].sample_ids;
      for (var i = 0; i < result.length; i++) {
        result[i] = result[i].replace ('.csv', '');
      }

      // convert sample list to  integer and sort in ascending order
      result = result.map (element => Number (element));
      result.sort (function (a, b) {
        return a - b;
      });
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

router.get ('/subclass-sample', async (req, res, next) => {
  const AMR = req.app.mongodb.db ('AMR');
  let samples = null;
  let key = null;

  // Get all data if query not found
  try {
    if (req.query.samples === undefined) {
      key = 'subclass-sample';
      pipeline = [
        {
          $group: {
            _id: '$Name',
            subclasses: {
              $push: '$Subclass',
            },
          },
        },
      ];
    } else {
      samples = JSON.parse (req.query.samples.toString ());
      key = 'subclass-sample-' + samples.join ('-');
      for (var i = 0; i < samples.length; i++) {
        samples[i] = samples[i] + '.csv';
      }
      pipeline = [
        {
          $group: {
            _id: '$Name',
            subclasses: {
              $push: '$Subclass',
            },
          },
        },
        {
          $match: {_id: {$in: samples}},
        },
      ];
    }
  } catch (err) {
    res.status (400).send ({error: true, message: 'Bad request!'});
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

// localhost:8393/api/available-subclass
router.get ('/available-subclass', async (req, res, next) => {
  const AMR = req.app.mongodb.db ('AMR');

  let key = 'available-subclass';
  let pipeline = [
    {
      $group: {
        _id: '$Subclass',
      },
    },
    {
      $group: {
        _id: null,
        subclasses: {
          $addToSet: '$_id',
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

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
      result = result[0].subclasses;
      result = result.filter ((v, i, a) => a.indexOf (v) === i);
      result.sort ();
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

// e.g. localhost:8393/api/sample-subclass?subclasses=FOSFOMYCIN,QUATERNARY AMMONIUM
// e.g. localhost:8393/api/sample-subclass
router.get ('/sample-subclass', async (req, res, next) => {
  const AMR = req.app.mongodb.db ('AMR');
  let subclasses = null;
  let key = null;

  // Get all data if query not found
  try {
    if (req.query.subclasses === undefined) {
      key = 'sample-subclass';
      pipeline = [
        {
          $group: {
            _id: '$Subclass',
            samples: {
              $addToSet: '$Name',
            },
          },
        },
      ];
    } else {
      subclasses = req.query.subclasses;
      subclasses = subclasses.split (',');
      key = 'sample-subclass-'.concat (subclasses.sort ().join ('-'));
      pipeline = [
        {
          $group: {
            _id: '$Subclass',
            samples: {
              $addToSet: '$Name',
            },
          },
        },
        {
          $match: {_id: {$in: subclasses}},
        },
      ];
    }
  } catch (err) {
    res.status (400).send ({error: true, message: 'Bad request!'});
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
