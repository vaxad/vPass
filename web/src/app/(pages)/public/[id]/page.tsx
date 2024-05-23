"use client"
import Header from '@/components/Header'
import LoadingScreen from '@/components/LoadingScreen';
import { decrypt } from '@/lib/cipher.utils';
import { apiHandler } from '@/utils/api';
import { buttonClassNames, buttonDarkClassNames } from '@/utils/constants';
import { useForm } from '@/utils/hooks/useForm';
import { CreatePasswordData, Group, Password, Team } from '@/utils/types';
import { CopyIcon, MagicWandIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function Page({params}:{params:{id:string}}) {

    const [show, setShow] = useState(false)
    const [data, handleChange, changeValue] = useForm<CreatePasswordData>({name:"", password:"", groupId:"", teamId:"", public:"false", views:0}) 
    const [loading, setLoading] = useState<boolean>(true)

    async function getInitialData(){
        const passData : {success: boolean, password: Password} = await apiHandler.getPublicPasswordById({passId:params.id})
        if(!passData||!passData.success)return
        changeValue({name:"name", value: passData.password.name})
        setLoading(false)
        const decrypted = decrypt(passData.password.encrypted, passData.password.iv)
        if(!decrypted)return toast("Password could not be decrypted!")
        changeValue({name:"password", value: decrypted})
    }

    useEffect(() => {
      getInitialData()
    }, [])
    
    function handleCopy(){
        navigator.clipboard.writeText(data.password)
        toast("Password copied to clipboard!")
    }
  return loading?(
    <LoadingScreen/>
  ):(
    <div className=' flex flex-col gap-6 px-6 md:px-12 lg:px-24 py-12 bg-zinc-950 text-slate-50'>
        <section className=' flex flex-row w-full justify-between'>
        <Header text={`View a password`}/>
        </section>
        <div className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-6 rounded-md border border-slate-600 '>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="name">Name</label>
                <input disabled required minLength={3} name='name' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='ATM PIN' value={data.name} onChange={handleChange} />
            </article>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="password">Password</label>
                <section className=' flex flex-row gap-1 w-full'>
                    <input disabled required minLength={1} name='password'  className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type={show?"text":"password"} placeholder='49620' value={data.password} onChange={handleChange} />
                    <button onClick={handleCopy} title='Copy this password' className={`${buttonClassNames} !p-2`}>
                        <CopyIcon className='w-6 h-6'/>
                    </button>
                </section>
                <div className=' flex flex-row gap-1  py-1 justify-start items-center'>
                    <input type="checkbox" className=' accent-black h-4 w-4' value={show?"checked":"unchecked"} onChange={(e)=>{setShow((prev)=>!prev)}} />
                    <h3 className=' text-xs'>Show password</h3>
                </div>
            </article>
        </div>
    </div>
  )
}
