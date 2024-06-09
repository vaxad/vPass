"use client"
import { useState } from "react"
import SignupForm from "./(components)/SignupForm"
import LoginForm from "./(components)/LoginForm"
import { ImageBackground, Text, TouchableOpacity, View } from "react-native"
import { font } from "@/utils/constants"

const index = () => {
    const [login, setLogin] = useState(true)
    return (
        <View className=' flex w-full  h-full flex-grow flex-col px-6 md:px-12 py-12 justify-start items-center'>
            <View className='  relative flex flex-col gap-2 w-full md:w-[35vw]'>
                <View className=' flex flex-row gap-2'>
                    <TouchableOpacity onPress={()=>setLogin(true)} className=' px-4 md:px-5 py-2 w-[10ch] rounded-lg text-nowrap border border-[#787878] text-white' style={{opacity:login?1:0.3}}>
                      <Text style={{ ...font.semiBold}}>Log in</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={()=>setLogin(false)} className=' px-4 md:px-5 py-2 w-[10ch] rounded-lg text-nowrap border border-[#787878] text-white' style={{opacity:!login?1:0.3}}>
                        <Text style={{ ...font.semiBold}}>Sign up</Text> 
                    </TouchableOpacity>
                </View>
                {login?
                <LoginForm setLogin={setLogin}/>:<SignupForm setLogin={setLogin}/>}
                {/* <BlurView intensity={10} style={{display:"flex", overflow:"hidden"}}> */}
                    <ImageBackground blurRadius={4} source={require("@/assets/images/lock.png")}  className="w-[450px] h-[450px] bg-no-repeat opacity-20 scale-125 -z-20 absolute right-0 top-0 translate-x-[100] -rotate-[20deg]" >
                    </ImageBackground>
                {/* </BlurView> */}
                {/* <View style={{backgroundImage:"linear-gradient(180deg, transparent, #010205 96%),url(/images/lock.png)"}} /> */}
            </View>
        </View>

    )
}


export default index