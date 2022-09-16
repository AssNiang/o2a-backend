const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        postId:{
            type:String,
            required: true,
        },

        commenterId:{
            type:String,
            required: true,
        },

        text:{ 
            type:String, 
            required: true 
        },

        likers: {
            type: [String],
            required: true,
        },

        reporters: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps:true
    },  
);

module.exports = mongoose.model('comment', CommentSchema);