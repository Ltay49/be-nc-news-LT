const db = require('../db/connection')

exports.voteCounter = (article_id) =>{
return db.query('SELECT votes FROM articles WHERE article_id = $1 RETURNING *', [article_id]).then((result)=>{
    return result.votes[0]
})

}