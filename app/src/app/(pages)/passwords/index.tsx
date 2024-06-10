import { View, Text } from 'react-native'
import React from 'react'
import { font } from '@/utils/constants'
// import GroupChanger from '@/components/GroupChanger'
import Searchbar from '@/components/Searchbar'
import PasswordSection from './(components)/PasswordSection'
import GroupChanger from '@/components/GroupChanger'
import TeamChanger from '@/components/TeamChanger'

const index = () => {
    return (
        <View className={` flex flex-grow h-full flex-col  text-slate-50 py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-24`}>
            {/* <Header text="Passwords"/> */}
            {/* <View className=' flex flex-row w-full justify-end items-end' style={{ zIndex: 1000 }}>
                <TeamChanger />
            </View> */}
            <View className=" flex flex-col gap-4">
                <Text style={{ ...font.semiBold }} className=" text-2xl md:text-4xl transition-all">Passwords:</Text>
                <GroupChanger />
            </View>
            <View className=" flex flex-col-reverse md:flex-row py-2 md:gap-5 ">
                <View className=" flex flex-col w-full ">
                    <View className=" py-2 md:py-6 flex flex-row gap-2">
                        <Searchbar />
                        {/* <Link href={'/passwords/create'} title="Add Password" className={` ${buttonDarkClassNames} text-2xl font-extrabold`}>+</Link> */}
                    </View>
                    <View>
                        <PasswordSection />
                    </View>
                </View>
                {/* <View className=" w-full md:w-1/3 py-2 md:py-6">
        <GroupSection />
      </View> */}
            </View>
        </View>
    )
}

export default index