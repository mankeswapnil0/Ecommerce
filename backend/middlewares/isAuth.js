const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/userModel');


exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({_id:decodeData.id});
    next();
})

exports.isRoleAuth = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}