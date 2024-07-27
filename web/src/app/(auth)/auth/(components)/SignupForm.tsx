import { apiHandler } from '@/utils/api';
import { useForm } from '@/utils/hooks/useForm';
import { SignupData } from '@/utils/types';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { toast } from "sonner"
import { LuEye, LuEyeOff } from "react-icons/lu";
import { IoCheckmark } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { buttonClassNames } from '@/utils/constants';

export default function SignupForm({ setLogin }: { setLogin: Dispatch<SetStateAction<boolean>> }) {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [data, handleChange] = useForm<SignupData>({
        email: "",
        password: "",
        cpassword: "",
        username: ""
    })
    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (data.cpassword !== data.password) return toast("Passwords do not match!")
        const res = await apiHandler.signup(data)
        if (!res || !res.token) return toast("Signup failed!")
        toast("Signup successful!")
        console.log(res)
        localStorage.setItem("token", res.token)
        router.replace("/otp")
    }
    return (
        <section className='  bg-gradient-to-r from-[hsl(0,0%,100%,4%)] to-[hsl(0,0%,0%,4%)] rounded-md bg-clip-padding backdrop-filter backdrop-blur-[31px] bg-opacity-10 border border-[#515151] px-6 py-4 w-full'>
            <article className=' flex flex-col gap-1 pb-2'>
                <header className=' text-left font-semibold text-2xl text-white'>Sign up to vPass!</header>
                <p className=' text-xs text-[#6C6C6C]'>Not your basic password manager!</p>
            </article>
            <form onSubmit={handleFormSubmit} className=' flex flex-col gap-4 text-white w-full '>
                <article className=' flex flex-col gap-1 '>
                    <label htmlFor="username">Username </label>
                    <div className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555]  transition-all flex flex-row gap-1 items-center'>
                        <input required minLength={3} pattern="[a-z0-9._]{3,}" name='username' className='!bg-transparent outline-none placeholder:text-[#555555] w-full' type="text" placeholder='joemama' value={data.username} onChange={handleChange} />
                        {data.username.match(/[a-z0-9._]{3,}/) ? <IoCheckmark className=' w-4 h-4' /> : <RxCross1 title='username should at lease be 3 letters, all lowercase' className=' w-4 h-4' />}
                    </div>
                </article>
                <article className=' flex flex-col gap-1 '>
                    <label htmlFor="email">Email </label>
                    <div className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555]  transition-all flex flex-row gap-1 items-center'>
                        <input autoComplete='off' required minLength={2} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" title='enter a valid email' name='email' className='!bg-transparent  outline-none placeholder:text-[#555555] w-full' type="email" placeholder='joemama@alabama.com' value={data.email} onChange={handleChange} />
                        {data.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) ? <IoCheckmark className=' w-4 h-4' /> : <RxCross1 className=' w-4 h-4' />}
                    </div>
                </article>
                <article className=' flex flex-col gap-1 '>
                    <label htmlFor="password">Password</label>
                    <div className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555]  transition-all flex flex-row gap-1 items-center'>
                        <input autoComplete='off' required minLength={8} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$" name='password' className=' bg-transparent outline-none placeholder:text-[#555555] w-full' type={show ? "text" : "password"} placeholder='JoeMama#1276' value={data.password} onChange={handleChange} />
                        <button type='button' onClick={() => { setShow((prev) => !prev) }}>
                            {!show ? <LuEye className=' w-4 h-4' /> : <LuEyeOff className=' w-4 h-4' />}
                        </button>
                    </div>
                </article>
                <article className=' flex flex-col gap-1 '>
                    <label htmlFor="cpassword">Confirm Password </label>
                    <div className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555] transition-all flex flex-row gap-1 items-center'>
                        <input required minLength={8} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$" name='cpassword' className=' bg-transparent outline-none placeholder:text-[#555555] w-full' type={show ? "text" : "password"} placeholder='JoeMama#1276' value={data.cpassword} onChange={handleChange} />
                        <button type='button' onClick={() => { setShow((prev) => !prev) }}>
                            {!show ? <LuEye className=' w-4 h-4' /> : <LuEyeOff className=' w-4 h-4' />}
                        </button>
                    </div>
                </article>
                <button type='submit' className={` ${buttonClassNames} w-full`}>
                    Submit
                </button>
            </form>
            <h4 className='text-[#686868] text-nowrap w-full text-center py-3'>Already have an account?<span><button onClick={() => setLogin(true)} className=' text-[#077CE8] underline decoration-[#077CE8]'>Log in</button></span></h4>
        </section>
    )
}
