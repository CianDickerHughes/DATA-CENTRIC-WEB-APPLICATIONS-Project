var pmysql = require("promise-mysql")
var pool

pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'studentdb4'
    })
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("pool error:" + e)
    })

var getStudent = function() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student_table')
        .then((data) => {
            console.log("D="+ JSON.stringify(data))
            resolve(data)
        })
        .catch((error) => {
            console.log("E="+ JSON.stringify(error))
            reject(error)
        })
    })
}

module.exports = {getStudent}

    