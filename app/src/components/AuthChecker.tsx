import { apiHandler } from "@/utils/api"
import context from "@/utils/context/context"
import { usePathname, useRouter } from "expo-router"
import { useContext, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "@/utils/types";

export default function AuthChecker() {
    const path = usePathname()
    const {user, setUser} = useContext(context)
    const router = useRouter()
    const publicPaths = ["/login","/signup"]
    const authPaths = ["/otp","/passwords","/public"]
    function isPublic(path: string){
        return path.startsWith("/public") || publicPaths.includes(path)
    }
    function isPrivate(path: string){
        if(path==='/')return true;
        for(const p of authPaths){
            if(path.startsWith(p))return true
        }
    }
    async function getToken(){
        const token =  await AsyncStorage.getItem("token")
        return token
    }
    async function removeInvalidToken(){
        const token =  await AsyncStorage.getItem("token")
        if(token) await AsyncStorage.removeItem("token")
    }
    async function getUser(){
        const res = await apiHandler.getMe();
        console.log(res)
        if(!res||!res.user)return removeInvalidToken()
        setUser(res.user)
    }

    async function authCheck(path: string, user:User){
      if(await getToken()){
        console.log("token found")
        if(!isPrivate(path)){
            router.replace("/")
        }
        if(!user){
            await getUser()
        }
      }else if(!isPublic(path)){
        router.replace("/signup")
      }
    }

    useEffect(() => {
      // console.warn({path})
      authCheck(path, user)
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
