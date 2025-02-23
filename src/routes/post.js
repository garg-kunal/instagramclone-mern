const express = require("express");
const router = express.Router();
const imagemiddle = require("../postimagemiddle");
const auth = require("../middleware");
const Post = require("../models/post");
const fs = require("fs");

router.post("/post", auth, imagemiddle, (req, res) => {
  const image = req.body.photo ? req.file.filename : "";
  new Post({
    body: req.body.body,
    photo: image,
    postedBy: req.body.user,
    mainId: req.body.mainId,
  }).save((err, data) => {
    if (err) {
      if ("./uploads/posts/" + req.file.filename) {
        fs.unlink("./uploads/posts/" + image, (err) => {
          console.log(err);
        });
      }
    } else {
      res.json({
        message: "Post posted",
      });
    }
  });
});

router.get("/allposts", auth, (req, res) => {
  Post.find({})
    .sort("-createdAt")
    .exec(function (err, data) {
      if (err) console.log(err);
      else {
        res.json({
          data,
        });
      }
    });
});
router.get("/allpost/:id", auth, (req, res) => {
  console.log(req.params.id);
  Post.find({ mainId: req.params.id })
    .sort("-createdAt")
    .exec(function (err, data) {
      if (err) console.log(err);
      else {
        res.json({
          data,
        });
      }
    });
});
router.get("/delete/:id", auth, (req, res) => {
  Post.remove({ _id: req.params.id }).exec(function (err, data) {
    if (err) console.log(err);
    else {
      res.json({
        message: "Post Deleted",
      });
    }
  });
});

router.post("/getlike", (req, res) => {
  Post.findOne(
    { _id: req.body.postId, "likes.likedId": req.body.me },
    (err, result) => {
      if (err) console.log(err);
      if (result) {
        console.log(result.likes.length);
        res.json({
          message: result.likes.length,
        });
      }
    }
  );
});
router.post("/unlike", (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    { $pull: { likes: { likedId: req.body.me } } },
    { new: true },
    (err, result) => {
      if (err) console.log(err);
      else {
        res.json({
          message: result.likes.length,
        });
      }
    }
  );
});

router.put("/setlike", auth, (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    { $push: { likes: { likedId: req.body.me } } },
    { new: true },
    (err, result) => {
      if (err) console.log(err);
      else {
        res.json({
          message: result.likes.length,
        });
      }
    }
  );
});

router.post("/comment", auth, (req, res) => {
  console.log(req.body);
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    { $push: { comment: { postedBy: req.body.me, body: req.body.comment } } },
    { new: true },
    (err, result) => {
      if (err) console.log(err);
      else {
        res.json({
          message: "Commnet Add",
        });
      }
    }
  );
});
router.get("/getcmt/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, result) => {
    if (err) console.log(err);
    else {
      res.json({
        data: result.comment,
      });
    }
  });
});

module.exports = router;
