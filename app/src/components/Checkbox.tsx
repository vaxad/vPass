import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';

const Checkbox = ({value=false, onClick=()=>{}, color="#000000"}) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onClick} className=' p-1 rounded-full border' style={{backgroundColor:value?color:"#ffffff", borderColor:color}}>
    <View style={{opacity:value?1:0}}>
     <FontAwesome5 name="check" size={10} color="white" />
     </View>
    </TouchableOpacity>
  )
}

export default Checkbox