require ('dotenv').config()
const app =  require('./src/app')
const connectdDb = require('./src/config/databse')



connectdDb()
app.listen(3000,()=>{
    console.log("server is running on port 3000");
    
})
