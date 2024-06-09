import { View, Text, TextStyle, ViewStyle, ImageStyle } from 'react-native'
import React, { useContext } from 'react'
import { font } from '@/utils/constants'
import * as Animatable from 'react-native-animatable';
import context from '@/utils/context/context';

const Toast = ({item, idx}:{item:string, idx:number}) => {
    const from : TextStyle & ViewStyle & ImageStyle = {
        opacity:0,
        translateY: 100
    }
    const to : TextStyle & ViewStyle & ImageStyle = {
        opacity:1,
        translateY: 0 
    }

return(
    <Animatable.View duration={1000}  animation={{ easing:"ease-in-out-cubic", from:from, to:to }} style={{marginBottom:4*idx}} className=' absolute bottom-0 right-0 py-3 px-6 w-full rounded-lg bg-white border border-slate-500 '>
        <Text style={{...font.medium}} className='!text-black text-xl'>{item}</Text>
    </Animatable.View>
)
}

const Toaster = () => {
    const {toasts} = useContext(context)
  return (
    <View className=' absolute bottom-0 pointer-events-none right-0 w-full p-5 flex justify-center items-center'>
        <View className=' w-full relative flex flex-col gap-2'>
            {toasts.slice(toasts.length-4,toasts.length).map((item, idx)=>{
                return  (
                    <Toast item={item} idx={idx} key={`toast-${idx}`}  />
                )
            })}
        </View>
    </View>
  )
}

export default Toaster