const db = require("../db/connection");

exports.commentIdExists = (commentIdInt) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentIdInt])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "Sorry, but this Id doesn't exist.",
            });
          }
    });
};
