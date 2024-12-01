const db = require("../db/connection");

exports.voteCountComments = (comment_id, inc_votes) => {
  const query = `UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *;`;

  return db.query(query, [comment_id, inc_votes]).then(({ rows }) => {
    return rows[0];
  });
};
