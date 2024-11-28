const db = require('../db/connection')

exports.returnAllTopics = (search) => {
    return db.query(`SELECT ${search} FROM articles`)
    .then((result)=>{
        return result.rows
    })
}