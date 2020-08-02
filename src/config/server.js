const express = require("express");
// const graphql = require("../graphql");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("../routes");
const passport = require("passport");

// define app
const app = express();

// add plugins
const corsOptions = {
  origin: ["http://somedomain.com"],
  methods: ["GET", "POST", "PUT"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// restrict hosts
const allowedHosts = [
  "localhost:3000",
  // "google.com"
];
app.use((req, res, next) => {
  const host = req.headers.host;
  if (!host || !allowedHosts.includes(host)) {
    return res.status(403).send("invalid host");
  }
  return next();
});

// configure passport.js
require("./passport")(passport);
app.use(passport.initialize());

// configure graphql
// app.use("/graphql", graphql);

// add routes
app.use("/", routes);

module.exports = app;
