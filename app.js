const express = require ('express')
const app = express()
const {getApi, getTopics, getArticle} = require('./apiController')



app.get("/api", getApi)

app.get('/api/topics', getTopics)

app.get('/api/article/:article_id', getArticle)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
  });



module.exports = app