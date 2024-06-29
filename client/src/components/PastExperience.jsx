import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PastExperience({ pastExperience }) {
    const [experienceData, setExperienceData] = useState(pastExperience);
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [company, setCompany] = useState("");
    const [post, setPost] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [exitDate, setExitDate] = useState("");
    const [id, setId] = useState("");

    const [cookies] = useCookies(['name']);

    const addNewExperience = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile/experience`,
                {
                    company,
                    post,
                    joiningDate,
                    exitDate,
                },
                {
                    headers: {
                        loginToken: cookies.loginToken,
                    }
                }
            )
            setExperienceData(data.data);
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
                setExperienceData(data.data);
                setPost("");
                setCompany("");
                setJoiningDate("");
                setExitDate("");
                setOpenModal(false);
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
            // console.log(error);
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

    const editExperience = async (id, expPost, expCompany, expJoiningDate, expExitDate) => {
        setIsEdit(true);
        setPost(expPost);
        setCompany(expCompany);
        setJoiningDate(expJoiningDate);
        setExitDate(expExitDate);
        setId(id);
    }

    const editExperienceHandler = async () => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile/experience`,
                {
                    id,
                    company,
                    post,
                    joiningDate,
                    exitDate,
                },
                {
                    headers: {
                        loginToken: cookies.loginToken,
                    }
                }
            )
            // setExperienceData(data.data);
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
                setExperienceData(data.data);
                setOpenModal(false);
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
            // console.log(error);
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
        setIsEdit(false);
    }

    const deleteExperienceHandler = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile/experience/${id}`,
                {
                    headers: {
                        loginToken: cookies.loginToken,
                    }
                }
            )
            // console.log(data)
            // setExperienceData(data.data);
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
                setExperienceData(data.data);
                setOpenModal(false);
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
            // console.log(error);
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

    useEffect(() => {
        if (openModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'scroll';
        }
    }, [openModal])

    useEffect(() => {
        if (isEdit) {
            setOpenModal(true);
        } else {
            setOpenModal(false);
            setPost("");
            setCompany("");
            setJoiningDate("");
            setExitDate("");
        }
    }, [isEdit])


    if (openModal) {
        return (
            <>
                <div style={{ zIndex: 25, position: "fixed", left: 0, top: 0, right: 0, bottom: 0, background: "white", padding: "0 10px", overflow: "auto" }}>
                    <div className="relative top-10 mx-auto p-5 border w-full shadow-lg rounded-md bg-white">
                        <div className="rounded border-grey-500 ">
                            <div className="mx-auto bg-white py-8 mx-5">
                                <div className='flex flex-col items-end w-full'>
                                    <span onClick={() => { setOpenModal(false); setIsEdit(false) }} className='cursor-pointer'>
                                        <svg viewBox="0 0 64 64" width={25} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" strokeWidth="1.984"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="20" y1="20" x2="44" y2="44"></line><line x1="44" y1="20" x2="20" y2="44"></line><rect x="8" y="8" width="48" height="48"></rect></g></svg>
                                    </span>
                                </div>
                                <div className='text-center mb-5'>
                                    <b>{isEdit ? "Edit current experience" : "Add a new experience"}</b>
                                </div>
                                <div className="grid gap-6 mb-6 lg:grid-cols-2">
                                    <div>
                                        <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900">Company/Organization</label>
                                        <input value={company} onChange={(e) => setCompany(e.target.value)} type="text" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name of ogranization" required />
                                    </div>
                                    <div>
                                        <label htmlFor="post" className="block mb-2 text-sm font-medium text-gray-900">Post/Role</label>
                                        <input value={post} onChange={(e) => setPost(e.target.value)} type="text" id="post" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your role" required />
                                    </div>
                                    <div>
                                        <label htmlFor="joining-date" className="block mb-2 text-sm font-medium text-gray-900">Starting From</label>
                                        <input value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} type="date" id="joining-date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={new Date().getFullYear() - 1} required />
                                    </div>
                                    <div>
                                        <label htmlFor="exit-date" className="block mb-2 text-sm font-medium text-gray-900 ">Ending Till</label>
                                        <input value={exitDate} onChange={(e) => setExitDate(e.target.value)} type="date" id="exit-date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={new Date().getFullYear()} required />
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <button onClick={() => isEdit ? editExperienceHandler() : addNewExperience()} type="button" className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">{isEdit ? "Update Experience" : "Add Experience"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </>
        )
    }

    return (
        <div>
            <div className='mt-5 mx-5 pb-5' style={{ borderRadius: "10px", boxShadow: "1px 2px 2px 1px rgb(229, 229, 223)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b className='px-2 text-gray-500 mt-5'>Past Experience</b>
                    <span onClick={() => setOpenModal(true)}>
                        <svg viewBox="0 0 24 24" width={40} className='mx-5 mt-5 border border-grey-100 px-2 py-2 cursor-pointer rounded hover:border-gray-900' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Add_Row"> <path id="Vector" d="M3 14V15C3 16.1046 3.89543 17 5 17L19 17C20.1046 17 21 16.1046 21 15L21 13C21 11.8954 20.1046 11 19 11H13M10 8H7M7 8H4M7 8V5M7 8V11" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                        {/* <svg fill="#000000" width={40} className='mx-5 mt-5 border border-grey-100 px-2 py-2 cursor-pointer rounded hover:border-gray-900' version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 72" enable-background="new 0 0 72 72" xml:space="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M67.982,14.221c-0.148-2.527-1.26-5.003-3.049-6.792l-0.436-0.435c-1.881-1.882-4.354-2.918-6.961-2.918 c-2.465,0-4.764,0.941-6.475,2.652L10.94,46.85c-3.097,3.096-6.277,15.676-6.883,18.166c-0.165,0.68,0.035,1.395,0.529,1.889 l0.435,0.434c0.379,0.381,0.89,0.586,1.414,0.586c0.143,0,0.287-0.014,0.43-0.047c2.541-0.559,15.373-3.506,18.484-6.617 l40.125-40.121C67.25,19.364,68.141,16.907,67.982,14.221z M49.908,18.983c0.195,0.195,0.451,0.293,0.707,0.293 s0.512-0.098,0.707-0.293l3.016-3.016l1.896,1.895L21.247,52.849l-1.895-1.895l29.076-29.075c0.391-0.391,0.391-1.023,0-1.414 s-1.023-0.391-1.414,0L17.938,49.54l-2.016-2.017l34.986-34.985l2.016,2.015l-3.016,3.016C49.518,17.96,49.518,18.592,49.908,18.983 z M24.675,56.277l-2.015-2.015l34.987-34.986l2.016,2.015L24.675,56.277z M10.28,57.71l4.087,4.088 c-1.894,0.567-3.892,1.106-5.755,1.565C9.105,61.533,9.68,59.57,10.28,57.71z M16.52,61.123l-5.529-5.53 c0.991-2.821,1.994-5.133,2.777-5.915l0.74-0.74l2.722,2.722c0,0.001,0,0.001,0.001,0.002s0.001,0.001,0.002,0.001l6.028,6.029 l-0.74,0.74C21.742,59.211,19.393,60.18,16.52,61.123z M62.645,18.31l-1.568,1.568l-6.03-6.03c0,0-0.001-0.001-0.001-0.001 s-0.001,0-0.002-0.001l-2.721-2.721l1.568-1.568c0.955-0.955,2.25-1.48,3.646-1.48c1.539,0,3.007,0.62,4.133,1.746l0.435,0.435 c1.107,1.105,1.793,2.636,1.885,4.199C64.079,15.984,63.602,17.353,62.645,18.31z"></path> </g></svg> */}
                    </span>
                </div>
                <div className="rounded border-grey-500">
                    {
                        experienceData.map((experience) => (
                            <div key={experience._id} className="max-w-3xl mx-auto bg-white px-4 py-8" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #E6E6E1", paddingBottom: "8px" }}>
                                <div>
                                    <div><b>Role:</b> {experience.post}</div>
                                    <div><b>Company:</b> {experience.company}</div>
                                    <div><b>Starting From:</b> {experience.joiningDate}</div>
                                    <div><b>Ending Till:</b> {experience.exitDate}</div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <span onClick={() => { editExperience(experience._id, experience.post, experience.company, experience.joiningDate, experience.exitDate) }} className='mr-3'>
                                        <svg viewBox="0 0 24 24" className='py-2' style={{ marginTop: "2px" }} width={20} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#0F0F0F"></path> </g></svg>
                                    </span>
                                    <span onClick={() => deleteExperienceHandler(experience._id)}>
                                        <svg viewBox="0 0 24 24" className='py-2' width={25} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default PastExperience;
