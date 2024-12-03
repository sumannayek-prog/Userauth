const mongoose=require('mongoose');

const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("Error to connect database",err);        
    }
}

module.exports=dbConnect;