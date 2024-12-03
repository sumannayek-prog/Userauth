require('dotenv').config();
const express=require('express');
const appServer=express();
const PORT=process.env.PORT||5500;
const dbConnect=require('./app/config/db');
const userRouter=require('./app/router/userRouter');

dbConnect();
appServer.use(express.urlencoded({extended:true}));
appServer.use('/uploads',express.static('uploads'));
appServer.use(express.json());

appServer.use(userRouter);
appServer.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});