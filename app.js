const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

//Extended true allows any data to be passed through
//Extended false allows only string and arrays
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator()); //MUST PLACE VALIDATOR AFTER BODY PARSER
app.use(express.static("public"));

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

let userData = {
  name: "",
  email: "",
  age: 1
};

let messages = [];

app.get("/", function(req, res){
  console.log(req.body);
  res.render("index", {errors: messages});
  messages = [];
});

app.post("/", function(req, res) {
  //Validation checks
  req.checkBody("name", "Invalid Name Entered").notEmpty().isLength({max: 30});
  req.checkBody("age", "Invalid Age Entered").notEmpty().isInt();
  req.checkBody("email", "Invalid Email Entered").notEmpty().isEmail();

  let errors = req.validationErrors();

  if (errors) {
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    res.redirect("/");
  }
  else{
    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.age = req.body.age;
    res.redirect("/submit");
  }
});

app.get("/submit", function(req, res){
  res.render("submit", userData);
});

app.use(function(req, res, next){
  var err = new Error('This page does not exist!')
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  res.status (err.status || 500)
    if(err.status == 404){
      res.render('404', {error: err});
    }
    else{
      res.render(500, {error: err});
    }
});

app.listen(3000, function(){
  console.log("App running on localhost:3000");
});
