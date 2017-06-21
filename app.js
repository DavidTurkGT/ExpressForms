const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

//Extended true allows any data to be passed through
//Extended false allows only string and arrays
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

let userData = {
  name: "",
  email: "",
  age: 1
};

app.get("/", function(req, res){
  console.log(req.body);
  res.render("index", {name: "David"});
});

app.post("/", function(req, res) {
  userData.name = req.body.name;
  userData.email = req.body.email;
  userData.age = req.body.age;

  res.redirect("/submit");
});

app.get("/submit", function(req, res){
  res.render("submit", userData);
});

app.listen(3000, function(){
  console.log("App running on localhost:3000");
});
