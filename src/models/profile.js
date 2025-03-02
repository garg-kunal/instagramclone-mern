const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const profileSchema = new mongoose.Schema(
  {
    image: {
      default: "user.jpg",
      trim: true,
      type: String,
    },
    body: {
      default: "Not Yet",
      type: String,
      trim: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      minglength: 6,
    },
    followers: [
      {
        type: ObjectId,
      },
    ],
    follow: [
      {
        type: ObjectId,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", profileSchema);
