// Cian Dicker-Hughes
// G00415413
var express = require('express')
var mySQLDAO = require('./mySqlDao')
var mongoDao = require('./mongoDao')
var bodyParser = require('body-parser')
let ejs = require('ejs');
var app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'));
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
app.get('/students/edit/:id', (req, res, next) => {

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
app.post('/students/edit/:id', (req, res, next) => {
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

    // Call the DAO to Edit Student
    mySQLDAO.editStudent(studentId, updatedData)
        .then(() => {
            res.redirect('/students');
        })
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).send("Error updating student details");
        });
});

// Get Add Student Page
app.get('/students/add', (req, res) => { // Render add.ejs with an empty student object and idExists flags
    res.render("add", { student: {}, idExists: false }); 
});

// Post add Student to handle form submission for adding a new student
// Handle student addition, validate input, and handle duplicate ID errors.
app.post('/students/add', (req, res) => {
    const { sid, name, age } = req.body;

    // Validate inputs
    if (!sid || sid.length !== 4) {
        return res.status(400).send("Student ID must be 4 characters long");
    }
    if (!name || name.length < 2) {
        return res.status(400).send("Name must be at least 2 characters long");
    }
    if (!age || age < 18) {
        return res.status(400).send("Age must be at least 18");
    }

    // Prepare the student data
    const newStudent = { sid, name, age };

    // Call the DAO to insert the new student
    mySQLDAO.addStudent(newStudent)
        .then(() => {
            res.redirect('/students'); // Redirect to the students list
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            const idExists = true; 
            res.render('add', { idExists }); // Render Add page with the flag
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