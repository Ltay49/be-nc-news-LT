const {columnSorter , returnAllTopics, topicFilter, articleGetter} = require('../Models/articles.model')

exports.getArticles = (req, res, next) => {
    const { sort_by, order_by, topic, search } = req.query;
    if (sort_by) {
      return columnSorter(sort_by, order_by)
        .then((sorted) => {
          sorted.forEach((article) => {
            article.comment_count = Number(article.comment_count);
          });
          res.status(200).send(sorted);
        })
        .catch((err) => {
          next(err);
        });
    }
  
    if (search && !topic) {
      return returnAllTopics(search).then((result) => {
        res.status(200).send(result);
      });
    }
  
    if (topic) {
      return topicFilter(search, topic)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          next(err);
        });
    }
  
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



