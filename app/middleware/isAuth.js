const jwt=require('jsonwebtoken');

class AuthJwt{
    async authJwt(req,res,next){
        try{
            const authHeader=req.headers['x-access-token'];
            if(!authHeader){
                const error=new Error("Not authenticated");
                error.status=401;
                throw error;
            }
            else{
                jwt.verify(authHeader,process.env.SECRET_KEY,(err,data)=>{
                    if(err){
                        console.log("Verification failed");
                        next();
                    }
                    else{
                        req.user=data;
                        next();
                    }
                })
                next();
            }
        }
        catch(err){
            console.log("Error to verify token",err);            
        }
    }
}
module.exports=new AuthJwt();