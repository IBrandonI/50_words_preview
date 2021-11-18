//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require ("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));


app.get("/", function(require, response){
    response.sendFile(__dirname + "/index.html")
});

app.post("/", callPython);

var jsonArray 
//Llamamos al script con child_process y se añade a la base de datos:
function callPython (req, res){
    var originalText = req.body.content;
    //Retiramos dobles espacios y saltos de linea y lo guardamos en finalText:
    var finalText = originalText.replace(/(\r\n|\n|\r|\s+)/gm, " ");
    const { spawn } = require('child_process');
    //Pasamos la string finalText como un argumento para el uso del script:
    const pyProg = spawn('python', ['./src/python_script.py', finalText]);
    //Hacemos uso de los datos que nos proporciona el script y se muestra en pantalla:
    pyProg.stdout.on('data', function(data) {
        jsonArray = JSON.parse(data.toString());
        res.send(jsonArray);
        res.end();
    });
    
}

app.listen(3000, function(){
    console.log("Is your fridge running. Well, you better catch it")
});