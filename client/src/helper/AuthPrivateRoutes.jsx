import { useState, useEffect } from 'react';
import axios from "axios";
import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthPrivateRoutes = () => {
    // For cookies
    const [cookies] = useCookies(['name']);


    return (
        !cookies.loginToken ? <Outlet /> : <Navigate to='/'/>
    )
}

export default AuthPrivateRoutes;
