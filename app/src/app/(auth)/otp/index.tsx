import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { apiHandler } from '@/utils/api';
import { buttonClassNames, font, otpLength } from '@/utils/constants';
import context from '@/utils/context/context';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from '@/utils/constants';
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
  return (
    <View className=' flex w-full h-full bg-zinc-950 flex-col px-6 md:px-12 py-8'>
    <Text style={{...font.bold}} className=' text-center  text-2xl md:text-4xl text-slate-50 pt-4'>Verify your Email with OTP!</Text>
    <Text style={{...font.medium}} className=' pb-4 text-sm md:text-lg  text-slate-50 text-center '>{`An OTP has been sent to your registered email${user?`(${user?.email})`:""}`}</Text>
    <View className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-6 rounded-md border border-slate-600 '>
        <View className=' flex flex-row gap-1'>
            {[...Array(otpLength)].map((item, idx)=>{
                return(
                    <TextInput textContentType='oneTimeCode' keyboardType='number-pad' ref={useRefs[idx]} key={`otp-${idx}`} style={{...font.semiBold}} className=' flex justify-center items-center text-center  flex-grow  px-2 py-4 md:py-6 lg:py-8 rounded-lg text-2xl md:text-4xl lg:text-5xl  outline-none text-slate-50 bg-zinc-950  border border-zinc-950 transition-all' onChangeText={(text)=>{handleChange(text, idx)}} />
                )
            })}
        </View>
        <TouchableOpacity activeOpacity={1} onPress={handleFormSubmit} ref={submitRef} className={` ${buttonClassNames} w-full  flex justify-center items-center `}>
            <Text style={{...font.bold}} className='text-2xl text-slate-50'>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResend} className=' w-full flex justify-center items-center text-center py-3 underline active:scale-95 hover:scale-105 transition-all '>
            <Text style={{...font.semiBold}}>Resend OTP?</Text>
        </TouchableOpacity>
    </View>
</View>
  )
}

export default Index