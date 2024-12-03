const UserRepository=require('../user/repository/userRepository');
const {hashPassword,comparePassword} = require('../../middleware/isPassHash');
const {createTransporter,mailSend} = require('../../middleware/isMailTransport');
const fs=require('fs');
const path=require('path');

const jwt=require('jsonwebtoken');

class UserController{
    async postRegister(req,res){
        try{
            if(!req.body.username){
                return res.status(401).json({
                    success:false,
                    message:"Username is required"
                })
            }
            else if(!req.body.email){
                return res.status(401).json({
                    success:false,
                    message:"Email is required"
                })
            }
            else if(!req.body.password){
                return res.status(401).json({
                    success:false,
                    message:"Password is required"
                })
            }
            else if(!req.file.filename){
                return res.status(401).json({
                    success:false,
                    message:"User Image is required"
                })
            }
            else{
                let user_exist=await UserRepository.findUser({email:req.body.email});
                if(!user_exist){
                    let hashedPassword=await hashPassword(req.body.password);
                    let user_details={
                        username:req.body.username.toLowerCase(),
                        email:req.body.email,
                        password:hashedPassword,
                        user_image:req.file.filename
                    }
                    let saved_data=await UserRepository.save(user_details);
                   
                    if(saved_data){
                        const senderEmail=process.env.SENDER_EMAIL;
                        const senderPassword=process.env.SENDER_PASSWORD;
                        const transport=createTransporter(senderEmail,senderPassword);

                        const mailReceiver={
                            from: senderEmail,
                            to: req.body.email,
                            subject: "Email Verification",
                            text: 'Hello'+" "+req.body.username.toUpperCase()+'\n\n'+
                            '\n\nYou have successfully submitted your data to be registered. Please verify your account by copying this link:\n'+
                            'http://'+
                            req.headers.host+
                            '/user/mail_confirmation/'+
                            req.body.email+
                            '\n\nThank you!\n'
                        }
                        mailSend(req,res,transport,mailReceiver);
                    }
                    else{
                        return res.status(401).json({
                            success:false,
                            message:"Token is expired"
                        })
                    }
                }
                else{
                    return res.status(401).json({
                        success:false,
                        message:"User already exists"
                    })
                }
            }
        }
        catch(err){
            console.log("Error to collect user data",err);
            return res.status(401).json({
                success:false,
                message:"Error to collect user details"+err
            })            
        }
    }
    async mailConfirmation(req,res){
        try{
            let user_exist=await UserRepository.findUser({email:req.params.email});
            if(user_exist.isVerify){
                return res.status(201).json({
                    success:false,
                    message:"Verified user, please go to login",
                    status:201
                })
            }
            else{
                user_exist.isVerify=true;
                let save_verified_user=await user_exist.save();
                return res.status(200).json({
                    success:true,
                    message:"You have successfully verified, please go to login",
                    status:200,
                    auth_user:save_verified_user
                })
            }
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Error to verify user" +err
            })
        }
    }
    async postLogin(req,res){
        try{
            if(!req.body.email){
                return res.status(401).json({
                    success:false,
                    message:"Email is required"
                })
            }
            else if(!req.body.password){
                return res.status(401).json({
                    success:false,
                    message:"Password is required"
                })
            }
            else{
                let exist_user=await UserRepository.findUser({email:req.body.email});
                if(exist_user){
                    let compPassword=await comparePassword(req.body.password,exist_user.password);
                    if(compPassword){
                        let token_payload={userData:exist_user};
                        let token_jwt=jwt.sign(token_payload,process.env.SECRET_KEY,{
                            expiresIn:"1h"
                        })
                        return res.status(200).json({
                            success:"You have successfully logged in",
                            status:200,
                            token:token_jwt
                        })
                    }
                    else{
                        return res.status(401).json({
                            success:false,
                            message:"Incorrect password"
                        })
                    }
                }
                else{
                    return res.status(401).json({
                        success:false,
                        message:"Invalid user"
                    })
                }
            }
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Error to collect login data" +err
            })
        }
    }
    getUserDetails(req,res){
        try{
            let view_user=req.user.userData;
            return res.status(200).json({
                success:true,
                message:"Your details have fetched successfully",
                status:200,
                user_details:view_user
            })
        }
        catch(err){
            console.log("Error to fetch user details",err);
            return res.status(401).json({
                success:false,
                message:"Error to retrieve your data" +err
            })
        }
    }
    async updateUserDetails(req,res){
        try{
            if(!req.body.username){
                return res.status(401).json({
                    success:false,
                    message:"Username is required"
                })
            }
            else if(!req.body.email){
                return res.status(401).json({
                    success:false,
                    message:"Email is required"
                })
            }
            else if(!req.body.password){
                return res.status(401).json({
                    success:false,
                    message:"Password is required"
                })
            }
            else if(!req.file.filename){
                return res.status(401).json({
                    success:false,
                    message:"User Image is required"
                })
            }
            else{
                let hashedPassword=await hashPassword(req.body.password);
                let existing_user=await UserRepository.findUserById(req.params.id);
                existing_user.username=req.body.username.toLowerCase()||existing_user.username;
                existing_user.email=req.body.email||existing_user.email;
                existing_user.password=hashedPassword||existing_user.password;
                if(req.file==undefined){
                    existing_user.user_image=existing_user.user_image;
                }
                else{
                    let filePath=path.join("uploads","user",existing_user.user_image);
                    fs.unlinkSync(filePath);
                    existing_user.user_image=req.file.filename;
                }
                let updated_user=await UserRepository.save(existing_user);
                return res.status(200).json({
                    success:true,
                    message:"User details updated successfully",
                    status:200,
                    new_user:updated_user
                })
            }
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Error to update user details" +err
            })
            
        }
    }
}

module.exports=new UserController();