const mongoose = require('mongoose');

const allergieFileSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true,
        },
        posterId: {
            type: String,
            required: true,
        },
        specialistId: {
            type: String,
            required: true,
        },
        allergy_name: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        clinic_sign: {
            type: [String],
            
        },
        symptom : {
            type: [String],
        },
    },
    {
        timestamps: true,
    },
);
 
module.exports = mongoose.model('allergieFile', allergieFileSchema);