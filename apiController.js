const endpointsJson = require("./endpoints.json");

const { topicFinder, getById, articleGetter } = require("./api.model");

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  const path = req.path.split("/");
  const endpoint = path[path.length - 1];
  return topicFinder(endpoint)
    .then((topics) => {
      res.status(200).send({ topics });
    })
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


