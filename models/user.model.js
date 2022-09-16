const mongoose = require('mongoose');
const { isEmail } = require('validator');
// const { isMobilePhone } = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      minLength: 3,
      maxLength: 55,
      trim: true,
    },
    
    last_name: {
      type: String,
      minLength: 3,
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
  
    // phone_number: {
    //   type: String,
    //   // validate: [isMobilePhone],
    //   // unique: true,
    //   required: true,
    //   default: "xx xxx xx xx",
    //   max: 20,
    //   minlength: 5,
    //   trim: true,
    //   },

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
    
    postikes: {
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

//play function before save into display: 'block',
// userSchema.pre("save", async function(next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.statics.login = async function(email, password) {
//   const user = await this.findOne({ email });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error('incorrect password');
//   }
//   throw Error('incorrect email')
// };

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;