import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import "./orderSuccess.css";

function OrderSuccess() {
  return (
    <div className='orderSuccess'>
      <CheckCircleIcon />
      <Typography>Your Order has been Placed successfully</Typography>
      <Link to="/orders">View Orders</Link>
    </div>
  )
}

export default OrderSuccess