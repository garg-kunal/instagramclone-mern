const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const SECRETKEY = "Don't Share With Anyone";
const auth = require("../middleware");
const Profile = require("../models/profile");
const Request = require("../models/request");

hashPassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const hashPwd = await bcrypt.hash(password, 10);
    console.log(hashPwd, password);
    req.password = hashPwd;
    next();
  } catch (error) {
    console.error(error);
  }
};

router.post("/register", hashPassword, (req, res) => {
  try {
    const pass = req.password;
    const email = req.body.email;
    const out = validator.isEmail(email);
    if (!out) {
      return res.json({
        message: "Please Enter a Valid Email",
      });
    }
    Profile.findOne({ email }, (err, result) => {
      if (result)
        return res.json({
          message: "User Already Exists",
        });
      new Profile({
        email: req.body.email,
        password: pass,
        name: req.body.name,
      }).save((err, data) => {
        if (err) {
          res.json({
            message: "Registeration failed",
          });
          console.log("err " + err);
        } else {
          res.json({
            message: "Registered",
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", (req, res) => {
  const out = validator.isEmail(req.body.email);
  if (out) {
    Profile.findOne({ email: req.body.email }, (err, result) => {
      if (err) {
        return res.sendStatus(402).json({ err });
      }
      if (result) {
        bcrypt.compare(
          req.body.password,
          result.password,
          function (err, isMatch) {
            if (err) {
              throw err;
            } else if (!isMatch) {
              console.log("Password doesn't match!");
              res.json({
                message: "Password Doesn't Matched!!!",
              });
            } else {
              console.log("Password matches!");
              const user = {
                email: result.email,
                name: result.name,
                id: result._id,
                image: result.image,
              };
              jwt.sign(
                { user },
                SECRETKEY,
                { expiresIn: "4h" },
                (err, token) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({
                      token: token,
                      message: "Login Succesfully",
                      user,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        res.json({
          message: "User Not Exist",
        });
      }
    });
  } else {
    res.json({
      message: "Enter a Valid Email",
    });
  }
});
router.get("/verify", auth, (req, res) => {
  res.json({
    email: req.userData.user.email,
    name: req.userData.user.name,
    id: req.userData.user.id,
    image: req.userData.user.image,
  });
});
router.get("/users/:id", auth, (req, res) => {
  console.log(req.params.id);
  Profile.find({ _id: { $ne: req.params.id } })
    .select("-password")
    .exec(function (err, data) {
      if (err) res.sendStatus(402);
      if (data) {
        res.json({
          data,
        });
      }
    });
});

router.post("/follow", auth, (req, res) => {
  console.log(req.body);
  Profile.findByIdAndUpdate(
    { _id: req.body.me },
    { $push: { followers: req.body.followId } },
    { new: true },
    (err, data) => {
      if (err) console.log(err);
      Profile.findByIdAndUpdate(
        { _id: req.body.followId },
        { $push: { follow: req.body.me } },
        { new: true },
        (err, result) => {
          if (err) console.log(err);
          else {
            Request.remove(
              { to: req.body.me, from: req.body.followId },
              (err, result) => {
                if (err) console.log(err);
                else {
                  res.json({
                    message: "Request Accepted",
                  });
                }
              }
            );
          }
        }
      );
    }
  );
});

module.exports = router;
