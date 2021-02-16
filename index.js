const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
require('dotenv').config();
const app = express();

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
const authRoutes = require('./routes/auth');
const algoRoutes = require("./routes/algo")
const userRoutes = require('./routes/user');

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors())

//route middlewares
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api',algoRoutes)

const port=process.env.PORT||'8080'
app.listen(port,()=>console.log(`Application Running at port ${port}`))