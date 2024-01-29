const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
/**
 * @param {express.Express} app
 * @return {void}
 */
function setupMiddleware(app) {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      }),
  );
}

module.exports = setupMiddleware;
