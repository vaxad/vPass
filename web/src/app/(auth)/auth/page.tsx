"use client"

import { useState } from "react"
import SignupForm from "./(components)/SignupForm"
import LoginForm from "./(components)/LoginForm"

export default function Page() {
    const [login, setLogin] = useState(true)
    return (
        <div className=' flex w-full flex-grow flex-col px-6 md:px-12 py-12 justify-start items-center'>
            <div className=' relative flex flex-col gap-2 w-full md:w-[35vw]'>
                <section className=' flex flex-row gap-2'>
                    <button onClick={() => setLogin(true)} className=' px-4 md:px-5 py-2 w-[10ch] rounded-lg text-nowrap border border-[#787878] text-white' style={{ opacity: login ? 1 : 0.3 }}>
                        Log in
                    </button>
                    <button onClick={() => setLogin(false)} className=' px-4 md:px-5 py-2 w-[10ch] rounded-lg text-nowrap border border-[#787878] text-white' style={{ opacity: !login ? 1 : 0.3 }}>
                        Sign up
                    </button>
                </section>
                {login ?
                    <LoginForm setLogin={setLogin} /> : <SignupForm setLogin={setLogin} />}
                <div style={{ backgroundImage: "linear-gradient(180deg, transparent, #010205 96%),url(/images/lock.png)" }} className="w-[450px] h-[450px] bg-no-repeat opacity-20 scale-125 -z-20 absolute right-0 top-0 translate-x-[60%] -rotate-[20deg]" />
            </div>
        </div>

    )
}
