const endpointsJson = require("./endpoints.json");

const { topicFinder } = require("./api.model");

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
