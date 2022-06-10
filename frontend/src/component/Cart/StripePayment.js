import React from 'react'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from './Payment';
import { Fragment } from 'react';

function StripePayment({ apiKey }) {
  return (
    <Fragment>
        { apiKey && (
            <Elements stripe={loadStripe(apiKey)}>
                <Payment />
            </Elements>
        )}
    </Fragment>
  )
}

export default StripePayment