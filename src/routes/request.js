const express = require("express");
const router = express.Router();
const Request = require("../models/request");
const auth = require("../middleware");
const Profile = require("../models/profile");

router.post("/send", auth, (req, res) => {
  try {
    const userId = req.userData.user.id;
    if (req.body.to === userId) {
      return res.status(404).json({
        message: "You can't connection request to yourself.",
      });
    }

    Profile.findOne(
      { _id: req.body.to, followers: req.body.from },
      (err, result) => {
        if (result) {
          res.json({
            message: "You are already following",
          });
        } else {
          Request.findOne(
            { to: req.body.to, from: req.body.from },
            (err, data) => {
              if (err) console.log(err);
              if (data) {
                res.json({
                  message: "Request already sent to the user.",
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
                      message: "Please try again after sometime",
                    });
                  } else {
                    res.json({
                      message: "Request Sent.",
                    });
                  }
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
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
