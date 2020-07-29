var express = require("express"),//express: app.use, app.get...
	app = express(),
	bodyParser = require("body-parser"),//get req.body
	passport = require("passport"),//for auth
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),// for route PUT and DELETE	
	flash = require("connect-flash");
	


var back = require('express-back');


//require models
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
//require routes
var commentRoutes = require("./routes/comments")
var campgroundRoutes = require("./routes/campgrounds")
var indexRoutes = require("./routes/index")





var seedDB = require("./seeds.js");// seedDB prefilled data


//set mongoose
const mongoose = require('mongoose');//for data

//mongoose.connect('mongodb://localhost:27017/yelp_camp', {
var url = process.env.DATABASEURL;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


//seedDB();

app.use(express.static(__dirname + "/public"));// to access .css file
app.use(bodyParser.urlencoded({extended: true}));// to use bodyParser
app.use(methodOverride("_method"));// to use methodOverride
app.set("view engine", "ejs");


//passport config
app.use(require("express-session")({
	secret:"Tianjiao, you should think about yourself before 30",
	resave:false,
	saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(back());
app.use(flash());// need after passport


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.get("*", function(req, res){
	res.send("Sorry, page not found...");
});

app.listen(process.env.PORT ||3000, function(){
	console.log("connected!")
});