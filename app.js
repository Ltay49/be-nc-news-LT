const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticle,
  getArticles,
  getCommentById,
  postComment,
  patchVotes,
  deleteComment,
  getUsers
} = require("./apiController");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/article/:article_id", getArticle);
app.use(express.json());
app.patch("/api/articles/:article_id", patchVotes);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentById);
app.use(express.json());
app.post("/api/articles/:article_id/comments", postComment);

app.get('/api/users', getUsers)

app.delete('/api/comments/:comments_id', deleteComment)



app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
  next(error);
});

module.exports = app;
 
