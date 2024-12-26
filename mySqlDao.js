// Cian Dicker-Hughes
//G00415413
var pmysql = require("promise-mysql")
var pool

pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
    })
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("pool error:" + e)
    })

var getStudent = function() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student')
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

var getStudentById = function(studentId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student WHERE sid = ?', [studentId])
            .then((data) => {
                resolve(data[0]); // Return the first result
            })
            .catch((error) => {
                reject(error);
            });
    });
};

var editStudent = function(studentId, updatedData) {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE student SET name = ?, age = ? WHERE sid = ?', 
            [updatedData.name, updatedData.age, studentId]
        )
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

var addStudent = function(newStudent) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', 
            [newStudent.sid, newStudent.name, newStudent.age])
            .then(() => {
                console.log("Student added successfully");
                resolve();
            })
            .catch((error) => {
                console.error("Database insert error:", error);
                reject(error);
            });
    });
};

var getModule = function() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM module')
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

var getGrades = function() {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT 
                student.name AS studentName,
                module.name AS moduleName,
                grade.grade
            FROM 
                grade
            INNER JOIN 
                student ON grade.sid = student.sid
            INNER JOIN 
                module ON grade.mid = module.mid
            ORDER BY 
                student.name ASC, grade.grade ASC;

        `)
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

module.exports = { getStudent, getStudentById, editStudent, addStudent, getModule, getGrades }

    