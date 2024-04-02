import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import 'dotenv/config'



const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/tweetDB");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, excludeFromEncryption: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((foundUser) => {
    if (foundUser) {
      console.log(foundUser.password);
      console.log(password);
      if (foundUser.password == password) {
        res.redirect("/tweets");
      } else {
        res.redirect("/login");
    } 
    } else {
      res.redirect('/login')
    }

    });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save();
  res.send("tweets");
});

app.get("/tweets", (req, res) => {
  res.redirect("/tweets");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
