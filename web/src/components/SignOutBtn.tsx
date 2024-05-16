"use client"

import { buttonClassNames } from "@/utils/constants"
import context from "@/utils/context/context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext } from "react"

export default function SignOutBtn() {
    const router = useRouter();
    const {user, setUser} = useContext(context)
    function handleSignOut(){
        setUser(null)
        localStorage.removeItem("token")
        router.replace("/")
    }
  return user?(
    <button onClick={handleSignOut} className={`${buttonClassNames}`}>
        Sign Out
    </button>
  ):(
    <Link className={`${buttonClassNames}`} href={"/signup"}>Sign up</Link>
  )
}
