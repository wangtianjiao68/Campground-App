var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");

//index
router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

//new
router.post("/", middleware.isLoggedIn, function(req, res){
	 Campground.create(
 	{
		name: req.body.newCamp,
		image: req.body.newUrl,
		description: req.body.newDes,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	},
	function(err, campground){
 	if(err){
		console.log(err);
	}else{ 		
		console.log("create camp");
 		//console.log(campground); 	
	}
 });
	
	res.redirect("/campgrounds");
});

//new-form
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});


//show
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//edit-form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
});

//edit-update
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds/" + req.params.id);
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//delete
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error);
    res.redirect("/campgrounds");
  }
});


module.exports = router;