const express = require ('express')
const app = express()
const {getApi, getTopics} = require('./apiController')



app.get("/api", getApi)

app.get('/api/topics', getTopics)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
  });



module.exports = app