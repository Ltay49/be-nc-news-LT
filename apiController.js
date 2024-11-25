const endpointsJson = require("./endpoints.json");

const { topicFinder, getById } = require("./api.model");

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  return topicFinder().then((topics) => {
    res.status(200).send({ topics });
  })
  .catch((err) => {
    next(err);
  });
};

exports.getArticle = (req, res, next) => {
  const {article_id} = req.params
  return getById(article_id).then((article) =>{
    res.status(200).send({article})
  })
  .catch((err) => {
    next(err);
  });

}
