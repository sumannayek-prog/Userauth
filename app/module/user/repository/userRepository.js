const UserModel=require('../model/userModel');

class UserRepository{
    async save(data){
        try{
            let addUser=await UserModel.create(data);
            return addUser;
        }
        catch(err){
            console.log("Error to save user data",err);
        }
    }
    async findUser(query){
        try{
            let searchUser=await UserModel.findOne(query);
            return searchUser;
        }
        catch(err){
            console.log("Error to find user details",err);
        }
    }
    async findUserById(user_id){
        try{
            let user_data=await UserModel.findById(user_id);
            return user_data;
        }
        catch(err){
            console.log("Error to find user by id",err);
            
        }
    }
}
module.exports=new UserRepository();