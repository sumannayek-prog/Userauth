const nodemailer=require('nodemailer');

const createTransporter=(senderEmail,senderPassword)=>{
    const transporter=nodemailer.createTransport({
        host:'smtp',
        port:465,
        secure:false,
        requireTLS:true,
        service:'gmail',
        auth:{
            user:senderEmail,
            pass:senderPassword,
        },
    });
    return transporter;
};

const mailSend=(req,res,transport,mailReceiver)=>{
    transport.sendMail(mailReceiver,(err)=>{
        if(err){
            console.log("Error to send mail",err);
            return res.status(401).json({
                success:false,
                message:"Error to send mail verification link"+err
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message:"Successfully sent mail verification link to your mailbox",
                status:200
            })
        }
    })
}

module.exports={
    createTransporter,
    mailSend
}