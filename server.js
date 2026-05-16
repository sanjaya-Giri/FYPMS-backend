import { connectDB } from "./config/db.js";
import app from "./app.js"


connectDB();

const PORT =process.env.PORT||4000;

const server=app.listen(PORT,()=>{
    console.log(`server running  on port ${PORT}`);
    
})


process.on("unhandledRejection",(err)=>{
    console.log("unhandled rejection",err.message);
    server.close(()=>process.exit(1));
    
})
process.on("uncaughtException",(err)=>{
    console.log("uncaught  exception",err.message);
    process.exit(1);
    
})

export default server;