require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(express.static("public")); // to use the static file from public folder
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); // add it before creating a model, plugins are used to extend schemas their functionality

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });


    newUser.save(function(err){
        if(err){
            console.log(err);
        } else{
            res.render("secrets");
        }
    });
});


app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){   // when we later use find the password filed gets decrypted
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    console.log("user exists!")
                    res.render("secrets");
                }
            }
        }
    })

})

app.listen(3000, function(){
    console.log("Server is running at port: 3000")
})