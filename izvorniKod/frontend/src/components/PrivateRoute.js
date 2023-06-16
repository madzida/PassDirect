import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Home from './Home/Home';

const PrivateRoute = (props) => {
    let auth = localStorage.getItem("token");
    return auth !== "" ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute