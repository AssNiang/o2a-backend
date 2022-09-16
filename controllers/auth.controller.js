const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');


const maxAge = 3 * 24 * 60 * 60 * 1000; //3 jours
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.signUp =  (req, res) => {
    try {
           bcrypt.hash(req.body.password, 10)
                .then(
                    hash => {
                        const user = new UserModel({
                            last_name: req.body.last_name,
                            first_name: req.body.first_name,
                            address: req.body.address,
                            email: req.body.email,
                            user_name: req.body.user_name,
                            password: hash,
                        });
                        user.save()
                        .then(() =>res.status(201).send("user:"+ user))
                        .catch((error) => res.status(400).send(error));
                     }
                 ).catch((err) => {
                    const errors = signUpErrors(err);
                    res.status(200).send(errors);
                });
         }catch(err){
            res.status(200).send(err);
        }
} ;
module.exports.signIn= async (req, res ) => {
    const {email, password} = req.body;
    
    try {
        const user = UserModel.findOne({ email:email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = createToken(user._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge});
                return res.status(200).send("id:" + user._id); 
            }
            throw Error('incorrect password');

        }
        throw Error('incorrect email')
    } catch(err){
        const errors = signInErrors(err);
        res.status(200).send(errors);
    } 
} 

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {maxAge:1});
    res.redirect('/');
}