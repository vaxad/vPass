import { View, Text } from 'react-native'
import React from 'react'
import { font } from '@/utils/constants'

const Loader = () => {
    return (
        <View className='w-full flex flex-grow justify-center items-center p-5'>
            <Text style={font.bold} className=' text-2xl'>Loading...</Text>
        </View>
    )
}

export default Loader