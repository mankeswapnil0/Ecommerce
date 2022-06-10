const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Your Name"],
        maxlength:[30, "Name cannot exceed 30 characters"],
        minlength:[4, "Name should have more than 4 characters"],
    },
    email:{
        type:String,
        required:[true, "Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail, "Please Enter a Valid Email"]
    },
    password:{
        type:String,
        required:[true, "Please Enter Your Password"],
        minlength:[8, "Password should be greater than 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now, 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

// before updating any data
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// creating jwt tokwn
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id : this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

// checking password in db
userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

//generating reset password token
userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(10).toString("hex");

    //hashing and adding to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);