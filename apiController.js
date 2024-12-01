const endpointsJson = require("./endpoints.json");

const {
  getById,
  commentById,
  postNewComment,
  deleteById,
  getUser,
  getUserByUsername,
} = require("./Models/api.model");

const { voteCountComments } = require("./Models/commentVoteModel");
const { checkIdExists } = require("./Models/idChecker.model");
const { commentIdExists } = require("./Models/commentIdChecker");

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
  const { username } = req.params;

  if (username && (typeof username !== "string" || !isNaN(username))) {
    return res.status(400).send({ msg: "username type not accepted" });
  }

  if (username) {
    return getUserByUsername(username)
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        next(err);
      });
  }
  return getUser()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVote = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
 
  return voteCountComments(comment_id, inc_votes).then((comment) => {
    res.status(200).send(comment);
  });
};
