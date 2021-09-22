// Require modules
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
//const cookie = require('cookie');
const session = require("express-session");
var { MongoClient } = require("mongodb");
var apiRouter = require("./routes/amrAPI");
var swaggerJSDoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var ejs = require("ejs");

const options = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
};

const knex = require("knex")(options);

// Change secret to unique value
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: "http://localhost:3000", // restrict calls to those this address
    methods: "GET", // only allow GET requests
  })
);

//_____________________WebScape_________________________
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for WebScape Capstone Project",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves AMR data.",
  },
  servers: [
    {
      url: "http://localhost:8393",
      description: "Development server",
    },
  ],
};

// Setup swagger
const optionsSwagger = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(optionsSwagger);

// connect to the Database
// covid 19 MongoDB
const DATABASE_URL =
  "mongodb+srv://readandwrite:capstone123@amrstaphaureus.zalot.mongodb.net/test";

MongoClient.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async (db) => {
    app.mongodb = db;
    app.emit("ready");
    app.use("/api", apiRouter);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    if (process.env.NODE_ENV === "production") {
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/../client/build/index.html"));
      });
    }
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  })
  .catch((err) => console.log(err));

app.on("ready", () => {
  console.log("Connected successfully to MongoDB server");
});

//_____________________WebScape_________________________

//postgreSQL
const { Client } = require("pg");

const client = new Client(options.connection);
client.connect();

//BodyParser
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//Cytoscape.js
app.use(
  "/cytoscape_scripts",
  express.static(__dirname + "/node_modules/cytoscape/dist/")
);
app.use("/webcola", express.static(__dirname + "/node_modules/webcola/"));
app.use(
  "/cola_scripts",
  express.static(__dirname + "/node_modules/cytoscape-cola/")
);
app.use("/popupS_scripts", express.static(__dirname + "/node_modules/popupS/"));
app.use(
  "/typehead_scripts",
  express.static(__dirname + "/node_modules/typehead/")
);
app.use(
  "/filesaver_scripts",
  express.static(__dirname + "/node_modules/file-saver/")
);

//directories
//------------------------WebScape-------------------------
app.use("/amr", express.static("../client/build"));
//------------------------WebScape-------------------------
app.use(express.static(__dirname + "/views/"));

// set the view engine to ejs
app.set("view engine", "ejs");

// Middleware
let authenticateUserView = require("./middleware/authenticationViewGroup.js");
let authenticateUserEdit = require("./middleware/authenticationEditGroup.js");

/*
ROUTERS
 */
let resultRouter = require("./routes/result");
let advancedSearchRouter = require("./routes/advancedSearch");
let createAccountRouter = require("./routes/createAccount");
let searchResultRouter = require("./routes/searchResults");
let advSearchResultRouter = require("./routes/advSearchResults");
let loginRouter = require("./routes/login");
let favouriteRouter = require("./routes/favourites");
let groupsRouter = require("./routes/groups");
let viewGroupRouter = require("./routes/viewGroup");
let createGroupRouter = require("./routes/createGroup");
let shareGroupRouter = require("./routes/addUserToGroup");
let addGroupSampleRouter = require("./routes/addGroupSample");
let removeGroupRouter = require("./routes/removeGroup");
let removeGroupSampleRouter = require("./routes/removeGroupSample");
let removeUserGroupAccessRouter = require("./routes/removeUserFromGroup");
let uploadResultRouter = require("./routes/uploadResult");
let uploadSampleRouter = require("./routes/uploadSample");
let getCloseSampleRouter = require("./routes/getCloseSamples");

/* --------------------------------------------------------------------------------
 *
 * GET routes
 *
 */

app.use((req, res, next) => {
  req.db = client;
  req.knex = knex;
  next();
});

app.use("/result", resultRouter);
app.use("/advancedSearch", advancedSearchRouter);
app.use("/createAccount", createAccountRouter);
app.use("/searchResults", searchResultRouter);
app.use("/advSearchResults", advSearchResultRouter);
app.use("/login", loginRouter);
app.use("/favourites", favouriteRouter);
app.use("/", groupsRouter);
app.use("/viewGroup", authenticateUserView, viewGroupRouter);
app.use("/removeGroupSample", authenticateUserEdit, removeGroupSampleRouter);
app.use("/addGroupSample", authenticateUserEdit, addGroupSampleRouter);
app.use("/createGroup", createGroupRouter);
app.use("/addUserToGroup", authenticateUserEdit, shareGroupRouter);
app.use(
  "/removeUserFromGroup",
  authenticateUserEdit,
  removeUserGroupAccessRouter
);
app.use("/uploadResult", uploadResultRouter);
app.use("/uploadSample", uploadSampleRouter);
app.use("/removeGroup", removeGroupRouter);
app.use("/getCloseSamples", getCloseSampleRouter);

// index page
app.get("/", function (req, res) {
  let userLoggedIn = req.session.userStatus === "loggedIn";
  let favorites = [];
  let suggested = [];
  let haveFavs = false;
  let haveSugs = false;
  if (userLoggedIn) {
    userLoggedIn = true;
    let value = req.session.userEmail;
    let email = decodeURIComponent(value);
    userNotRegistered = false;

    req.knex
      .select("*")
      .from("user_favorites")
      .where({ email: email })
      .limit(4)
      .then((favs) => {
        if (favs.length > 0) {
          haveSugs = true;
          haveFavs = true;

          req.knex
            .select({
              st: "mlst_mlst.st",
              sample_id: "sample_metadata.sample_id",
              metadata: "sample_metadata.metadata",
              name: "sample_sample.name",
              id: "sample_sample.id",
            }) //TODO: refactor so id is removed
            .from("mlst_mlst")
            .innerJoin(
              "sample_sample",
              "mlst_mlst.sample_id",
              "sample_sample.id"
            )
            .innerJoin(
              "sample_metadata",
              "mlst_mlst.sample_id",
              "sample_metadata.sample_id"
            )
            .modify(function (queryBuilder) {
              queryBuilder.where("mlst_mlst.sample_id", favs[0].sample_id || 0);
              for (i = 1; i < favs.length; i++) {
                queryBuilder.orWhere("mlst_mlst.sample_id", favs[i].sample_id);
              }
            })
            .then((favoriteSamples) => {
              //console.log(sampleInfos);
              for (sampleInfo of favoriteSamples) {
                sampleInfo.country = sampleInfo.metadata.country;
                sampleInfo.strain = sampleInfo.metadata.strain;
                sampleInfo.host = sampleInfo.metadata.host;
                sampleInfo.isolation_source =
                  sampleInfo.metadata.isolation_source;
              }

              knex
                .select("name")
                .from("sample_sample")
                .where({ id: favoriteSamples[0].sample_id })
                .then((result) => {
                  let sampleName = result[0].name;

                  knex
                    .select("*")
                    .from("weighted_distance")
                    .where({ selected_sample: sampleName })
                    .orderBy("distance", "asc")
                    .limit(5)
                    .then((close) => {
                      req.knex
                        .select({
                          st: "mlst_mlst.st",
                          sample_id: "sample_metadata.sample_id",
                          metadata: "sample_metadata.metadata",
                          name: "sample_sample.name",
                          id: "sample_sample.id",
                        }) //TODO: refactor so id is removed
                        .from("mlst_mlst")
                        .innerJoin(
                          "sample_sample",
                          "mlst_mlst.sample_id",
                          "sample_sample.id"
                        )
                        .innerJoin(
                          "sample_metadata",
                          "mlst_mlst.sample_id",
                          "sample_metadata.sample_id"
                        )
                        .modify(function (queryBuilder) {
                          queryBuilder.where(
                            "sample_sample.name",
                            close[0].comparison_sample || 0
                          );
                          for (let i = 1; i < close.length; i++) {
                            queryBuilder.orWhere(
                              "sample_sample.name",
                              close[i].comparison_sample
                            );
                          }
                        })
                        .then((suggestedSamples) => {
                          //console.log(sampleInfos);
                          for (sampleInfo of suggestedSamples) {
                            sampleInfo.country = sampleInfo.metadata.country;
                            sampleInfo.strain = sampleInfo.metadata.strain;
                            sampleInfo.host = sampleInfo.metadata.host;
                            sampleInfo.isolation_source =
                              sampleInfo.metadata.isolation_source;
                          }

                          req.knex
                            .select({
                              st: "mlst_mlst.st",
                              sample_id: "sample_metadata.sample_id",
                              metadata: "sample_metadata.metadata",
                              name: "sample_sample.name",
                              id: "sample_sample.id",
                            })
                            .from("mlst_mlst")
                            .innerJoin(
                              "sample_sample",
                              "mlst_mlst.sample_id",
                              "sample_sample.id"
                            )
                            .innerJoin(
                              "sample_metadata",
                              "mlst_mlst.sample_id",
                              "sample_metadata.sample_id"
                            )
                            .orderByRaw("random()")
                            .limit(4)
                            .then((random) => {
                              for (const same of random) {
                                same.country = same.metadata.country;
                                same.strain = same.metadata.strain;
                                same.host = same.metadata.host;
                                same.isolation_source =
                                  same.metadata.isolation_source;
                              }
                              res.render("pages/index", {
                                userLoggedIn: userLoggedIn,
                                randomSamples: random,
                                favorites: favoriteSamples,
                                suggested: suggestedSamples,
                                haveFavs: haveFavs,
                                haveSugs: haveSugs,
                              });
                            });
                        });
                    });
                });
            });
        } else {
          req.knex
            .select({
              st: "mlst_mlst.st",
              sample_id: "sample_metadata.sample_id",
              metadata: "sample_metadata.metadata",
              name: "sample_sample.name",
              id: "sample_sample.id",
            })
            .from("mlst_mlst")
            .innerJoin(
              "sample_sample",
              "mlst_mlst.sample_id",
              "sample_sample.id"
            )
            .innerJoin(
              "sample_metadata",
              "mlst_mlst.sample_id",
              "sample_metadata.sample_id"
            )
            .orderByRaw("random()")
            .limit(4)
            .then((random) => {
              for (const same of random) {
                same.country = same.metadata.country;
                same.strain = same.metadata.strain;
                same.host = same.metadata.host;
                same.isolation_source = same.metadata.isolation_source;
              }
              res.render("pages/index", {
                userLoggedIn: userLoggedIn,
                randomSamples: random,
                haveFavs: false,
                haveSugs: false,
              });
            });
        }
      });
  } else {
    req.knex
      .select({
        st: "mlst_mlst.st",
        sample_id: "sample_metadata.sample_id",
        metadata: "sample_metadata.metadata",
        name: "sample_sample.name",
        id: "sample_sample.id",
      })
      .from("mlst_mlst")
      .innerJoin("sample_sample", "mlst_mlst.sample_id", "sample_sample.id")
      .innerJoin(
        "sample_metadata",
        "mlst_mlst.sample_id",
        "sample_metadata.sample_id"
      )
      .orderByRaw("random()")
      .limit(4)
      .then((random) => {
        for (const same of random) {
          same.country = same.metadata.country;
          same.strain = same.metadata.strain;
          same.host = same.metadata.host;
          same.isolation_source = same.metadata.isolation_source;
        }
        res.render("pages/index", {
          userLoggedIn: userLoggedIn,
          randomSamples: random,
          haveFavs: false,
          haveSugs: false,
        });
      });
  }
});

app.get("/logout", function (req, res) {
  req.session.userStatus = "loggedOut";
  res.clearCookie("setCookie");
  console.log("logout user");
  res.redirect("/");
});

app.get("/tutorials", function (req, res) {
  userLoggedIn = req.session.userStatus === "loggedIn";
  res.render("pages/tutorials", { userLoggedIn: userLoggedIn });
});

app.listen(process.env.PORT);
console.log(process.env.PORT + " is the magic port");
