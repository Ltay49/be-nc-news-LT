const {topicFinder} = require('../Models/api.model')

exports.getTopics = (req, res, next) => {
    const path = ["topics"]
   return topicFinder(path).then((topics) => {
     res.status(200).send({ topics });
   });
 };