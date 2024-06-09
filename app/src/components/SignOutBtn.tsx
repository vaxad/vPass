"use client"

import { buttonClassNames, font, removeLocalItem, toast } from "@/utils/constants"
import context from "@/utils/context/context"
import { Link } from "expo-router"
import { useRouter } from "expo-router"
import { useContext } from "react"
import { Text, TouchableOpacity } from "react-native"

export default function SignOutBtn() {
    const router = useRouter();
    const {user, setUser} = useContext(context)
    async function handleSignOut(){
        toast("Signing out!")
        setUser(null)
        await removeLocalItem("token")
        toast("Signed out successfully")
        router.replace("/")
    }
  return user?(
    <TouchableOpacity activeOpacity={1} onPress={handleSignOut} className={`${buttonClassNames} flex-nowrap text-nowrap`}>
        <Text className={`  text-slate-50`} style={font.bold}>Sign Out</Text>
    </TouchableOpacity>
  ):(
    <Link className={`${buttonClassNames}`} href={"/signup"}>Sign up</Link>
  )
}
