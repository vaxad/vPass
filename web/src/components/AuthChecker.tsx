"use client"

import { apiHandler } from "@/utils/api"
import context from "@/utils/context/context"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function AuthChecker() {
    const path = usePathname()
    const {user, setUser} = useContext(context)
    const router = useRouter()
    const publicPaths = ["/","/login","/signup","/public"]
    const authPaths = ["/passwords","/otp","/teams","/public"]
    function isPublic(path: string){
        return path.startsWith("/public") || publicPaths.includes(path)
    }
    function isPrivate(path: string){
        if(path==='/')return true;
        for(const p of authPaths){
            if(path.startsWith(p))return true
        }
    }
    function getToken(){
        const token = localStorage.getItem("token")
        return token
    }
    function removeInvalidToken(){
        const token = localStorage.getItem("token")
        if(token)localStorage.removeItem("token")
    }
    async function getUser(){
        const res = await apiHandler.getMe();
        if(!res||!res.user)removeInvalidToken()
        setUser(res.user)
    }
    useEffect(() => {
      if(getToken()){
        if(!isPrivate(path)){
            router.replace("/passwords")
        }
        if(!user){
            getUser()
        }
      }else if(!isPublic(path)){
        router.replace("/signup")
      }
    }, [path, user])

    async function checkServer(){
      const res = await apiHandler.check();
    }
    
    useEffect(() => {
      checkServer()
    }, [])
    
    
  return (
    <></>
  )
}
