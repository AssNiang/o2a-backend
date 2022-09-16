const mongoose = require('mongoose');


mongoose
.connect(
    "mongodb+srv://"+process.env.DB_HOST+"@allergiessocialnetwok.mkbztua.mongodb.net/O2A_database",
    // "mongodb://localhost:27017/O2A-database",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        // useCreateIndex:true,
        // useFindAndModify:false,
    }
)
.then(()=>console.log("connected to Mongodb !"))
.catch((err)=>console.log("failed to connect to Mongodb", err));