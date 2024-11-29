const { votePatchAdd, votePatchMinus } = require("../Models/voteModel");

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;

  const { inc_votes } = req.body;

  if (isNaN(inc_votes)) {
    return res
      .status(400)
      .send({ msg: "bad request: not a valid vote input, try again" });
  }

  if (inc_votes < 0) {
    return votePatchMinus(article_id, inc_votes).then((article) => {
      res.status(200).send(article);
    });
  }

  return votePatchAdd(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
