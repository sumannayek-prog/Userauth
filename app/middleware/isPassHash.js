const bcrypt=require('bcryptjs');

const hashPassword=async(password)=>{
    try{
        let hashedPassword=await bcrypt.hash(password,12);
        return hashedPassword;
    }
    catch(err){
        console.log("Error to hash password",err);        
    }
}
const comparePassword=async(password,hashedPassword)=>{
    try{
        const passMatch=await bcrypt.compare(password,hashedPassword);
        return passMatch;
    }
    catch(err){
        console.log("Error to match password",err);        
    }
}
module.exports={
    hashPassword,
    comparePassword
}