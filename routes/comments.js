var express = require('express');
var router = express.Router({mergeParams: true});
var Dog = require('../models/dog');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get("/new", middleware.isLoggedIn, function(req, res){
  Dog.findById(req.params.id, function(err, dog){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {dog: dog});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res){
  Dog.findById(req.params.id, function(err, dog){
    if(err){
      console.log(err);
      res.redirect("/dogs");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong. Please try again later.");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          dog.comments.push(comment);
          dog.save();
          res.redirect("/dogs/" + dog._id);
        }
      });
    }
  });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Dog.findById(req.params.id, function(err, foundDog){
    if(err || !foundDog){
      req.flash("error", "No dog found.");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        req.flash("error", "Something went wrong. Please try again later.");
        res.redirect("back");
      } else {
        res.render("comments/edit", {dog_id: req.params.id, comment: foundComment});
      }
    });
  });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      req.flash("error", "Something went wrong. Please try again later.");
      res.redirect("back");
    } else {
      res.redirect("/dogs/" + req.params.id);
    }
  })
});

//DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      req.flash("error", "Something went wrong. Please try again later.");
      res.redirect("back");
    } else {
      res.redirect("/dogs/" + req.params.id);
    }
  });
});

module.exports = router;