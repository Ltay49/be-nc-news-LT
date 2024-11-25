const express = require("express");
const app = express();
const { getApi, getTopics, getArticle, getArticles, getCommentById } = require("./apiController");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/article/:article_id", getArticle);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentById)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

app.all('*',(req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
