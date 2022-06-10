import React from 'react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRoute() {

  const {loading, isAuthenticated} = useSelector(state => state.user);
  
  return (
    <Fragment>
      {loading===false && (
        isAuthenticated===false || isAuthenticated===undefined ? <Navigate to="/login" /> : <Outlet />
      )}
    </Fragment>
  )
}

export default ProtectedRoute