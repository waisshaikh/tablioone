const mongoose = require('mongoose');

async function connectDb (){
    mongoose.connect(process.env.MONGOOSE_URI)
    .then(()=>{
        console.log("Database Conneted");
        
    })
}

module.exports=connectDb