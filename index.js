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