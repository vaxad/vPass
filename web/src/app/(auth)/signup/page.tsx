"use client"
import { apiHandler } from '@/utils/api';
import { buttonClassNames } from '@/utils/constants';
import { useForm } from '@/utils/hooks/useForm';
import { SignupData } from '@/utils/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from "sonner"

export default function Page() {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [data, handleChange] = useForm<SignupData>({
        email: "",
        password: "",
        cpassword:"",
        username: ""
    })
    async function handleFormSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(data.cpassword !== data.password)return toast("Passwords do not match!")
        const res = await apiHandler.signup(data)
        if(!res||!res.token) return toast("Signup failed!")
        toast("Signup successful!")
        console.log(res)
        localStorage.setItem("token",res.token)
        router.replace("/otp")
    }

  return (
    <div className=' flex w-full h-full flex-col px-6 md:px-12 py-8'>
        <header className=' text-center font-bold text-4xl text-slate-50 py-4'>Sign up to vPass!</header>
        <form onSubmit={handleFormSubmit} className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-6 rounded-md border border-slate-600 '>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="username">Username <sub>{"(only lowercase letters, digits, _ and . allowed with minimum 3 characters)"}</sub></label>
                <input required minLength={3} pattern="[a-z0-9._]{3,}" name='username' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='joemama' value={data.username} onChange={handleChange} />
            </article>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="email">Email <sub>{"(only valid emails)"}</sub></label>
                <input required minLength={2} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" name='email' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="email" placeholder='joemama@alabama.com' value={data.email} onChange={handleChange} />
            </article>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="password">Password <sub>{"(minimum 8 characters, with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character [!@#$%^&*()])"}</sub></label>
                <input required minLength={8} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$" name='password'  className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type={show?"text":"password"} placeholder='JoeMama#1276' value={data.password} onChange={handleChange} />   
            </article>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="cpassword">Confirm Password <sub>{"(minimum 8 characters, with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character [!@#$%^&*()])"}</sub></label>
                <input required minLength={8} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$" name='cpassword'  className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type={show?"text":"password"} placeholder='JoeMama#1276' value={data.cpassword} onChange={handleChange} />
                <div className=' flex flex-row gap-1  py-1 justify-start items-center'>
                    <input type="checkbox" className=' accent-black h-4 w-4' value={show?"checked":"unchecked"} onChange={(e)=>{setShow((prev)=>!prev)}} />
                    <h3 className=' text-xs'>Show passwords</h3>
                </div>
            </article>
            <button type='submit' className={` ${buttonClassNames} w-full font-semibold text-xl`}>
                Submit
            </button>
            <Link href={'/login'} className=' w-full text-center py-3 underline active:scale-95 hover:scale-105 transition-all '>Already have an account?</Link>
        </form>
    </div>
  )
}
