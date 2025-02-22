"use client"
import { apiHandler } from '@/utils/api';
import { buttonClassNames, otpLength } from '@/utils/constants';
import context from '@/utils/context/context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

export default function Page() {
    const router = useRouter()
    const submitRef = useRef<HTMLButtonElement>(null)
    const initialOtp = []
    const u1 = useRef<HTMLInputElement>(null)
    const u2 = useRef<HTMLInputElement>(null)
    const u3 = useRef<HTMLInputElement>(null)
    const u4 = useRef<HTMLInputElement>(null)
    const u5 = useRef<HTMLInputElement>(null)
    const u6 = useRef<HTMLInputElement>(null)
    const useRefs: React.RefObject<HTMLInputElement>[] = [u1, u2, u3, u4, u5, u6]
    for (let i = 0; i < otpLength; i++) {
        initialOtp.push("")
    }
    const [otp, setOtp] = useState<string[]>(initialOtp)
    const { user } = useContext(context)

    useEffect(() => {
        if (user && user.verified) {
            toast("User already verified ")
            router.replace("/")
        }
    }, [user, router])


    async function handleResend() {
        console.log("resending")
        const res = await apiHandler.resendOTP()
        console.log(res)
        if (!res || !res.success) return
        toast("OTP sent successfully!")
    }

    function handleChange(text: string, ind: number) {
        console.log(text)
        if (!text.match(/^\d$/)) {
            if (useRefs[ind].current) {
                const field = useRefs[ind].current
                field ? field.value = "" : ""
            }
            return
        }
        const temp = otp;
        temp[ind] = text;
        setOtp(temp);
        console.log(otp);
        if (ind < otpLength - 1 && text.length === 1) {
            useRefs.length > 0 ? useRefs[ind + 1].current?.focus() : "";
        } else if (text.length === 1) {
            if (submitRef.current)
                submitRef.current.focus()
        }
    }

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const otpStr = otp.join("");
        console.log({ otpStr })
        if (otpStr.length !== otpLength) return toast("Invalid OTP!")
        const res = await apiHandler.verifyOTP({ otp: otpStr })
        if (!res || !res.success) return toast("Verification failed!")
        toast("Verification successful!")
        console.log(res)
        router.replace("/")
    }
    return (
        <div className=' flex w-full flex-grow bg-transparent justify-center items-center flex-col px-6 md:px-12 py-8'>
            <section className=' relative'>
                <section className=' relative bg-gradient-to-r from-[hsl(0,0%,100%,4%)] to-[hsl(0,0%,0%,4%)] rounded-md bg-clip-padding backdrop-filter backdrop-blur-[31px] bg-opacity-10 border border-[#515151] px-8 py-2 w-full md:[45vw] lg:w-[35vw] flex flex-col'>
                    {/* shadow-[0_0_21px_2px_hsl(227,100%,29%,10%)] */}
                    <header className=' text-left font-semibold text-2xl text-slate-50 pt-4'>Verify your Email with OTP!</header>
                    <h4 className=' pb-4 text-sm font-medium text-[#6C6C6C] text-left '>{`An OTP has been sent to your registered email${user ? ` (${user?.email})` : ""}`}</h4>
                    <form onSubmit={handleFormSubmit} className=' flex flex-col gap-2 text-white p-6 w-fit '>
                        <section className=' grid grid-cols-6 gap-2'>
                            {[...Array(otpLength)].map((item, idx) => {
                                return (
                                    <input ref={useRefs[idx]} key={`otp-${idx}`} className=' flex justify-center items-center text-center font-semibold w-full px-2 py-4 rounded-lg text-2xl md:text-3xl   outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 transition-all border border-[#3A3A3A]' value={item} onChange={(e) => { handleChange(e.target.value, idx) }} type="numeric" name="" id="" />
                                )
                            })}
                        </section>
                        <button ref={submitRef} type='submit' className={` ${buttonClassNames} w-full`}>
                            Submit
                        </button>
                        <button type='button' onClick={handleResend} className=' w-full text-center py-3 underline active:scale-95 text-[#077CE8] decoration-[#077CE8] transition-all '>Resend OTP?</button>
                    </form>
                </section>
                <div style={{ backgroundImage: "linear-gradient(180deg, transparent, #010205 96%),url(/images/check.png)" }} className="w-[350px] h-[350px] bg-no-repeat opacity-20 scale-125 -z-20 absolute left-0 top-0 -translate-x-[20%] -translate-y-[60%] md:-translate-x-[70%] md:-translate-y-[20%] -rotate-[20deg]" />
            </section>
        </div>
    )
}
