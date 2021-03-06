const express = require("express");
const router = express.Router();
const redis = require("redis");
const { pipeline } = require("stream");
const { promisify } = require("util");

//  create redis client and connect to redis server
const redis_url = process.env.REDIS_URL || "redis://127.0.0.1";
const redis_client = redis.createClient(redis_url);
const redis_get = promisify(redis_client.get).bind(redis_client);
redis_client.flushdb(function (err, succeeded) {
  if (succeeded === "OK") console.log("Redis cache is clear");
  else console.log("Fail to clear Redis cache");
});

/**
 * @swagger
 * /api/amr-sample:
 *   get:
 *     summary: Retrieve a list of samples.
 *     description: Get information about selected samples.
 *     parameters:
 *       - in: query
 *         name: samples
 *         required: false
 *         description: Array of samples to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of samples containing detailed information.
 */
router.get("/amr-sample", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let samples = null;
  let key = null;
  let pipeline;

  // Get all data if query not found
  if (req.query.samples === undefined) {
    key = "amr-sample";
    pipeline = [
      {
        $match: { Name: { $exists: true } },
      },
    ];
  } else {
    samples = JSON.parse(req.query.samples.toString());
    key = samples.join("-");
    for (var i = 0; i < samples.length; i++) {
      samples[i] = samples[i] + ".csv";
    }
    pipeline = [
      {
        $match: { Name: { $in: samples } },
      },
    ];
  }

  // try to get data from redis
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("100Genes").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/available-sample:
 *   get:
 *     summary: Retrieve a list of all available samples.
 *     description: Get a short list of sample ID that are stored in database
 *     responses:
 *       200:
 *         description: A list of samples ID.
 */
router.get("/available-sample", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let key = "available-sample";
  let pipeline = [
    {
      $group: {
        _id: "$Name",
      },
    },
    {
      $group: {
        _id: null,
        sample_ids: {
          $push: "$_id",
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
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("100Genes").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      result = result[0].sample_ids;
      for (var i = 0; i < result.length; i++) {
        result[i] = result[i].replace(".csv", "");
      }

      // convert sample list to  integer and sort in ascending order
      result = result.map((element) => Number(element));
      result.sort(function (a, b) {
        return a - b;
      });
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/subclass-sample:
 *   get:
 *     summary: Retrieve a list of subclasses.
 *     description: Get information about subclasses of selected samples.
 *     parameters:
 *       - in: query
 *         name: samples
 *         required: false
 *         description: Array of samples to retrieve e.g. [100,101]
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of subclasses of selected samples.
 */
router.get("/subclass-sample", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let samples = null;
  let key;
  let pipeline;

  // Get all data if query not found
  if (req.query.samples === undefined) {
    key = "subclass-sample";
    pipeline = [
      {
        $group: {
          _id: "$Name",
          subclasses: {
            $push: "$Subclass",
          },
        },
      },
    ];
  } else {
    samples = JSON.parse(req.query.samples.toString());
    key = "subclass-sample-" + samples.join("-");
    for (var i = 0; i < samples.length; i++) {
      samples[i] = samples[i] + ".csv";
    }
    pipeline = [
      {
        $group: {
          _id: "$Name",
          subclasses: {
            $push: "$Subclass",
          },
        },
      },
      {
        $match: { _id: { $in: samples } },
      },
    ];
  }

  // try to get data from redis
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("100Genes").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/available-subclass:
 *   get:
 *     summary: Retrieve a list of available subclasses.
 *     description: Get information about all available subclasses.
 *     responses:
 *       200:
 *         description: A list of available subclasses.
 */
router.get("/available-subclass", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let key = "available-subclass";
  let pipeline = [
    {
      $group: {
        _id: "$Subclass",
      },
    },
    {
      $group: {
        _id: null,
        subclasses: {
          $addToSet: "$_id",
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
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("100Genes").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      result = result[0].subclasses;
      result = result.filter((v, i, a) => a.indexOf(v) === i);
      result.sort();
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/sample-subclass:
 *   get:
 *     summary: Retrieve a list of samples ID by selected subclasses.
 *     description: Get information about selected subclasses e.g. FOSFOMYCIN,QUATERNARY AMMONIUM
 *     parameters:
 *       - in: query
 *         name: subclasses
 *         required: false
 *         description: Array of subclasses to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of samples ID by selected subclasses.
 */
router.get("/sample-subclass", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let subclasses = null;
  let key = null;
  let pipeline;

  // Get all data if query not found
  if (req.query.subclasses === undefined) {
    key = "sample-subclass";
    pipeline = [
      {
        $group: {
          _id: "$Subclass",
          samples: {
            $addToSet: "$Name",
          },
        },
      },
    ];
  } else {
    subclasses = req.query.subclasses;
    subclasses = subclasses.split(",");
    key = "sample-subclass-".concat(subclasses.sort().join("-"));
    pipeline = [
      {
        $group: {
          _id: "$Subclass",
          samples: {
            $addToSet: "$Name",
          },
        },
      },
      {
        $match: { _id: { $in: subclasses } },
      },
    ];
  }

  // try to get data from redis
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("100Genes").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/packed-circle:
 *   get:
 *     summary: Get all necessary data for packed circle graph
 *     description: Get formatted data for packed circle graph
 *     responses:
 *       200:
 *         description: A list of samples data hierarchy for visualization
 */
router.get("/packed-circle", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let key = null;
  let pipeline;
  key = "packed-circle";
  pipeline = [
    {
      $group: {
        _id: {
          class: "$Subclass",
          name: "$Name",
        },
        value: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.class",
        children: {
          $push: {
            name: "$_id.name",
            value: "$value",
          },
        },
      },
    },
    {
      $addFields: {
        name: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

  // try to get data from redis
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("100Genes").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/sample-metadata:
 *   get:
 *     summary: Get the metadata of selected samples
 *     description: Get formatted metadata from Staphopia API
 *     parameters:
 *       - in: query
 *         name: samples
 *         required: false
 *         description: Array of samples ID to retrieve e.g. [100, 101, 102]
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of metadata for selected samples
 */
router.get("/sample-metadata", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let samples = null;
  let key = null;
  let pipeline;

  // Get all data if query not found
  if (req.query.samples === undefined) {
    key = "sample-metadata";
    pipeline = [
      {
        $match: { sample_id: { $exists: true } },
      },
    ];
  } else {
    samples = JSON.parse(req.query.samples.toString());
    key = "sample-metadata".concat(samples.join("-"));
    samples = samples.map(Number);
    pipeline = [
      {
        $match: { sample_id: { $in: samples } },
      },
    ];
  }

  // try to get data from redis
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("Metadata").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/antibiotics-info:
 *   get:
 *     summary: Get the information of selected antibiotics
 *     description: Get information of selected antibiotics stored in database
 *     responses:
 *       200:
 *         description: A list of metadata for selected antibiotics
 */
router.get("/antibiotics-info", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let antibiotics = null;
  let key = null;
  let pipeline;

  // Get all data if query not found
  // try {
  if (req.query.antibiotics === undefined) {
    key = "antibiotics-info";
    pipeline = [
      {
        $match: { Subclass: { $exists: true } },
      },
    ];
  } else {
    antibiotics = JSON.parse(req.query.antibiotics.toString());
    key = "antibiotics-info".concat(antibiotics.join("-"));
    pipeline = [
      {
        $match: { Subclass: { $in: antibiotics } },
      },
    ];
  }

  // try to get data from redis
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("Antibiotics").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      // store the result from mongodb to redis
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @swagger
 * /api/sample-symbol:
 *   get:
 *     summary: Get the metadata of selected sample symbol
 *     description: Get the metadata of selected sample symbol
 *     parameters:
 *       - in: query
 *         name: sample
 *         required: true
 *         description: A sample ID to retrieve e.g. 100
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sample symbol information
 */
router.get("/sample-symbol", async (req, res, next) => {
  const AMR = req.app.mongodb.db("AMR");
  let sample = null;
  let key = null;
  let pipeline;

  // Get all data if query not found
  if (req.query.sample === undefined) {
    return res.status(400).json({ message: "Need a sample as query" });
  } else {
    sample = JSON.parse(req.query.sample.toString());
    key = "sample-symbol" + sample;
    sample = sample + ".csv";
    pipeline = [
      {
        $match: { Name: sample },
      },
    ];
  }

  // try to get data from redis
  redis_get(key)
    .then(async (result) => {
      if (result) {
        res.status(200).json(JSON.parse(result));
        throw `Caught '${key}' in cache`;
      } else {
        // return data from mongodb
        return AMR.collection("100Genes").aggregate(pipeline).toArray();
      }
    })
    .then(async (result) => {
      let temp = {};
      temp.nodes = [];
      temp.links = [];

      let symbols = [];
      result.forEach(function (obj) {
        symbols.push({
          symbol: obj["Gene symbol"],
          start: parseInt(obj["Start"]),
        });
        temp.nodes.push({ id: obj["Gene symbol"], subclass: obj["Subclass"] });
      });

      symbols.sort((a, b) =>
        a.start > b.start ? 1 : b.start > a.start ? -1 : 0
      );

      for (let i = 0; i < symbols.length - 1; i++) {
        temp.links.push({
          source: symbols[i].symbol,
          target: symbols[i + 1].symbol,
        });
      }

      result = temp;
      // store the result from mongodb to redis
      redis_client.setex(
        key,
        28800,
        JSON.stringify({ source: "Redis Cache", result: result })
      );

      // send the result back to client
      return res.send({ source: "Mongodb", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/test", async (req, res, next) => {
  res.status(200).json({ message: "Test api" });
});

router.get("/docs", async (req, res, next) => {
  res.sendFile("public/api-docs/index.html", { root: "./" });
});

module.exports = router;
