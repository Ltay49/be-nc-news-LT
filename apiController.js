const endpointsJson = require("./endpoints.json");

const {
  topicFinder,
  getById,
  articleGetter,
  commentById,
  postNewComment,
  votePatchAdd,
  votePatchMinus,
  deleteById,
  getUser,
} = require("./Models/api.model");

const { checkIdExists } = require("./Models/idChecker.model");
const { commentIdExists } = require("./Models/commentIdChecker");
const { columnSorter } = require("./Models/columnSorter");
const { topicFilter } = require("./Models/topicFilter");
const { returnAllTopics } = require("./Models/returnAllTopics");

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
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



exports.getCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [commentById(article_id)];

  if (article_id) {
    promises.push(checkIdExists(article_id));
  }

  Promise.all(promises)
    .then(([comments]) => {
      if (comments.length === 0) {
        return res.status(200).send({
          msg: "this article does not have any comments",
          comments,
        });
      }
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  return postNewComment(newComment, article_id)
    .then((post) => {
      {
        res.status(201).send(post);
      }
    })
    .catch((err) => {
      next(err);
    });
};


exports.deleteComment = (req, res, next) => {
  const { comments_id } = req.params;
  const commentIdInt = parseInt(comments_id);

  return commentIdExists(commentIdInt)
    .then(() => {
      return deleteById(commentIdInt);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  return getUser().then((result) => {
    res.status(200).send(result);
  });
};
