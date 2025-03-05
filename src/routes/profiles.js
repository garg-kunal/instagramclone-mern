const express = require("express");
const router = express.Router();
const userProfile = require("../models/profile");
const auth = require("../middleware");
const imagemulter = require("../imagemiddle");
const fs = require("fs");

router.post("/create", auth, imagemulter, (req, res) => {
  const payload = {
    body: req.body.body,
    name: req.body.name,
  };

  if (req.file) {
    const base64String = req.file.buffer.toString("base64");
    payload["image"] = "data:image/png;base64," + base64String;
  }

  userProfile
    .findOneAndUpdate(
      { _id: req.body.userId },
      { $set: payload },
      { new: true }
    )
    .then((data) => {
      if (data) {
        return res.json({
          data,
        });
      }
      if ("./uploads/biopics/" + req.file.filename) {
        fs.unlink("./uploads/biopics/" + image, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });
      }
      res.sendStatus(402);
    });
});

router.get("/get/:id", auth, (req, res) => {
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
