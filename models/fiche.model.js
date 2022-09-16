const mongoose = require('mongoose');

const allergieFicheSchema = new mongoose.Schema(
    {
        postId:  {
            type: String,
            required: true,
        },
        patientId:  {
            type: String,
            required: true,
        },
        specialistId:  {
            type: String,
        }, 
        chatBot:  {
            type : [
                {
                symptoms: [String],
                food: [String],
                environmentFactor: [String],
                domesticAnimal: [String],
                drugsTook: [String],
                timestamp: Number,
                },
            ],
            required: true,
        },
        chat:  {
            type : [
                {
                userChat: String,
                specialistChat: String,
                timestamp: Number,
                },
            ],
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ficheAllergies', allergieFicheSchema);