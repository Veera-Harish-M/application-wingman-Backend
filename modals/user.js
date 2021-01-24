const mongoose=require("mongoose")
const crypto = require("crypto")

//schema
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    hashed_password:{
        type:String,
        required:true
    },
    salt:{
        type:String
    },
    photo:{
        type:String,
        required:true
    }
},
{timestamps:true});



userSchema.methods={
    setPassword : (password) =>{ 
    this.salt = crypto.randomBytes(16).toString('hex'); 
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
    },    
    
    validatePassword : (password)=> { 
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
	return this.hashed_password === hash; 
    } 
}

module.exports = mongoose.model('User', userSchema); 

