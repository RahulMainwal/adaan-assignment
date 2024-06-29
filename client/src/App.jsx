import React from 'react';
import {Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './helper/PrivateRoute';
import AuthPrivateRoutes from './helper/AuthPrivateRoutes';
import Register from './pages/Register';
import Avatar from './pages/Avatar';

function App() {

  return (
    
    <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/avatar" element={<Avatar />} />
          </Route>
          <Route element={<AuthPrivateRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          </Route>
    </Routes>
  )
}

export default App































// import axios from 'axios';
// import React, { useEffect } from 'react';
// import Header from './components/Header';
// import Home from './pages/Home';

// function App() {
  
//   // useEffect(() => {
//   //   (async () => {
//   //     // try {
//   //         axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile`)
//   //         .then((data) => {
//   //           console.log(data.data);  
//   //         })
//   //         .catch((error) => {
//   //           console.log(error?.response?.data?.message, error.response.data.data.isLoggedIn); 
//   //         })
//   //     // } catch (error) {
//   //     //     console.log(error)
//   //     // }
//   // })();
//   // })

//   return (
//     <>
//     <Header />
//     <Home />
//     {/* <div className='text-center'>Hello</div> */}
      
//     </>
//   )
// }

// export default App
