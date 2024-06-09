"use client"

import { buttonClassNames, font, removeLocalItem } from "@/utils/constants"
import context from "@/utils/context/context"
import { Link } from "expo-router"
import { useRouter } from "expo-router"
import { useContext } from "react"
import { Text, TouchableOpacity } from "react-native"

export default function SignOutBtn() {
    const router = useRouter();
    const {user, setUser} = useContext(context)
    async function handleSignOut(){
        setUser(null)
        await removeLocalItem("token")
        router.replace("/")
    }
  return user?(
    <TouchableOpacity activeOpacity={1} onPress={handleSignOut} className={`${buttonClassNames} flex-nowrap text-nowrap`}>
        <Text className={`  hover:bg-slate-50 focus:bg-slate-50 hover:text-zinc-950 focus:text-zinc-950 text-slate-50`} style={font.bold}>Sign Out</Text>
    </TouchableOpacity>
  ):(
    <Link className={`${buttonClassNames}`} href={"/signup"}>Sign up</Link>
  )
}
