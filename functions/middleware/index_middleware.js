const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
/**
 * @param {express.Express} app
 * @return {void}
 */
/**
 * @param {express.Express} app
 * @return {void}
 */
function setupMiddleware(app) {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());
}

module.exports = setupMiddleware;
