const express = require("express");
const app = express();
const {
  getArticle,
  getArticles,
  getCommentById,
  postComment,
  patchVotes,
  deleteComment,
  getUsers,
} = require("./apiController");

const { apiRouter, topicsRouter, articlesRouter} = require("./routers/");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);


app.get("/api/articles/:article_id/comments", getCommentById);
app.use(express.json());
app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comments_id", deleteComment);

app.use((err, req, res, next) => {
  if (err.code === "42703") {
    res
      .status(404)
      .send({ msg: "articles does not have this catagory to sort by" });
  }
  if (err.code === "23502") {
    res.status(404).send({ msg: "this article id does not exist yet" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "Sorry, but this username doesn't exist." });
  }
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

module.exports = app;
