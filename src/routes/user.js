const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const auth = require("../middleware");
const Profile = require("../models/profile");
const Request = require("../models/request");
const Post = require("../models/post");

const SECRETKEY = process.env.SECRET_KEY;

const hashPassword = async (req, res, next) => {
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
      return res.status(402).json({
        message: "Please Enter a Valid Email",
      });
    }

    Profile.findOne({ email }, (err, result) => {
      if (result) {
        return res.status(402).json({
          message: "User Already Exists",
          code: "user_exists",
        });
      }

      new Profile({
        email: req.body.email,
        password: pass,
        name: req.body.name,
      }).save((err, data) => {
        if (err) {
          return res.json({
            message: "Registration failed",
            code: "registration_failed",
          });
        }
        res.json({
          message: "Registered",
          code: "registered",
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", (req, res) => {
  try {
    const isValid = validator.isEmail(req.body.email);

    if (!isValid) {
      return res.json({
        message: "Enter a Valid Email",
      });
    }

    Profile.findOne({ email: req.body.email }, (err, result) => {
      if (err) {
        return res.sendStatus(402).json({ err });
      }
      if (!result) {
        return res.json({
          message: "User Not Exist",
          code: "user_not_exist",
        });
      }
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
              code: "password_mismatch",
            });
          } else {
            const user = {
              email: result.email,
              id: result._id,
            };
            jwt.sign({ user }, SECRETKEY, { expiresIn: "4h" }, (err, token) => {
              if (err) {
                console.log(err);
              } else {
                res.json({
                  token: token,
                  message: "Login Succesfully",
                  user,
                  code: "login_success",
                });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/verify", auth, async (req, res) => {
  try {
    const postCount = await Post.countDocuments({
      userId: req.userData.user.id,
    });
    const user = await Profile.findOne({
      email: req.userData.user.email,
    }).select("-password");
    if (user) {
      return res.json({
        data: { ...user._doc, postCount },
      });
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/all", auth, (req, res) => {
  const userId = req.userData.user.id;
  try {
    Profile.find({
      _id: { $ne: userId },
    })
      .select("-password")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          res.sendStatus(402);
        }
        if (data) {
          res.json({
            data,
          });
        }
      });
  } catch (error) {
    console.error(error);
  }
});

router.post("/follow", auth, (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
