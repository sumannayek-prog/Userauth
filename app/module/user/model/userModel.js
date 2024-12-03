const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    user_image:{
        type:String,
        required:true
    },
    isVerify:{
        type:Boolean,
        default:false
    },
},
{
    timestamps:true,
    versionKey:false,
});
const UserModel=new mongoose.model('users',UserSchema);
module.exports=UserModel;