"use client"
import Link from "next/link"
import SignOutBtn from "./SignOutBtn"
import { useState } from "react"
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { buttonClassNames } from "@/utils/constants"

export default function MobileNav({paths}:{paths:{path:string, name:string}[]}) {
    const [open, setOpen] = useState(false)
    function toggleOpen(){
        setOpen((o)=>!o)
    }
  return (
    <section className=" md:hidden flex">
        <section className={` z-40 w-full h-full bg-slate-50 fixed top-0 right-0 flex flex-col justify-center items-center gap-3 ${open?" translate-x-0":" -translate-y-full"} transition-all duration-500 delay-100 ease-in-out `}>            
                {paths.map((item, idx)=><Link onClick={toggleOpen} key={`link-${idx}`} className={`${buttonClassNames}`} href={item.path}>{item.name}</Link>)}
                <SignOutBtn/>
                <button onClick={toggleOpen} className={` ${buttonClassNames} !rounded-full !p-2`}>
                    <Cross1Icon className=" w-6 h-6" />
                </button>
        </section>
        <button onClick={toggleOpen} className={` ${buttonClassNames} !p-2`}>
            <HamburgerMenuIcon className=" w-6 h-6" />
        </button>
    </section>
  )
}
