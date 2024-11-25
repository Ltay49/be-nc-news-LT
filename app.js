const express = require ('express')
const app = express()
const {getApi} = require('./apiController')



app.get("/api", getApi)









module.exports = app