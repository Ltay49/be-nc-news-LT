const endpointsJson = require("./endpoints.json");

const { topicFinder, getById, articleGetter, commentById } = require("./api.model");


exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  const path = req.path.split("/");
  const endpoint = path[path.length - 1];
  return topicFinder(endpoint).then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "bad request, not a valid input" });
  }
  return getById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res) => {
  return articleGetter()
    .then((articles) => {
      articles.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentById = (req, res, next) => {
   const {article_id} = req.params
  return commentById(article_id).then((comments) => {
    res.status(200).send(comments);
  })
  .catch((err) => {
    next(err);
  })
};
