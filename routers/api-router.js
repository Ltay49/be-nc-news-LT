const express = require('express');
const apiRouter = express.Router();
const { getApi } = require('../apiController'); 


apiRouter.get("/", getApi);

module.exports = apiRouter;