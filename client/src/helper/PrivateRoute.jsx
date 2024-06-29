import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const PrivateRoute = () => {
    // For cookies
    const [cookies] = useCookies(['name']);

    return (
        cookies.loginToken ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoute;