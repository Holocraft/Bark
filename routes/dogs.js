var express = require('express');
var router = express.Router();
var Dog = require('../models/dog');
var middleware = require('../middleware');

router.get("/", function(req, res){
  Dog.find({}, function(err, allDogs){
    if(err){
      console.log(err);
    } else {
      res.render("dogs/index", {dogs: allDogs});
    }
  })
  
});

//create new dog
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newDog = {name: name, image: image, description: desc, author: author};
  Dog.create(newDog, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/dogs");
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("dogs/new");
});

router.get("/:id", function(req, res){
  Dog.findById(req.params.id).populate("comments").exec(function(err, foundDog){
    if(err || !foundDog){
      req.flash("error", "Dog not found.");
      res.redirect("back");
    } else {
      res.render("dogs/show", {dog: foundDog});
    }
  });
});

//EDIT
router.get("/:id/edit", middleware.checkDogOwnership, function(req, res){
  Dog.findById(req.params.id, function(err, foundDog){
    if(err || !foundDog){
      req.flash("error", "Dog not found.");
      res.redirect("back");
    } else {
      res.render("dogs/edit", {dog: foundDog});
    }
  });
});

//UPDATE
router.put("/:id", middleware.checkDogOwnership, function(req, res){
  Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
    if(err){
      res.redirect("/dogs");
    } else {
      res.redirect("/dogs/" + req.params.id);
    }
  });
});

//DELETE
router.delete("/:id", middleware.checkDogOwnership, function(req, res){
  Dog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/dogs");
    } else{
      res.redirect("/dogs");
    }
  })
});

module.exports = router;