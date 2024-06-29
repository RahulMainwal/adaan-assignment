import React from 'react'
import { NavLink } from 'react-router-dom'

function Avatar({ photoUrl }) {
    return (
        <div className='mt-5 mx-5' style={{ borderRadius: "10px", boxShadow: "1px 2px 2px 1px rgb(229, 229, 223)" }}>
            <b className='px-2 text-gray-500'>Profile</b>
            <div className="rounded border-grey-500 pb-5">
                <div className="relative flex flex-col items-center gap-4 my-4">
                    <img src={photoUrl?photoUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdHD-KQQkMQdJcXTSALcRVFp7chjRbA0e-w&s"}
                        className="relative object-cover shrink-0 h-28 w-28 z-10 rounded-xl" />
                        <p>{!photoUrl && "No avatar is uploaded yet!"}</p>
                </div>
                <div className='flex flex-col items-center'>
                    <NavLink to='/avatar' state={{photoUrl}} className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
                        Change Avatar
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Avatar
