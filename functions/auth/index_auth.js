const deleteUserRoute = require("./delete_user.js");
const updatePassword = require("./update_password.js");
const signUp = require("./sign_up.js");
const login = require("./login.js");
const updateUserData = require("./update_user_data.js");
// eslint-disable-next-line new-cap
const Router = require("express").Router();

Router.post("/sign_up", signUp);
Router.post("/login", login);
Router.post("/delete_user", deleteUserRoute);
Router.post("/update_password", updatePassword);
Router.post("/update_user_data", updateUserData);

module.exports = Router;
