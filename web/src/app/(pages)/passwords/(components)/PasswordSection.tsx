"use client"

import { apiHandler } from "@/utils/api"
import { buttonClassNames, buttonDarkClassNames } from "@/utils/constants"
import { Password } from "@/utils/types"
import { ArrowTopRightIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"

const PasswordCard = ({item}:{item:Password}) => {
    const [hover, setHover] = useState(false);
    return (
        <article onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)} className={` flex flex-row w-full justify-between items-center rounded-lg px-4 py-2 bg-slate-50 border border-slate-50 text-zinc-950 hover:bg-zinc-950 hover:text-slate-50 transition-all`} >
            <section className=" flex flex-col gap-1">
                <h2 className=" text-2xl font-semibold ">{item.name}</h2>
                <h4>Created: {(new Date(item.createdAt)).toLocaleString()}</h4>
            </section>
            <section className=" flex flex-row gap-2">
                <section className=" flex flex-col gap-2">
                    <div className={`py-2 px-4 text-lg rounded-md font-bold border border-zinc-950 ${hover?"bg-slate-50  text-zinc-950":"bg-zinc-950 text-slate-50"} transition-all`}>
                        <h3>T - {item.team.name}</h3>
                    </div>
                    <div className={`py-2 px-4 text-lg rounded-md font-bold border border-zinc-950 ${hover?"bg-slate-50  text-zinc-950":"bg-zinc-950 text-slate-50"} transition-all`}>
                        <h3>G - {item.group.name}</h3>
                    </div>
                </section>
                <button className={`${buttonClassNames} !rounded-full !flex-shrink`}>
                    <ArrowTopRightIcon className=" w-6 h-6"/>
                </button>
            </section>
        </article>
    )
}

export default function PasswordSection() {
    const [passwords, setPasswords] = useState<Password[]>([])

    async function getInitialData() {
        const res = await apiHandler.getPasswordsGeneral({})
        if(!res||!res.success)return
        setPasswords(res.passwords)
    }
    
    useEffect(() => {
      getInitialData()
    }, [])
    
  return (
    <section className=" flex flex-col gap-4 py-3 w-full">
        {passwords.map((item, idx)=>{
            return(
                <PasswordCard key={`${idx}-password-card`} item={item}/>
            )
        })}
    </section>
  )
}
