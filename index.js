const express= require("express");
const mongoose = require("mongoose")
const cors= require("cors")
require("dotenv").config();
const app=express();

//db connection
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true,
    useCreateIndex:true,
})
.then(()=>console.log("DB Connected"))
.catch((err)=>console.log("DB connection error",err))


//routes
const loginRoutes = require("./routes/user")

//middlewares
app.use(cors())

//route middlewares
app.use("/app",loginRoutes)

app.listen(8000,()=>console.log("Application Running at port 8000"))