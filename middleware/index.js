var middlewareObj={};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error", "You Need Login");
		res.redirect("/login");
	}
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				console.log(err);
				req.flash("error", "Campground cannot found");
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You Need be the owner");
					res.redirect("back");
				}
			}
		});
	
	}else{
		req.flash("error", "You Need Login");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				console.log(err);
				req.flash("error", "Comment cannot found");
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You Need be the owner");
					res.redirect("back");
				}
			}
		});
	
	}else{
		req.flash("error", "You Need Login");
		res.redirect("back");
	}
}

module.exports = middlewareObj;
