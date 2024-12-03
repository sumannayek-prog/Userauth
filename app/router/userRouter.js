const express=require('express');
const userRouter=express.Router();
const uploadImage=require('../helper/userImage');
const UserController=require('../module/webservice/userController');
const AuthJwt=require('../middleware/isAuth');

userRouter.post('/user/postregdata',uploadImage.single("user_image"),UserController.postRegister);
userRouter.get('/user/mail_confirmation/:email',UserController.mailConfirmation);
userRouter.post("/user/postlogdata",UserController.postLogin);
userRouter.get('/user/getuserdata',AuthJwt.authJwt,UserController.getUserDetails);
userRouter.put('/user/updateuserdata/:id',uploadImage.single("user_image"),UserController.updateUserDetails);

module.exports=userRouter;