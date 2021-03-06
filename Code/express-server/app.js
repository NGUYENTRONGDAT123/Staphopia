var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var { MongoClient } = require("mongodb");
var apiRouter = require("./routes/api");
var swaggerJSDoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../client/build")));

app.use(cors());

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/../client/build/index.html'));
// });

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
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

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

app.on("exit", function () {
  redisClient.quit();
});

module.exports = app;
