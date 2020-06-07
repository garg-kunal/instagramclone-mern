const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,

    },
    photo: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    },
    mainId: {
        type: ObjectId,
        required: true
    },
    likes: [{
        likedId: ObjectId
    }],
    comment: [{
        postedBy: String,
        body: String
    },
    { timestamps: true }]
},
    {
        timestamps: true
    })

module.exports = mongoose.model("Post", postSchema);