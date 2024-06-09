import { apiHandler } from '@/utils/api';
import { useForm } from '@/utils/hooks/useForm';
import { SignupData } from '@/utils/types';
import { useRouter } from 'expo-router';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { toast, font, setLocalItem } from '@/utils/constants';
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { buttonClassNames } from '@/utils/constants';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import GradientButton from '@/components/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignupForm({ setLogin }: { setLogin: Dispatch<SetStateAction<boolean>> }) {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [data, handleChange, changeValue] = useForm<SignupData>({
        email: "",
        password: "",
        cpassword: "",
        username: ""
    })
    async function handleFormSubmit() {
        // e.preventDefault();
        if (data.cpassword !== data.password) return toast("Passwords do not match!")
        const res = await apiHandler.signup(data)
        if (!res || !res.token) return toast("Signup failed!")
        toast("Signup successful!")
        console.log(res)
        await setLocalItem("token", res.token)
        router.replace("/otp")
    }
    return (
        <View className=' relative rounded-md border border-[#515151] w-full'>
            <LinearGradient style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", borderRadius: 6, opacity: 0.1 }} colors={["#FFFFFF", "#000000"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            </LinearGradient>
                <View className=' px-6 py-4 w-full'>
                    <View className=' flex flex-col gap-1 pb-2'>
                        <Text style={{ ...font.semiBold }} className=' text-left font-semibold text-2xl text-white'>Sign up to vPass!</Text>
                        <Text style={{ ...font.regular }} className=' text-xs text-[#6C6C6C]'>Not your basic password manager!</Text>
                    </View>
                    <View className=' flex flex-col gap-4 text-white w-full '>
                        <View className=' flex flex-col gap-1 '>
                            <Text style={{ ...font.regular }} >Username </Text>
                            <View className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555]  transition-all flex flex-row gap-1 items-center'>
                                <TextInput style={{ ...font.semiBold }} className='!bg-transparent !text-black max-w-[95%] outline-none placeholder:text-[#555555] w-full' textContentType='username' placeholder='joemama' value={data.username} onChangeText={(text) => changeValue({ name: "username", value: text.trim() })} />
                                {data.username.match(/[a-z0-9._]{3,}/) ? <AntDesign name='check' className=' w-4 h-4' /> : <Entypo name='cross' title='username should at lease be 3 letters, all lowercase' className=' w-4 h-4' />}
                            </View>
                        </View>
                        <View className=' flex flex-col gap-1 '>
                            <Text style={{ ...font.regular }} >Email </Text>
                            <View className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555]  transition-all flex flex-row gap-1 items-center'>
                                <TextInput style={{ ...font.semiBold }} autoComplete='off' className='!bg-transparent !text-black max-w-[95%]  outline-none placeholder:text-[#555555] w-full' textContentType="emailAddress" placeholder='joemama@alabama.com' value={data.email} onChangeText={(text) => changeValue({ name: "email", value: text.trim() })} />
                                {data.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) ? <AntDesign name='check' className=' w-4 h-4' /> : <Entypo name='cross' className=' w-4 h-4' />}
                            </View>
                        </View>
                        <View className=' flex flex-col gap-1 '>
                            <Text style={{ ...font.regular }} >Password</Text>
                            <View className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555]  transition-all flex flex-row gap-1 items-center'>
                                <TextInput style={{ ...font.semiBold }} autoComplete='off' className=' !bg-transparent !text-black max-w-[95%] outline-none placeholder:text-[#555555] w-full' textContentType={show ? "name" : "password"} placeholder='JoeMama#1276' value={data.password} onChangeText={(text) => changeValue({ name: "password", value: text.trim() })} />
                                <TouchableOpacity activeOpacity={0.6} onPress={() => { setShow((prev) => !prev) }}>
                                    {!show ? <AntDesign name='eyeo' className=' w-4 h-4' /> : <AntDesign name='eye' className=' w-4 h-4' />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className=' flex flex-col gap-1 '>
                            <Text style={{ ...font.regular }} >Confirm Password </Text>
                            <View className=' px-4 py-2 rounded-md outline-none text-white bg-black focus-within:bg-white focus-within:text-black border border-[#555555] transition-all flex flex-row gap-1 items-center'>
                                <TextInput style={{ ...font.semiBold }} className=' !bg-transparent !text-black max-w-[95%] outline-none placeholder:text-[#555555] w-full' textContentType={show ? "name" : "password"} placeholder='JoeMama#1276' value={data.cpassword} onChangeText={(text) => changeValue({ name: "cpassword", value: text.trim() })} />
                                <TouchableOpacity activeOpacity={0.6} onPress={() => { setShow((prev) => !prev) }}>
                                    {!show ? <AntDesign name='eyeo' className=' w-4 h-4' /> : <AntDesign name='eye' className=' w-4 h-4' />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <GradientButton props={{ onPress: handleFormSubmit }} />
                    </View>
                    <View className=' flex flex-row w-full justify-center items-center gap-0.5'>
                        <Text style={{ ...font.medium }} className='text-[#686868] text-nowrap text-center py-3'>Already have an account?</Text>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => setLogin(true)} >
                            <Text style={{ ...font.medium }} className=' !text-[#077CE8] underline decoration-[#077CE8]'>
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </View>
    )
}
