const express = require("express");
const router = express.Router();
const Request = require("../models/request");
const auth = require("../middleware");
const Profile = require("../models/profile");

router.post("/send", auth, (req, res) => {
  console.log(req.body.to);
  Profile.findOne(
    { _id: req.body.to, followers: req.body.from },
    (err, result) => {
      if (result) {
        res.json({
          message: "You already following",
        });
      } else {
        Request.findOne(
          { to: req.body.to, from: req.body.from },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              res.json({
                message: "Already Request sent",
              });
            } else {
              new Request({
                to: req.body.to,
                from: req.body.from,
                name: req.body.name,
                image: req.body.image,
              }).save((err, data) => {
                if (err) {
                  res.json({
                    message: "Please Try again after sometime",
                  });
                } else {
                  res.json({
                    message: "Request Sent",
                  });
                }
              });
            }
          }
        );
      }
    }
  );
});

router.get("/getrequest/:id", auth, (req, res) => {
  if (!req.params.id) {
    res.sendStatus(400);
    return;
  }

  Request.find({ to: req.params.id }, (err, data) => {
    if (err) console.log(err);
    if (data) {
      res.json({
        data,
      });
    } else {
      res.sendStatus(400).json({
        data: null,
      });
    }
  });
});

module.exports = router;
