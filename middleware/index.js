var Dog = require('../models/dog');
var Comment = require('../models/comment');

var middlewareObject = {};

middlewareObject.checkDogOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Dog.findById(req.params.id, function(err, foundDog){
      if(err || !foundDog){
        req.flash("error", "Dog not found.");
        res.redirect("back")
      } else {
        if(foundDog.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please log in.");
    res.redirect("back");
  }
}

middlewareObject.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        req.flash("error", "Comment not found.");
        res.redirect("back")
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please log in.");
    res.redirect("back");
  }
}

middlewareObject.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login.");
  res.redirect("/login");
}

module.exports = middlewareObject;