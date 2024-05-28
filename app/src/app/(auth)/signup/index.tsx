import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import { apiHandler } from '@/utils/api';
import { buttonClassNames, font } from '@/utils/constants';
import { useForm } from '@/utils/hooks/useForm';
import { SignupData } from '@/utils/types';
import { useRouter } from 'expo-router';
import { toast } from '@/utils/constants';
import Checkbox from '@/components/Checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Checkbox from 'expo-checkbox';

const Index = () => {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [data, handleChange, changeValue] = useForm<SignupData>({
        email: "",
        password: "",
        cpassword:"",
        username: ""
    })
    async function handleFormSubmit(){
        if(data.cpassword !== data.password)return toast("Passwords do not match!")
        const res = await apiHandler.signup(data)
        if(!res||!res.token) return toast("Signup failed!")
        toast("Signup successful!")
        console.log(res)
        await AsyncStorage.setItem("token",res.token)
        router.replace("/otp")
    }

  return (
    <View className=' flex w-full h-full bg-zinc-950 flex-col px-6 md:px-12 py-8'>
        <Text style={{...font.bold}} className=' text-center text-4xl text-slate-50 py-4'>Sign up to vPass!</Text>
        <View  className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-6 rounded-md border border-slate-600 '>
            <View className=' flex flex-col gap-1 w-full'>
                <Text style={{...font.bold}} className=' text-2xl '>Username </Text>
                <TextInput style={{...font.semiBold}} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 placeholder:text-zinc-50 focus:placeholder:text-zinc-950 border border-zinc-950 transition-all' textContentType="username" placeholder='joemama' value={data.username} onChangeText={(text)=>changeValue({name:"username", value:text})} />
            </View>
            <View className=' flex flex-col gap-1 w-full'>
                <Text style={{...font.bold}} className=' text-2xl '>Email</Text>
                <TextInput style={{...font.semiBold}} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 placeholder:text-zinc-50 focus:placeholder:text-zinc-950 border border-zinc-950 transition-all' textContentType="emailAddress" placeholder='joemama@alabama.com' value={data.email} onChangeText={(text)=>changeValue({name:"email", value:text})} />
            </View>
            <View className=' flex flex-col gap-1 w-full'>
                <Text style={{...font.bold}} className=' text-2xl '>Password </Text>
                <TextInput secureTextEntry={!show} style={{...font.semiBold}}  className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 placeholder:text-zinc-50 focus:placeholder:text-zinc-950 border border-zinc-950 transition-all' textContentType='password'  placeholder='JoeMama#1276' value={data.password} onChangeText={(text)=>changeValue({name:"password", value:text})} />   
            </View>
            <View className=' flex flex-col gap-1 w-full'>
                <Text style={{...font.bold}} className=' text-2xl '>Confirm Password </Text>
                <TextInput secureTextEntry={!show} style={{...font.semiBold}} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 placeholder:text-zinc-50 focus:placeholder:text-zinc-950 border border-zinc-950 transition-all' textContentType='password' placeholder='JoeMama#1276' value={data.cpassword} onChangeText={(text)=>changeValue({name:"cpassword", value:text})} />
                <View className=' flex flex-row gap-1  py-1 justify-start items-center'>
                    {/* <Checkbox onTouchEnd={()=>setShow(v=>!v)} color={"#00000"} value={show} /> */}
                    <Checkbox value={show} onClick={()=>{setShow(v=>!v)}} color='#000000' />
                    <Text className=' text-xs'>Show passwords</Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={handleFormSubmit} className={` ${buttonClassNames} w-full  flex justify-center items-center `}>
                <Text style={{...font.bold}} className='text-xl text-slate-50'>Submit</Text>
            </TouchableOpacity>
            <Link href={'/login'} className=' w-full text-center py-3 underline active:scale-95 hover:scale-105 transition-all '>Already have an account?</Link>
        </View>
    </View>
  )
}

export default Index