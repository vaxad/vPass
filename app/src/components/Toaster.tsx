import { View, Text, TextStyle, ViewStyle, ImageStyle } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { font } from '@/utils/constants'
import * as Animatable from 'react-native-animatable';
import useStore from '@/utils/zustand/store';
import { Toast, ToastBgColor, ToastTextColor } from '@/utils/types';

const from : TextStyle & ViewStyle & ImageStyle = {
    opacity:0,
    translateY: 100
}
const to : TextStyle & ViewStyle & ImageStyle = {
    opacity:1,
    translateY: 0 
}


const ToastComponent = ({item, idx}:{item:Toast, idx:number}) => {

    const [anim, setAnim] = useState({from:from, to:to})
    
    useEffect(() => {
      setTimeout(()=>{
        setAnim({from:to, to:from})
      }, 3000)
    }, [])

    const bgClr = ToastBgColor[item.type]
    const textClr = ToastTextColor[item.type]
    

return(
    <Animatable.View duration={1000}  animation={{ easing:"ease-in-out-cubic", ...anim }} style={{marginBottom:4*(idx%4), backgroundColor:bgClr}} className=' absolute bottom-0 right-0 py-3 px-6 w-full rounded-lg  border border-slate-500 ' >
        <Text style={{...font.medium, color:textClr}} className=' text-xl'>{item.message}</Text>
    </Animatable.View>
)
}

const Toaster = () => {
    const {toasts} = useStore()
  return (
    <View className=' absolute bottom-0 pointer-events-none right-0 w-full p-5 flex justify-center items-center'>
        <View className=' w-full relative flex flex-col gap-2'>
            {toasts.map((item, idx)=>{
                return  (
                    <ToastComponent item={item} idx={idx} key={`toast-${idx}`}  />
                )
            })}
        </View>
    </View>
  )
}

export default Toaster