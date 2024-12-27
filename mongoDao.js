// Cian Dicker-Hughes
// G00415413
const { json } = require('express')
const MongoClient = require('mongodb').MongoClient
const mysqlDao = require('./mySqlDao'); // Import MySQL DAO

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

// find all lecturers
var findAll = function() {
    return new Promise((resolve, reject) => {
        coll.find().sort({ _id: 1 }).toArray() // Sort by _id in ascending order
            .then((documents) => {
                resolve(documents);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Function to delete lecturer from MongoDB
const deleteLecturerById = async (lecturerId) => {
    try {
        const result = await coll.deleteOne({ _id: lecturerId });
        return result;
    } catch (error) {
        throw new Error(`Error deleting lecturer: ${error.message}`);
    }
};

module.exports = { findAll, deleteLecturerById };      