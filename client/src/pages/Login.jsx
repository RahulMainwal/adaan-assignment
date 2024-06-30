import axios from 'axios';
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from 'react-cookie';

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPasword] = useState("");
    const [loading, setLoading] = useState(false);

    // For cookie function
    const [cookies, setCookie] = useCookies(['name']);

    const navigate = useNavigate();

    const loginHandler = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/login`, {
                phone,
                password,
            });
            // console.log(data);
            if (data.success) {
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                // console.log(data?.data?.loginToken)
                setCookie('loginToken', data?.data?.loginToken, { path: '/', maxAge: 2592000 });
                navigate("/");
            } else {
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            // console.log(error.response);
            if (!error?.response?.data?.success) {
                toast.error(error?.response?.data?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="flex items-center min-h-screen bg-white">
                <div className="container mx-auto">
                    <div className="max-w-md mx-auto my-10">
                        <div className="text-center">
                            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Sign in</h1>
                            <p className="text-gray-500 dark:text-gray-400">Sign in to access your account</p>
                        </div>
                        <div className="m-7">
                            <form action="">
                                <div className="mb-6">
                                    <label htmlFor="phone" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Phone Number</label>
                                    <input type="tel" pattern="[0-9]{5}" value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" id="phone" placeholder="Registered phone number" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                                </div>
                                <div className="mb-6">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Password</label>
                                        <span onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300 cursor-pointer">{showPassword ? "Hide" : "Show"}</span>
                                    </div>
                                    <input value={password} onChange={(e) => setPasword(e.target.value)} type={showPassword ? "text" : "password"} name="password" id="password" placeholder="Your Password" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                                </div>
                                <div className="mb-6">
                                    <button onClick={() => loginHandler()} type="button" disabled={loading} className="w-full px-3 py-4 text-white bg-gray-700 rounded-md hover:bg-gray-900 focus:outline-none">{loading ? "Loading..." : "Sign in"}</button>
                                </div>
                                <p className="text-sm text-center text-gray-400">Don&#x27;t have an account yet? <NavLink to="/register" className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">Sign up</NavLink>.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login;
