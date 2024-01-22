const CreateNewPickupRequest = require('./create_new_pr');
const updatePickupRequest = require('./update_pr');
const deletePickupRequest = require('./delete_pr');
const Router = require("express").Router();

Router.post("/create", CreateNewPickupRequest);
Router.post("/update", updatePickupRequest);
Router.post("/delete", deletePickupRequest);

module.exports = Router;
