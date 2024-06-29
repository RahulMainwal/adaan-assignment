import React from 'react'

function Password() {
  return (
    <div>
      <section className="grid h-screen place-content-center bg-gray-100 text-slate-300">
  <div className="mb-10 text-center text-indigo-400">
    <h1 className="text-3xl font-bold tracking-widest">PASSWORD</h1>
    <p>Create a new strong password</p>
  </div>
  <div className="flex flex-col items-center justify-center space-y-6">
    <input type="password" id="password" name="password" placeholder="Password" className="w-80 rounded-full border border-gray-800 bg-gray-100 p-2 px-4" />
    <div>
      <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm Password" className="w-80 appearance-none rounded-full border-0 bg-slate-800/50 p-2 px-4 focus:bg-slate-800 focus:ring-2 focus:ring-orange-500" />
      <p id="validation" className="text-center text-orange-500 italic text-sm"></p>
    </div>
    <button id="showPw" className="rounded-full bg-indigo-500 p-2 px-4 text-white hover:bg-orange-500"><span id="showHide">Show</span> Password</button>
  </div>
</section>
    </div>
  )
}

export default Password
