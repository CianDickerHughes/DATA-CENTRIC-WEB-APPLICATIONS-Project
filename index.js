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


app.get('/', (req, res, next) => {
    console.log("GET receieved on /");
    res.render("Home")
});

app.get('/Students', (req, res, next) => {
    console.log("GET receieved on /Students");
    res.render("Students")
});

app.get('/Grades', (req, res, next) => {
    console.log("GET receieved on /Grades");
    res.render("Grades")
});

app.get('/Lecturers', (req, res, next) => {
    console.log("GET receieved on /Lecturers");

    mongoDao.findAll()
        .then((data) => {
            res.render("Lecturers", { lecturers: data }); // Data is already sorted
        })
        .catch((error) => {
            console.log(error);
            res.render("Lecturers", { lecturers: [], error: error.message }); // Handle errors gracefully
        });
});