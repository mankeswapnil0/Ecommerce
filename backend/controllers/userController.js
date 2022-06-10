const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require("cloudinary");

//regiter a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    })

    const {name, email, password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }
    })
    sendToken(user, 201, res);
})


// user login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    // checking for empty inputs
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Credentials", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatched = await user.checkPassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    sendToken(user, 200, res);
})

//logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully"
    })
})

// forgot password
exports.forgotPassword = catchAsyncErrors( async(req, res, next) => {
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }
    //get reset password token
    const resetToken = user.getResetPasswordToken();

    // save token in user Schema
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it.`

    try{
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to user successfully`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        // returning to original state
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
})

//reset password
exports.resetPassword = catchAsyncErrors( async(req, res, next) => {

    //creating token hash
    resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    //searching user
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if(!user){
        return next(new ErrorHandler("Reset Password token is invalid or has been expired", 400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not macth", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // returning to original state
    await user.save();

    sendToken(user, 200, res);
})

// user details
exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})


// update user password
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.checkPassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next(new ErrorHandler("old Password is incorrect"), 401);
    }

    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match"), 401);
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
})


// update user profile
exports.updateProfile = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder:"avatars",
            width:150,
            crop:"scale",
        })
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success:true
    });
})


// get All user details -- admin
exports.getAllUser = catchAsyncErrors( async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success:true,
        users,
    })
})


// get single user details -- admin
exports.getSingleUser = catchAsyncErrors( async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user,
    })
})

// update user role -- Admin
exports.updateRole = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success:true
    });
})

// delete user -- Admin
exports.deleteUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id)
    // remove cloud part later
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    
    await user.remove();

    res.status(200).json({
        success:true,
        message: "User Deleted Successfully"    
    });
})