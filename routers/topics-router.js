const express = require("express");
const topicsRouter = express.Router();
const { getTopics } = require("../controllers/getTopics");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
