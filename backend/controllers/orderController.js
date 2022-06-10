const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


// Create new Order
exports.newOrder = catchAsyncErrors( async(req, res, next) => {
    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice, 
        taxPrice, 
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    })
    res.status(201).json({
        success: true,
        order,
    })
})


// get logged in user orders
exports.myOrder = catchAsyncErrors( async(req, res, next) => {
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    });
});



// get single order details
exports.getSingleOrder = catchAsyncErrors( async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    
    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


// get all orders -- admin
exports.getAllOrder = catchAsyncErrors( async(req, res, next) => {
    const orders = await Order.find();
    
    let totalAmount = 0;
    orders.forEach( order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});


// update order status -- admin
exports.updateOrder = catchAsyncErrors( async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new ErrorHandler("Order not foung with Id", 404));
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }
    if(req.body.status==="Shipped"){
        order.orderItems.forEach( async (item) => { 
            await updateStock(item.product, item.quantity);
        });
    }

    order.orderStatus = req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave:false });
    res.status(200).json({
        success: true,
        order,
    });
});

// func to update stock
async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave:false });
}



// delete orders -- admin
exports.deleteOrder = catchAsyncErrors( async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new ErrorHandler("Order not foung with id"), 404);
    }
    await order.remove();

    res.status(200).json({
        success: true,
    });
});


