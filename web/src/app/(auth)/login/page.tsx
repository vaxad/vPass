"use client"
import { apiHandler } from '@/utils/api';
import { buttonClassNames } from '@/utils/constants';
import { useForm } from '@/utils/hooks/useForm';
import { LoginData, SignupData } from '@/utils/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from "sonner"

export default function Page() {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [data, handleChange] = useForm<LoginData>({
        email: "",
        password: ""
    })
    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await apiHandler.login(data)
        if (!res || !res.token) return toast("Login failed!")
        toast("Login successful!")
        console.log(res)
        localStorage.setItem("token", res.token)
        router.replace("/")
    }
    return (
        <div className=' flex w-full h-full bg-zinc-950 flex-col px-6 md:px-12 py-8'>
            <header className=' text-center font-bold text-4xl text-slate-50 py-4'>Login to vPass!</header>
            <form onSubmit={handleFormSubmit} className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-6 rounded-md border border-slate-600 '>
                <article className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="email">Email <sub>{"(only valid emails)"}</sub></label>
                    <input required minLength={2} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" name='email' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="email" placeholder='joemama@alabama.com' value={data.email} onChange={handleChange} />
                </article>
                <article className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="password">Password <sub>{"(minimum 8 characters, with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character [!@#$%^&*()])"}</sub></label>
                    <input required minLength={8} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$" name='password' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type={show ? "text" : "password"} placeholder='JoeMama#1276' value={data.password} onChange={handleChange} />
                    <div className=' flex flex-row gap-1  py-1 justify-start items-center'>
                        <input type="checkbox" className=' accent-black h-4 w-4' value={show ? "checked" : "unchecked"} onChange={(e) => { setShow((prev) => !prev) }} />
                        <h3 className=' text-xs'>Show password</h3>
                    </div>
                </article>
                <button type='submit' className={` ${buttonClassNames} w-full font-semibold text-xl`}>
                    Submit
                </button>
                <Link href={'/signup'} className=' w-full text-center py-3 underline active:scale-95 hover:scale-105 transition-all '>Don&apos;t have an account?</Link>
            </form>
        </div>
    )
}
