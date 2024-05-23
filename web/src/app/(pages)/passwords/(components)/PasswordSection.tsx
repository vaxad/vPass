"use client"

import Loader from "@/components/Loader"
import { apiHandler } from "@/utils/api"
import { buttonClassNames, trim } from "@/utils/constants"
import { Password } from "@/utils/types"
import { ArrowTopRightIcon, Pencil1Icon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useEffect, useState } from "react"

const PasswordCard = ({item}:{item:Password}) => {
    const [hover, setHover] = useState(false);
    const handleRegister = async () => {
           
    };
    
    return (
        <article onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)} className={` flex flex-col flex-grow md:flex-row w-full justify-between items-start md:items-center rounded-lg px-4 py-2 bg-slate-50 border border-slate-50 text-zinc-950 hover:bg-zinc-950 hover:text-slate-50 transition-all`} >
            <section className=" flex flex-col gap-1">
                <h2 className=" text-2xl font-semibold ">{item.name}</h2>
                <h4>Created: {(new Date(item.createdAt)).toLocaleString()}</h4>
            </section>
            <section className=" flex flex-col md:flex-row gap-2 w-full md:w-fit">
                <section className=" flex flex-wrap flex-row md:flex-col gap-2">
                    <div className={`py-2 px-4 text-xs md:text-lg text-nowrap shrink rounded-full font-bold border border-zinc-950 ${hover?"bg-slate-50  text-zinc-950":"bg-zinc-950 text-slate-50"} transition-all`}>
                        <h3>T - {trim(item.team.name,16)}</h3>
                    </div>
                    <div className={`py-2 px-4 text-xs md:text-lg text-nowrap shrink rounded-full font-bold border border-zinc-950 ${hover?"bg-slate-50  text-zinc-950":"bg-zinc-950 text-slate-50"} transition-all`}>
                        <h3>G - {trim(item.group.name, 16)}</h3>
                    </div>
                </section>
                <section className=" flex flex-row gap-1">
                  {/* <Link href={`/passwords/edit/${item.id}`} onClick={handleRegister} className={`${buttonClassNames} border !border-slate-50 !rounded-full !flex-shrink justify-center items-center flex `}>
                      <Pencil1Icon className=" w-6 h-6"/>
                  </Link> */}
                  <Link href={`/passwords/view/${item.id}`} onClick={handleRegister} className={`${buttonClassNames} border !border-slate-50 !rounded-full !flex-shrink !w-full md:w-fit justify-center items-center flex`}>
                      <ArrowTopRightIcon className=" w-6 h-6"/>
                  </Link>
                </section>
            </section>
        </article>
    )
}

export default function PasswordSection() {
    const [passwords, setPasswords] = useState<Password[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    async function getInitialData() {
        const res = await apiHandler.getPasswordsGeneral({})
        if(!res||!res.success)return
        setPasswords(res.passwords)
        setLoading(false)
    }
    
    useEffect(() => {
      getInitialData()
    }, [])
    
  return loading?(
    <Loader size={200} />
  ):(
    <section className=" flex flex-col gap-4 py-3 w-full">
        {passwords.map((item, idx)=>{
            return(
                <PasswordCard key={`${idx}-password-card`} item={item}/>
            )
        })}
    </section>
  )
}
