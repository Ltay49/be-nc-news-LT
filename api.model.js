const db = require('./db/connection')

exports.topicFinder = () => {
    const query = 'SELECT * FROM topics;';

    return db.query(query).then((result)=>{
        console.log(result.rows)
        return result.rows;
    })

}