// Cian Dicker-Hughes
// G00415413
const MongoClient = require("mongodb").MongoClient;

var db;
var coll;

// Connenct to MongoDB
MongoClient.connect("mongodb://127.0.0.1:27017")
  .then((client) => {
    db = client.db("proj2024MongoDB");
    coll = db.collection("lecturers");
  })
  .catch((error) => {
    console.log(error.message);
  });

// Find all lecturers
var findAll = function () {
  return new Promise((resolve, reject) => {
    coll
      .find()
      .sort({ _id: 1 })
      .toArray() // Sort by _id in ascending order
      .then((documents) => {
        resolve(documents);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Delete lecturer from MongoDB
const deleteLecturerById = async (lecturerId) => {
  try {
    const result = await coll.deleteOne({ _id: lecturerId });
    return result;
  } catch (error) {
    throw new Error(`Error deleting lecturer: ${error.message}`);
  }
};

// Add Lecturer to DB
const addLecturer = async (lecturer) => {
  try {
    await coll.insertOne(lecturer);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Duplicate Lecturer ID.");
    }
    throw new Error(`Error adding lecturer: ${error.message}`);
  }
};

module.exports = { findAll, deleteLecturerById, addLecturer };
