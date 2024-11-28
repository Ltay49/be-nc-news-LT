const db = require('../db/connection')

exports.topicFilter = (search,topic) => {
return db.query(`SELECT * FROM articles WHERE ${search} ILIKE $1`,[`${topic}%`])
.then((result) =>{
    if(result.rows.length === 0){
        return Promise.reject({
            status:404,
            msg:`there are no topics called ${topic}`
        })
    }
    return result.rows
})
}