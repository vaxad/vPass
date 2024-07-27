"use client"
import LoadingScreen from '@/components/LoadingScreen';
import { decrypt } from '@/lib/cipher.utils';
import { apiHandler } from '@/utils/api';
import { buttonClassNames } from '@/utils/constants';
import { useForm } from '@/utils/hooks/useForm';
import { CreatePasswordData, Password } from '@/utils/types';
import { CopyIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react'
import { BsCursorFill } from 'react-icons/bs';
import { toast } from 'sonner';

export default function Page({ params }: { params: { id: string } }) {

    const [show, setShow] = useState(false)
    const [data, , changeValue] = useForm<CreatePasswordData>({ name: "", password: "", groupId: "", teamId: "", public: "false", views: "0" })
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        async function getInitialData() {
            const passData: { success: boolean, password: Password } = await apiHandler.getPublicPasswordById({ passId: params.id })
            if (!passData || !passData.success) return
            changeValue({ name: "name", value: passData.password.name })
            setLoading(false)
            const decrypted = decrypt(passData.password.encrypted, passData.password.iv)
            if (!decrypted) return toast("Password could not be decrypted!")
            changeValue({ name: "password", value: decrypted })
        }

        getInitialData()
    }, [changeValue, setLoading, params.id])

    function handleCopy() {
        navigator.clipboard.writeText(data.password)
        toast("Password copied to clipboard!")
    }
    return loading ? (
        <LoadingScreen />
    ) : (
        <div className=' flex h-full flex-grow flex-col justify-center items-center gap-6 px-3 md:px-12 lg:px-24 py-8 md:py-12  text-slate-50'>
            <section className='w-full md:w-[65vw] lg:w-[50vw] flex  flex-col'>
                <section className=' flex flex-col gap-2 md:flex-row justify-between pb-6'>
                    {/* <Header text={`${editMode?"Edit":"View"} a password`}/> */}
                    <section className=' flex flex-col gap-2'>
                        <section className=' flex flex-row w-full gap-2'>
                            <div className=" max-w-1 min-w-1 rounded-full flex flex-grow bg-[#00A3FF]"></div>
                            <header className=" text-2xl md:text-4xl font-bold transition-all">{data.name}</header>
                        </section>
                    </section>
                </section>
                <div className=' flex flex-col md:flex-row gap-5  p-3 md:p-6 rounded-md  w-full'>
                    <section className=' w-full  flex flex-col'>
                        <article className=' flex flex-col gap-1 w-full pb-5'>
                            <section className=' flex flex-row gap-1 w-full'>
                                <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={handleCopy} className=' shadow-[0_0px_40px_10px_hsl(0,0%,0%,62%)_inset,_0_7px_12px_black] cursor-pointer w-full rounded-sm border border-[#999999] bg-gradient-to-br from-[#101010] via-[#242142] to-[#101010] text-sm md:text-lg text-nowrap py-1 px-4 text-[#999999] hover:text-white flex flex-row justify-center items-center gap-1'>
                                    {!show ? <>
                                        <BsCursorFill className=' w-3 h-3 -scale-x-100 ' />
                                        <h2 className=' hidden md:flex'>Hover to Reveal Password</h2>
                                        <h2 className=' md:hidden flex'>Tap to Reveal Password</h2>
                                    </>
                                        :
                                        <h2>{data.password}</h2>}
                                </div>
                                <button onClick={handleCopy} title='Copy this password' className={`${buttonClassNames} !p-2`}>
                                    <CopyIcon className='w-6 h-6' />
                                </button>
                            </section>
                        </article>
                    </section>
                </div>
            </section>
        </div>
    )
}



{/*<div className=' flex flex-col gap-6 px-6 md:px-12 lg:px-24 py-12 bg-zinc-950 text-slate-50'>
        <section className=' flex flex-row w-full justify-between'>
            <Header text={`View a password`} />
        </section>
        <div className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-6 rounded-md border border-slate-600 '>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="name">Name</label>
                <input disabled required minLength={3} name='name' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='ATM PIN' value={data.name} onChange={handleChange} />
            </article>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="password">Password</label>
                <section className=' flex flex-row gap-1 w-full'>
                    <input disabled required minLength={1} name='password' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type={show ? "text" : "password"} placeholder='49620' value={data.password} onChange={handleChange} />
                    <button onClick={handleCopy} title='Copy this password' className={`${buttonClassNames} !p-2`}>
                        <CopyIcon className='w-6 h-6' />
                    </button>
                </section>
                <div className=' flex flex-row gap-1  py-1 justify-start items-center'>
                    <input type="checkbox" className=' accent-black h-4 w-4' value={show ? "checked" : "unchecked"} onChange={(e) => { setShow((prev) => !prev) }} />
                    <h3 className=' text-xs'>Show password</h3>
                </div>
            </article>
        </div>
    </div>
    */}