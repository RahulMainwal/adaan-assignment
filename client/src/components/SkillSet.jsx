import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SkillSet({ skills }) {
    const [openModal, setOpenModal] = useState(false);
    const [skill, setSkill] = useState("");
    const [skillsSet, setSkillsSet] = useState(skills);

    const [cookies] = useCookies(['name']);

    const addSkillHandler = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile/skill`,
                {
                    skill
                },
                {
                    headers: {
                        loginToken: cookies.loginToken,
                    }
                }
            )
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
                // console.log(data)
                setSkillsSet(data.data);
                setOpenModal(false);
                setSkill("");
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

    const deleteSkillHandler = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile/skill/${id}`,
                {
                    headers: {
                        loginToken: cookies.loginToken,
                    }
                }
            )
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
                setSkillsSet(data.data);
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


    if (openModal) {
        return (
            <>
                <div style={{ zIndex: 25, position: "fixed", left: 0, top: 0, right: 0, bottom: 0, background: "white", padding: "0 10px", overflow: "auto" }}>
                    <div className="relative top-10 mx-auto p-5 border w-full shadow-lg rounded-md bg-white">
                        <div className="rounded border-grey-500 ">
                            <div className="mx-auto bg-white py-8 mx-5">
                                <div className='flex flex-col items-end w-full'>
                                    <span onClick={() => setOpenModal(false)} className='cursor-pointer'>
                                        <svg viewBox="0 0 64 64" width={25} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" strokeWidth="1.984"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="20" y1="20" x2="44" y2="44"></line><line x1="44" y1="20" x2="20" y2="44"></line><rect x="8" y="8" width="48" height="48"></rect></g></svg>
                                    </span>
                                </div>
                                    <div className='text-center mb-5'>
                                            <b>Add a new skill</b>
                                        </div>
                                <div className="grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                                    <div>
                                        <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-900">Skill</label>
                                        <input value={skill} onChange={(e) => setSkill(e.target.value)} type="text" id="skills" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name of skill" required />
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <button onClick={() => addSkillHandler()} type="button" className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Add Skill</button>
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
            <div className='mt-5 mx-5' style={{ borderRadius: "10px", boxShadow: "1px 2px 2px 1px rgb(229, 229, 223)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b className='px-2 text-gray-500 mt-5'>Skill Set</b>
                    <span onClick={() => setOpenModal(true)}>
                        <svg viewBox="0 0 24 24" width={40} className='mx-5 mt-5 border border-grey-100 px-2 py-2 cursor-pointer rounded hover:border-gray-900' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Add_Row"> <path id="Vector" d="M3 14V15C3 16.1046 3.89543 17 5 17L19 17C20.1046 17 21 16.1046 21 15L21 13C21 11.8954 20.1046 11 19 11H13M10 8H7M7 8H4M7 8V5M7 8V11" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                    </span>
                </div>
                <div className="rounded border-grey-500 ">
                    <div className="flex flex-wrap space-x-4 max-w-3xl mx-auto bg-white px-4 py-8 justify-center">
                        {
                            skillsSet.map((skill) => (
                                <button key={skill._id} style={{ display: "flex", border: "1px solid black", padding: "2px 5px", borderRadius: "50px", margin: "5px" }}>
                                    <b className='ml-2'>{skill.skill}</b>
                                    <span onClick={() => deleteSkillHandler(skill._id)}>
                                        <svg width={25} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clipPath="url(#clip0_429_11083)"> <path d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006" stroke="#292929" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> </g> <defs> <clipPath id="clip0_429_11083"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>
                                    </span>
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default SkillSet;
