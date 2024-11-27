const express = require("express");
const app = express();
const { getApi, getTopics, getArticle, getArticles, getCommentById, postComment, patchVotes} = require("./apiController");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/article/:article_id", getArticle);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentById)

app.use(express.json());

app.post('/api/articles/:article_id/comments', postComment)


app.all('*', (req, res, next) => {
    res.status(404).send({ msg: "Route Not Found" })
    next(error);
  });

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
