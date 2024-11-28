const db = require("../db/connection");

exports.columnSorter = (sort_by, order_by) => {

    const query =`SELECT 
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
    ${sort_by} ${order_by};`
    return db.query(query).then((reulst)=>{
        return reulst.rows
    })
};
