var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");
var middleware = require("../middleware");

//landing
router.get("/", function(req, res){
	res.render("landing");
});


//register-form
router.get("/register", function(req, res){
	res.render("register");
});

//register
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/register");
		}else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp" + user.username);
				res.redirect("/campgrounds");   
			});
		}
	});
});

//login-form
router.get("/login", function(req, res){
	res.render("login");
});


//login
router.post("/login", passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}),function(req, res){
	 //res. redirect(req.session.prevPrevPath || "/campgrounds");
});

//logout
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/campgrounds");
	// var str= req.session.prevPath;
	// str = str.substr(str.length-3, 3);
	// if(str === "new" ){
	// res. redirect(req.session.prevPrevPath || "/campgrounds");
	// }else{
	// res. redirect(req.session.prevPath || "/campgrounds");
	// }
});



module.exports = router;