const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const specialistRoutes = require('./routes/specialist.routes');
const adminRoutes = require('./routes/admin.routes');
const cookieParser = require('cookie-parser');
const databaseHelper = require('./config/database');
const cors = require('cors');
require('dotenv').config({path:'./config/.env'});
require('./config/db');
const  {checkUser, requiredAuth} = require('./middleware/auth.middleware');

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));
//database
databaseHelper.connect();


// jwt
app.get('*', checkUser);
app.get('/jwtid', requiredAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});
  
//routes
app.use('/api/user', userRoutes); 
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/user/specialist', specialistRoutes);
app.use('/api/user/admin', adminRoutes);


const server = app.listen(process.env.PORT || 3000, ()=> {
  console.log(`Listening on port ${process.env.PORT}`);
});


module.exports = {server};