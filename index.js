var express = require('express')
var mySQLDAO = require('./mySqlDao')
var mongoDao = require('./mongoDao')
var bodyParser = require('body-parser')
let ejs = require('ejs');
var app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs');

app.listen(3004, () =>{
    console.log("Application is Running...");
}); 

// Get Home Page
app.get('/', (req, res, next) => {
    console.log("GET receieved on /");
    res.render("Home")
});

// Get Students Page
app.get('/students', (req, res, next) => {
    console.log("GET receieved on /students");
    mySQLDAO.getStudent()
        .then((students) => {
            res.render("Students", { student: students });
        })
        .catch((err) => {
            console.error(err);
            res.render("Students", { student: [] }); // Render an empty table in case of an error
        });

});

// Get Edit Student Page
app.get('/edit/:id', (req, res, next) => {
    const studentId = req.params.id;
    mySQLDAO.getStudentById(studentId)
        .then((student) => {
            if (student) {
                res.render("Edit", { student: student });
            } else {
                res.status(404).send("Student not found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving student details");
        });
});

// Post Edit Student Page
app.post('/edit/:id', (req, res, next) => {
    const studentId = req.params.id;
    const { name, age } = req.body;

    // Validate inputs
    if (!name || name.length < 2) {
        return res.status(400).send("Name must be at least 2 characters long");
    }
    if (!age || age < 18) {
        return res.status(400).send("Age must be at least 18");
    }

    const updatedData = { name, age };

    // Call the DAO function
    mySQLDAO.editStudent(studentId, updatedData)
        .then(() => {
            res.redirect('/students');
        })
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).send("Error updating student details");
        });
});

// Get Grades Page
app.get('/grades', (req, res, next) => {
    console.log("GET receieved on /grades");
    mySQLDAO.getGrades()
        .then((grades) => {
            res.render("Grades", { grades: grades });
        })
        .catch((err) => {
            console.error(err);
            res.render("Grades", { grades: [] }); // Render an empty table if an error occurs
        })
});

// Get Lecturers Page
app.get('/lecturers', (req, res, next) => {
    console.log("GET receieved on /lecturers");

    mongoDao.findAll()
        .then((data) => {
            res.render("Lecturers", { lecturers: data }); // Data is already sorted
        })
        .catch((error) => {
            console.log(error);
            res.render("Lecturers", { lecturers: [], error: error.message }); // Handle errors gracefully
        });
});