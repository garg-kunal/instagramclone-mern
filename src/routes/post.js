const express = require("express");
const router = express.Router();
const imagemiddle = require("../postimagemiddle");
const auth = require("../middleware");
const Post = require("../models/post");
const fs = require("fs");

function extractMetaData(posts, userId) {
  try {
    return posts.map((post) => {
      const isLikedByUser =
        post.likes.filter((like) => like.likedId.toString() === userId)
          ?.length > 0;

      return {
        ...post._doc,
        isLikedByUser,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
      };
    });
  } catch (err) {
    console.error(err);
  }
}

router.post("/create", auth, imagemiddle, (req, res) => {
  try {
    const body = {
      body: req.body.body,
      userName: req.body.userName,
      userId: req.body.userId,
      userImage: req.body.userImage,
    };

    if (req.file) {
      const base64String = req.file.buffer.toString("base64");
      body["photo"] = "data:image/png;base64," + base64String;
    }

    const newPost = new Post(body);

    newPost.save((err, data) => {
      if (err) {
        console.error(err);
        // if (req.body.photo) {
        //   fs.unlink(`./uploads/posts/${body.image}`, (unlinkErr) => {
        //     if (unlinkErr) {
        //       console.error("Error deleting file:", unlinkErr);
        //     }
        //   });
        // }
        return res.status(500).json({ error: "Failed to save post" });
      }

      res.json({ message: "Post posted", post: data });
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/get", auth, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const userId = req.userData.user.id;

  Post.find({})
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch posts" });
      } else {
        Post.countDocuments({}, (countErr, count) => {
          if (countErr) {
            return res.status(500).json({ error: "Failed to count posts" });
          } else {
            res.json({
              data: extractMetaData(data, userId),
              currentPage: page,
              totalPages: Math.ceil(count / limit),
              totalPosts: count,
            });
          }
        });
      }
    });
});

router.get("/postsByUserId/:id", auth, (req, res) => {
  Post.find({ userId: req.params.id })
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
  Post.findOne({ _id: req.body.postId }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      const isLikedByUser = result.likes.filter(
        (like) => like.likedId.toString() === req.body.me
      );
      res.json({
        message: result.likes.length,
        isLikedByUser: isLikedByUser.length > 0,
      });
    }
  });
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

router.put("/like", auth, (req, res) => {
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

router.post("/createComment", auth, (req, res) => {
  const comment = { postedBy: req.body.me, body: req.body.comment };
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    { $push: { comments: comment } },
    { new: true },
    (err, result) => {
      if (err) console.log(err);
      else {
        res.json({
          data: comment,
        });
      }
    }
  );
});

router.get("/getComments/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, result) => {
    if (err) console.log(err);
    else {
      res.json({
        data: result.comments || [],
      });
    }
  });
});

module.exports = router;
