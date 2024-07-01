import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {

  const [name, setName] = useState("");
  const [email, setEmal] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [reTypedPassword, setReTypedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReTypedPassword, setShowReTypedPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [passError, setPassError] = useState([]);

  const nagigate = useNavigate();


  const signUpHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/register`,
        {
          name,
          email,
          phone,
          password,
          reTypedPassword,
        }
      );
      console.log(data.data)
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
        setIsOtpSent(true);
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
      console.log(error);
      setPassError(!error?.response?.data?.data?.contains?[]:error?.response?.data?.data?.contains);
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
    setLoading(false);
  }

  const signUpVerificationHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/regisration/verification`,
        {
          phone,
          otp
        }
      );
      console.log(data.data)
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
        setTimeout(() => {
          nagigate("/login")
        }, 5000)
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
      console.log(error)
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
    setLoading(false);
  }

  return (
    isOtpSent
      ?
      <div>
        <div>
          <div className="flex items-center min-h-screen bg-white">
            <div className="container mx-auto">
              <div className="max-w-md mx-auto my-10">
                <div className="text-center">
                  <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">OTP Authentication for Registering new Account</h1>
                  <p className="text-gray-500 dark:text-gray-400">Enter otp here to access your account</p>
                </div>
                <div className="m-7">
                  <div className="mb-6">
                    <label htmlFor="phone" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Phone Number</label>
                    <input type="number" disabled readOnly value={phone} onChange={(e) => setPhone(e.target.value)} pattern="[0-9]{5}" name="phone" id="phone" placeholder="Phone number" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="otp" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Your OTP (One Time Password)</label>
                    <input type="number" value={otp} onChange={(e) => setOtp(e.target.value)} pattern="[0-9]{5}" name="otp" id="otp" placeholder="Enter 6 digit OTP" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                  </div>
                  <div className="mb-6">
                    <button disabled={loading ? true : false} onClick={() => signUpVerificationHandler()} type="button" className="w-full px-3 py-4 text-white bg-gray-700 rounded-md hover:bg-gray-900 focus:outline-none">{loading ? "Loading..." : "Verify OTP"}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      :
      <div>
        <div>
          <div className="flex items-center min-h-screen bg-white">
            <div className="container mx-auto">
              <div className="max-w-md mx-auto my-10">
                <div className="text-center">
                  <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Register</h1>
                  <p className="text-gray-500 dark:text-gray-400">Sign up to access your account</p>
                </div>
                <div className="m-7">
                  <div className="mb-6">
                    <label htmlFor="name" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="name" id="name" placeholder="Your full Name" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email ID</label>
                    <input type="email" value={email} onChange={(e) => setEmal(e.target.value)} name="email" id="email" placeholder="Correct Email Address" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="phone" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Phone Number</label>
                    <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} pattern="[0-9]{5}" name="phone" id="phone" placeholder="Phone number" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Password</label>
                      <span onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300 cursor-pointer">{password && (showPassword ? "Hide" : "Show")}</span>
                    </div>
                    <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Your Password" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Re-Type Password</label>
                      <span onClick={() => showReTypedPassword ? setShowReTypedPassword(false) : setShowReTypedPassword(true)} className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300 cursor-pointer">{reTypedPassword && (showReTypedPassword ? "Hide" : "Show")}</span>
                    </div>
                    <input type={showReTypedPassword ? "text" : "password"} name="password" value={reTypedPassword} onChange={(e) => setReTypedPassword(e.target.value)} id="password" placeholder="Your Password" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md" />
                  </div>
                   <div className='mb-6'>
                    {
                      passError.map((x) => (
                        <div className='text-red-400'>▪ {x}</div>
                      ))
                    }
                  </div>
                  <div className="mb-6">
                    <button onClick={() => signUpHandler()} disabled={loading ? true : false} type="button" className="w-full px-3 py-4 text-white bg-gray-700 rounded-md hover:bg-gray-900 focus:outline-none">{loading ? "Loading..." : "Sign Up"}</button>
                  </div>
                  <p className="text-sm text-center text-gray-400">Have an account? <NavLink to="/login" className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">Login</NavLink>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
  )
}

export default Register
