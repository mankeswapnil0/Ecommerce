import React, { Fragment, useEffect, useState } from 'react';
import './Products.css'
import {clearErrors, getProduct} from '../../actions/productAction'
import {useSelector, useDispatch} from 'react-redux'
import Loader from '../layout/loader/Loader'
import ProductCard from '../Home/ProductCard.js'
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import {useAlert} from 'react-alert'
import { Slider, Typography } from '@mui/material';
import MetaData from '../layout/MetaData';

function Products() {
    const params = useParams();
    const dispatch = useDispatch();
    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ];
    const alert = useAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const [price, setPrice] = useState([0, 25000]);
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);


    const {products, loading, error, productsCount, resultPerPage, filteredProductsCount} = useSelector(state => state.products)
    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(params.keyword, currentPage, price, category, ratings));
    }, [dispatch, params.keyword, currentPage, price, category, ratings, alert, error])

    let count = filteredProductsCount;
    
  return (
      <Fragment>
          {loading ? <Loader /> : (
              <Fragment>
                  <MetaData title="PRODUCTS -- ECOMMERCE" />
                  <h2 className='productsHeading'>Products</h2>
                  <div className='products'>
                    {products &&   
                        products.map(product => 
                            <ProductCard key={product._id} product={product} />
                        )
                    }
                  </div>

                  <div className='filterBox'>
                    <Typography>Price</Typography>
                    <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={25000}
                    />
                    <Typography>Categories</Typography>
                    <ul className='categoryBox'>
                        {categories.map((category) => (
                            <li 
                                className='category-link'
                                key={category}
                                onClick={() => setCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                    <fieldset>
                        <Typography component="legend">Ratings Above</Typography>
                        <Slider
                            value={ratings}
                            onChange={(e, newRating) => {
                                setRatings(newRating);
                            }}
                            aria-labelledby="continuous-slider"
                            min={0}
                            max={5}
                            valueLabelDisplay="auto"
                        />
                    </fieldset>
                  </div>  

                  {resultPerPage < count && (
                    <div className='paginationBox'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass='page-item'
                            linkClass='page-link'
                            activeClass='pageItemActive'
                            activeLinkClass='pageLinkActive'
                        />
                    </div>
                    )
                  }
              </Fragment>
          )}
      </Fragment>
    )
}

export default Products;
