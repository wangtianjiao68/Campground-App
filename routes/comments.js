var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//commentnew
router.post("/", middleware.isLoggedIn, function(req, res){
	
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
            Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campgrounds/" + req.params.id);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save()
					foundCampground.comments.push(comment);
					foundCampground.save();
					//console.log("Created new comment");
					req.flash("success", "You leave a comment");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

//commentnew-form
router.get("/new", middleware.isLoggedIn, function(req, res){
	
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds/" + req.params.id);
		}else{
			res.render("comments/new", {campground: foundCampground});
		}
	});
});


//commentedit-form
//edit-form

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				console.log(err);
				res.redirect("/campgrounds/" + req.params.id);
			}else{
			res.render("comments/edit", {campground_id:req.params.id, comment: foundComment});
			}
		});
});


//commentedit-update

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds/" + req.params.id);
		}else{
			req.flash("success", "comment updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
               //req.flash("error", "Could not DELETE comment!");
               console.log(err);
            	res.redirect("/campgrounds/" + req.params.id);
        } else {
            //remove comment id from campgrounds db
            Campground.findByIdAndUpdate(req.params.id, {
                $pull: {comments: req.params.comment_id}
            }, function(err, data){
                if(err){
                    //req.flash("error", "Could not DELETE comment!");
                    console.log(err);
					res.redirect("/campgrounds/" + req.params.id);
                } else {
                    req.flash("success", "comment deleted");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        };
    });
});



module.exports = router;