"use client"

import { buttonClassNames } from "@/utils/constants"
import context from "@/utils/context/context"
import Link from "next/link"
import { FaUser } from "react-icons/fa6";
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { MdLogout } from "react-icons/md";
import AlertComponent from "./AlertComponent";

export default function SignOutBtn() {
    const router = useRouter();
    const {user, setUser} = useContext(context)
    async function handleSignOut(){
        setUser(null)
        localStorage.removeItem("token")
        router.replace("/")
    }

  return user?(
    <section className=" relative flex flex-row items-center gap-5">
      <div className=" w-0.5 rounded-xl h-6  bg-[#333333]"></div>
    <button className={` flex-nowrap peer overflow-clip pt-0.5 scale-150 aspect-square text-nowrap bg-gradient-to-b from-[#EAEAEA] to-[#848484] border border-slate-50 rounded-full`}>
        <FaUser className=" text-black "/>
    </button>
    {/* <section className={`absolute bottom-0 right-0 ${focus?"translate-y-[110%] opacity-100 scale-100":" -translate-y-[200%] opacity-0 scale-50"}  origin-top-right `}> */}
    <section className={`absolute bottom-0 right-0  origin-top-right -translate-y-[200%] opacity-[0] scale-50 peer-focus:translate-y-[110%] peer-focus:opacity-[1] peer-focus:scale-100 duration-500 delay-150 transition-all `}>
      <AlertComponent  title='Are you sure?' description={`This will log you out`} onAction={handleSignOut} trigger={
              (
              <div title='Log out' className={` w-fit flex-row flex text-nowrap flex-nowrap gap-2 text-[#B90000] items-center py-2 px-4 bg-black hover:bg-zinc-900 transition-all border rounded-lg border-[#515151]`}>
                  <MdLogout className='w-5 h-5'/>
                  <h3>Log out</h3>
              </div>
              )
          } />
        </section>
    </section>
  ):(
    // <Link className={`${buttonClassNames}`} href={"/signup"}>Sign up</Link>
    <></>
  )
}
