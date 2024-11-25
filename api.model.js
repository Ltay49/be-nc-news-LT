const db = require('./db/connection')

exports.topicFinder = () => {
    const query = 'SELECT * FROM topics;';

    return db.query(query).then((result)=>{
        return result.rows;
    })

}

exports.getById = (article_id) => {
const query = `SELECT article_id, title, body, topic, author, created_at, votes, article_img_url
FROM articles
WHERE article_id = $1;`

return db.query(query,[article_id]).then((result)=>{
    if(result.length === 0){
        return Promise.reject({
            status: 404,
            msg: "Not Found"
        })
        
        
    }
    return result.rows;
})
.catch((err) =>{
    next(err)
})
}
