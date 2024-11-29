const db = require("../db/connection");

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

exports.articleGetter = () => {
  const query = `SELECT 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url, 
  COALESCE(COUNT(comments.comment_id), 0) AS comment_count
FROM 
  articles
LEFT JOIN 
  comments
ON 
  articles.article_id = comments.article_id
GROUP BY 
  articles.article_id
ORDER BY 
  articles.created_at DESC;`;

  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.commentById = (article_id) => {
  const query = `SELECT 
comment_id,
votes,
created_at,
author,
body,
article_id
FROM comments
WHERE article_id = $1
ORDER BY created_at DESC;`;
  return db.query(query, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.postNewComment = ({ username, body }, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) 
       VALUES ($1, $2, $3) 
       RETURNING author AS username, body`,
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.votePatchAdd = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.votePatchMinus = (article_id, inc_votes) => {
  const adjustedVotes = Math.abs(inc_votes);
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes - $1
    WHERE article_id = $2
    RETURNING *;
  `,
      [adjustedVotes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.deleteById = (comments_id) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1`,
      [comments_id]
    )
    .then((result) => {
      return result;
    });
};

exports.getUser = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};
