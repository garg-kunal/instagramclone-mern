const express = require("express");
const router = express.Router();
const userProfile = require("../models/profile");
const auth = require("../middleware");
const imagemulter = require("../imagemiddle");
const fs = require("fs");

router.post("/profile", auth, imagemulter, (req, res) => {
  const image = req.file.filename;
  console.log(req.body);
  userProfile
    .findOneAndUpdate(
      { _id: req.body.mainId },
      { $set: { image: image, body: req.body.body } },
      { new: true }
    )
    .then((data) => {
      if (data) {
        res.json({
          message: "Bio Updated",
        });
      } else {
        if ("./uploads/biopics/" + req.file.filename) {
          fs.unlink("./uploads/biopics/" + image, (err) => {
            console.log(err);
          });
        }
        res.sendStatus(402);
      }
    });
});

router.get("/getprofile/:id", auth, (req, res) => {
  console.log(req.params.id);
  userProfile.findOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.sendStatus(400);
    }
    if (data) {
      console.log("found");
      res.json({
        data,
      });
    } else {
      res.json({
        data: {
          body: "...",
          image: " ",
        },
      });
    }
  });
});

router.get("/getusers", auth, (req, res) => {
  userProfile.find({}, (err, data) => {
    if (err) {
      res.sendStatus(400);
    }
    if (data) {
      console.log("found");
      res.json({
        data,
      });
    } else {
      console.log("not found");
      res.json({
        message: " No user profile",
      });
    }
  });
});
module.exports = router;
