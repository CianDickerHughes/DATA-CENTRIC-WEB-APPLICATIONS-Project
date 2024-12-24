const MongoClient = require('mongodb').MongoClient

var db;
var coll;

MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2024MongoDB')
        coll = db.collection('lecturers')
    })
    .catch((error) => {
    console.log(error.message)
    });


var findAll = function() {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })}
/*
var addEmployee = function(employee) {
    return new Promise((resolve, reject) => {
        coll.insertOne(employee)
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}*/
        

module.exports = { findAll };