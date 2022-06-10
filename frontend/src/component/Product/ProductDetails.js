import React, { Fragment, useEffect } from 'react'
import Carousel from 'react-material-ui-carousel'
import './ProductDetails.css'
import { useParams } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {clearErrors, getProductDetails, newReview} from '../../actions/productAction'
import ReviewCard from './ReviewCard.js'
import Loader from '../layout/loader/Loader'
import {useAlert} from 'react-alert'
import MetaData from '../layout/MetaData';
import { useState } from 'react';
import {addItemsToCart} from "../../actions/cartAction";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Rating } from '@mui/material';
import { NEW_REVIEW_RESET } from '../../constants/productConstant';



function ProductDetails() {
    const params = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const {product, loading, error} = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const options = {
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    }

    const increaseQuantity = () => {
        if(product.stock <= quantity) return;
        const qty = quantity + 1;
        setQuantity(qty);
    }
    const decreaseQuantity = () => {
        const qty = quantity - 1;
        if(qty>0){
            setQuantity(qty);
        }
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(params.id, quantity));
        alert.success("Item Added To Cart");
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }

    const reviewSubmitHandler = () => {
        const myform = new FormData();
        myform.set("rating", rating);
        myform.set("comment", comment);
        myform.set("productId", params.id);
        dispatch(newReview(myform));
        setOpen(false);
    }

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(reviewError){
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if(success){
            alert.success("Review Submitted Successfully");
            dispatch({type: NEW_REVIEW_RESET});
        }
        dispatch(getProductDetails(params.id));
    }, [dispatch, params.id, error, alert, success, reviewError])
    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                <MetaData title={`${product.name} -- ECOMMERCE`} />
                <div className='productDetails'>
                    <div className='images'>
                        <Carousel>
                            {product.images && product.images.map((item, i) => (
                                <img 
                                    className='carouselImage'
                                    key={item.url}
                                    src={item.url}
                                    alt={`${i} Slide`}
                                />
                            ))}
                        </Carousel>
                    </div>
                    <div className='details'>
                        <div className='detailsBlock1'>
                            <h2>{product.name}</h2>
                            <p>Product # {product._id}</p>
                        </div>
                        <div className='detailsBlock2'>
                            <Rating {...options} />
                            <span className='detailsBlock2-span'>({product.numOfReview} Reviews)</span>
                        </div>
                        <div className='detailsBlock3'>
                            <h1>{`₹${product.price}`}</h1>
                            <div className='detailsBlock3-1'>
                                <div className='detailsBlock3-1-1'>
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input readOnly value={quantity} type="number"/>
                                    <button onClick={increaseQuantity}>+</button>
                                </div>
                                <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler}>Add To Cart</button>
                            </div>
                            <p>
                                Status:
                                <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                                </b>
                            </p>
                        </div>
                        <div className='detailsBlock4'>
                            Description : <p>{product.description}</p>
                        </div>
                        <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button> 
                    </div>
                    </div>
                    <h3 className='reviewsHeading'>REVIEWS</h3>
                    <Dialog
                        aria-label='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                            <Rating 
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />
                            <textarea 
                                className='submitDialogTextArea'
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                            <DialogActions>
                                <Button onClick={submitReviewToggle} color="secondary" >Cancel</Button>
                                <Button onClick={reviewSubmitHandler}>Submit</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                    {product.reviews && product.reviews[0] ? (
                        <div className='reviews'>
                            {product.reviews &&
                            product.reviews.map(review => <ReviewCard key={product._id} review={review} />)}
                        </div>
                    ) : (
                        <p className='noReviews'>No Reviews Yet</p>
                    )}
                </Fragment>
            }
        </Fragment>
    )
}

export default ProductDetails
