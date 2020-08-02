const path = require("path");
const sequelize = require("./sequelize");

require("dotenv-safe").config({
  path: path.join(__dirname, "../../.env"),
  sample: path.join(__dirname, "../../.env.example"),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db: sequelize,
};
