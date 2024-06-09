import { View, Text, TextInput, TouchableOpacity, Keyboard, ImageBackground } from 'react-native'
import { apiHandler } from '@/utils/api';
import { font, otpLength } from '@/utils/constants';
import context from '@/utils/context/context';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from '@/utils/constants';
import GradientButton from '@/components/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';
// import Checkbox from 'expo-checkbox';

const Index = () => {
    const router = useRouter()
    const submitRef = useRef<TouchableOpacity>(null)
    const initialOtp = []
    const u1 = useRef<TextInput>(null)
    const u2 = useRef<TextInput>(null)
    const u3 = useRef<TextInput>(null)
    const u4 = useRef<TextInput>(null)
    const u5 = useRef<TextInput>(null)
    const u6 = useRef<TextInput>(null)
    const useRefs:React.RefObject<TextInput>[] = [u1, u2, u3, u4, u5, u6]
    for(let i=0;i<otpLength;i++){
        initialOtp.push("")
    }
    const [otp, setOtp] = useState<string[]>(initialOtp)
    const {user} = useContext(context)

    useEffect(() => {
      if(user&&user.verified){
        toast("User already verified ")
        router.replace("/")
      }
    }, [user])
    

    async function handleResend(){
        console.log("resending")
        const res = await apiHandler.resendOTP()
        console.log(res)
        if(!res||!res.success)return
        toast("OTP sent successfully!")
    }

    function handleChange(text:string, ind:number){
        console.log(text)
        if (!text.match(/^\d$/)) {
            if(useRefs[ind].current){
                const field = useRefs[ind].current 
                
            }
            return
        }
        const temp = otp;
        temp[ind] = text;
        setOtp(temp);
        console.log(otp);
        if (ind < otpLength - 1 && text.length === 1) {
            useRefs.length > 0 ? useRefs[ind + 1].current?.focus() : "";
        } else if (text.length === 1) {
            console.log("end")
            // submitRef.current.focus()
            Keyboard.dismiss()
        }
    }

    async function handleFormSubmit() {
        const otpStr = otp.join("");
        console.log({otpStr})
        if(otpStr.length!==otpLength)return toast("Invalid OTP!")
        const res = await apiHandler.verifyOTP({otp:otpStr})
        if(!res||!res.success) return toast("Verification failed!")
        toast("Verification successful!")
        console.log(res)
        router.replace("/")
    }

    // style={{...font.medium}}
  return (
    <View className=' flex w-full flex-grow bg-transparent justify-center items-center flex-col px-6 md:px-12 py-8'>
    <View className=''>
        <View className=' relative rounded-md border border-[#515151]  flex flex-col'> 
        <LinearGradient style={{position:"absolute", top:0, right:0, width:"100%", height:"100%", borderRadius:6, opacity:0.1}}  colors={["#FFFFFF", "#000000"]} start={{x:0, y:0}} end={{x:1, y:1}}>
                
                </LinearGradient>
            <View className=' px-8 py-2 w-full'>
        {/* shadow-[0_0_21px_2px_hsl(227,100%,29%,10%)] */}
        <Text style={{...font.semiBold}}  className=' text-left font-semibold text-2xl text-slate-50 pt-4'>Verify your Email with OTP!</Text>
        <Text style={{...font.medium}}  className=' pb-4 text-sm font-medium text-[#6C6C6C] text-left '>{`An OTP has been sent to your registered email${user?` (${user?.email})`:""}`}</Text>
        <View className=' flex flex-col gap-2 text-white p-3 w-fit '>
            <View className=' flex flex-row gap-2 '>
                {[...Array(otpLength)].map((item, idx)=>{
                    return(
                        <TextInput style={{...font.semiBold}}  ref={useRefs[idx]} key={`otp-${idx}`} className=' flex justify-center items-center text-center  w-[15%] px-2 py-4 rounded-lg text-2xl md:text-3xl   outline-none transition-all border border-[#3A3A3A]' value={item} onChangeText={(text)=>{handleChange(text, idx)}} textContentType="oneTimeCode"  />
                    )
                })}
            </View>
            <GradientButton props={{onPress:handleFormSubmit}} ref={submitRef}/>
            <TouchableOpacity activeOpacity={0.7} onPress={handleResend} className=' w-full  py-3  active:scale-95 transition-all '>
               <Text style={{...font.medium}} className='text-[#077CE8] decoration-[#077CE8] underline text-center'>Resend OTP?</Text> 
                </TouchableOpacity>
        </View>
        </View>
        </View>
        <ImageBackground blurRadius={4} source={require("@/assets/images/check.png")}  className="w-[350px] h-[350px] bg-no-repeat opacity-20 scale-125 -z-20 absolute left-0 top-0 -translate-x-[100] -translate-y-[300] -rotate-[20deg]" >
                    </ImageBackground>
        {/* <div style={{backgroundImage:"linear-gradient(180deg, transparent, #010205 96%),url(/images/check.png)"}} className="w-[350px] h-[350px] bg-no-repeat opacity-20 scale-125 -z-20 absolute left-0 top-0 -translate-x-[20%] -translate-y-[60%] md:-translate-x-[70%] md:-translate-y-[20%] -rotate-[20deg]" /> */}
    </View>
</View>
  )
}

export default Index