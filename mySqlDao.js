// Cian Dicker-Hughes
// G00415413
var pmysql = require("promise-mysql");
var pool;

// Create a MySQL connection pool with a limit of 3 connections to the 'proj2024mysql' database.
pmysql
  .createPool({
    connectionLimit: 3,
    host: "localhost",
    user: "root",
    password: "root",
    database: "proj2024mysql",
  })
  .then((p) => {
    pool = p;
  })
  .catch((e) => {
    console.log("pool error:" + e);
  });

// Get Student from DataBase
var getStudent = function () {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM student")
      .then((data) => {
        console.log("D=" + JSON.stringify(data));
        resolve(data);
      })
      .catch((error) => {
        console.log("E=" + JSON.stringify(error));
        reject(error);
      });
  });
};

// Get Student by Id from DataBase
var getStudentById = function (studentId) {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM student WHERE sid = ?", [studentId])
      .then((data) => {
        resolve(data[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Edit Student from DataBase
var editStudent = function (studentId, updatedData) {
  return new Promise((resolve, reject) => {
    pool
      .query("UPDATE student SET name = ?, age = ? WHERE sid = ?", [
        updatedData.name,
        updatedData.age,
        studentId,
      ])
      .then(() => {
        console.log("Update successful for student:", studentId);
        resolve();
      })
      .catch((error) => {
        console.error("Database update error:", error);
        reject(error);
      });
  });
};

// add Student to the DataBase
var addStudent = function (newStudent) {
  return new Promise((resolve, reject) => {
    pool
      .query("INSERT INTO student (sid, name, age) VALUES (?, ?, ?)", [
        newStudent.sid,
        newStudent.name,
        newStudent.age,
      ])
      .then(() => {
        console.log("Student added successfully");
        resolve();
      })
      .catch((error) => {
        console.error("Database insert error:", error);
        if (error.code === "ER_DUP_ENTRY") {
          reject(new Error("Duplicate Student ID"));
        } else {
          reject(error);
        }
      });
  });
};

// Delete Student from the Database
var deleteStudent = function (studentId) {
  return new Promise((resolve, reject) => {
    pool
      .query("DELETE FROM student WHERE sid = ?", [studentId])
      .then(() => {
        console.log("Student deleted successfully:", studentId);
        resolve();
      })
      .catch((error) => {
        console.error("Database delete error:", error);
        reject(error);
      });
  });
};

// get Module from DataBase
var getModule = function () {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM module")
      .then((data) => {
        console.log("D=" + JSON.stringify(data));
        resolve(data);
      })
      .catch((error) => {
        console.log("E=" + JSON.stringify(error));
        reject(error);
      });
  });
};

// Function to get modules by lecturer ID
var getModuleByLecturer = function (lecturerId) {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM module WHERE lecturer = ?", [lecturerId])
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching modules for lecturer:", error);
        reject(error);
      });
  });
};

// get Grades for all stutents from DataBase
var getGrades = function () {
  return new Promise((resolve, reject) => {
    pool
      .query(
        `
            SELECT 
                student.name AS studentName,
                module.name AS moduleName,
                grade.grade
            FROM 
                student
            LEFT JOIN 
                grade ON student.sid = grade.sid
            LEFT JOIN 
                module ON grade.mid = module.mid
            ORDER BY 
                student.name ASC, grade.grade ASC;
        `
      )
      .then((data) => {
        console.log("D=" + JSON.stringify(data));
        resolve(data);
      })
      .catch((error) => {
        console.log("E=" + JSON.stringify(error));
        reject(error);
      });
  });
};

module.exports = {
  getStudent,
  getStudentById,
  editStudent,
  addStudent,
  deleteStudent,
  getModule,
  getModuleByLecturer,
  getGrades,
};
