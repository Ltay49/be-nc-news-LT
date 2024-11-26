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
