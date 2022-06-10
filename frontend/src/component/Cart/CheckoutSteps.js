import { StepLabel } from '@mui/material';
import { Step } from '@mui/material';
import { Typography } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import React from 'react'
import { Fragment } from 'react';
import { Stepper } from '@mui/material';
import './CheckoutSteps.css'

function CheckoutSteps({ activeStep }) {
    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <LocalShippingIcon />,
        },
        {
            label: <Typography>Confirm Orders</Typography>,
            icon: <LibraryAddCheckIcon />,
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <AccountBalanceIcon />,
        },
    ]

    const stepStyles = {
        boxSizing: "border-box",
    };

  return (
    <Fragment>
        <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
            {steps.map((item, index) => (
                <Step key={index} active={activeStep===index ? true : false} completed={activeStep>=index ? true : false}>
                    <StepLabel icon={item.icon} style={{color: activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)"}}>
                        {item.label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    </Fragment>
  )
}

export default CheckoutSteps