const mongoose = require('mongoose');
const { isEmail } = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      minLength: 2,
      maxLength: 55,
      trim: true,
    },
    
    last_name: {
      type: String,
      minLength: 2,
      maxLength: 55,
      trim: true,
    },
    
    address: {
      type: String,
    	minLength: 3,
    	maxLength: 255,
    	trim: true,
    },

      user_name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 55,
        unique: true,
        trim: true,
      },
      
      email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        unique: true,
        trim: true,
      },
      
      password: {
        type: String,
        required: true,
        max: 1024,
        minLength: 6,
        unique: true
      },


      is_locked :{
        type: Boolean,
        default: false
      },

      picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
      },
  
    date_of_birth: {
      type: Date,
      minLength: 3,
      maxLength: 55,
      trim: true,
    },
    
    sexe: {
     	type: String,
     	enum: ['Homme', 'Femme'],
    },

    is_patient: {
    type: Boolean,
    default: false
    }, 

    is_specialist: {
      type: Boolean,
      default: false
    },

    is_admin: {
      type: Boolean,
      default: false
    },
    
    postLikes: {
      type : [String]
    },
    commentLikes: {
      type : [String]
    },
    //posts signales
    postReports : {
      type : [String]
    },
    commentReports : {
      type : [String]
    },
    followers : {
      type : [String]
    }
  },

  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;