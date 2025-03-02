const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const RequestSchema = new mongoose.Schema({
  to: {
    type: ObjectId,
    required: true,
  },
  from: {
    type: ObjectId,
    required: true,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
  },
});
module.exports = mongoose.model("Request", RequestSchema);
