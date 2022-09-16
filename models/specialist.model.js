const mongoose  = require('mongoose');

const specialistSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },

        followings:  {
            type : [String]
        },
    
        matricule: {
                type: String,
                unique: true,
                trim: true,
                required: true,
            },
        
        professionnal_address: {
                type: String,
                required: true,
            },
    
            workplace: {
                type: String,
                required: true,
            },
    
            job: {
                type: String,
                required: true,
            },
        },
        {
          timestamps: true,
        }
);

module.exports = mongoose.model('specialist', specialistSchema);


