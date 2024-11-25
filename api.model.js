const db = require("./db/connection");

exports.topicFinder = (endpoint) => {
  const query = `SELECT * FROM ${endpoint}`;
  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.getById = (article_id) => {
  const query = `SELECT article_id, title, body, topic, author, created_at, votes, article_img_url
FROM articles
WHERE article_id = $1;`;

  return db.query(query, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Article not found",
      });
    }
    return result.rows;
  });
};

