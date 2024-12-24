var express = require('express')
// var mySQLDAO = require('./mySqlDao')
let ejs = require('ejs');
var app = express();

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
    res.render("Lecturers")
});