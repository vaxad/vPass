import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React, { Ref } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { font } from '@/utils/constants'

const GradientButton = ({ text="Submit", props, ref}:{props?:TouchableOpacityProps, text?:string, ref?:Ref<TouchableOpacity>}) => {
    return (
        <LinearGradient  colors={["#0D0F14", "#030408"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ borderRadius: 6 }}>
            <TouchableOpacity ref={ref}  activeOpacity={0.6} className={` py-2 px-4 rounded-md border border-[#3A3A3A] w-full flex justify-center items-center ${props.className}`} {...props} >
                <Text style={{ ...font.semiBold }} className=' text-2xl'>{text}</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}

export default GradientButton