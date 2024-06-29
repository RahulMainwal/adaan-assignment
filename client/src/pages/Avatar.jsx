import React, { useState } from 'react'
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Avatar() {
    const location = useLocation();
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['name']);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        const formData = new FormData()
        formData.append('photo', image.data)
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile/photo`,
                formData,
                {
                    headers: {
                        loginToken: cookies.loginToken,
                    }
                }
            )
            if (data.success) {
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
        <>
            <Header />
            <div>
                <div className="flex items-center justify-center h-[89vh] bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="bg-white font-semibold text-center rounded-3xl border shadow-lg p-10 max-w-xs">
                        <img className="mb-3 w-32 h-32 rounded-full shadow-lg mx-auto" src={image?.preview ? image?.preview : location.state.photoUrl} alt="Avatar" />
                        <div className='overflow-hidden'><input type='file' onChange={(e) => handleFileChange(e)} /></div>
                        <button disabled={loading} onClick={(e) => handleSubmit(e)} className="bg-gray-900 px-8 py-2 mt-8 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide">{loading? "Please wait uploading...":"Upload Image"}</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Avatar
