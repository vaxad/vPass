"use client"

import Loader from "@/components/Loader"
import { apiHandler } from "@/utils/api"
import { buttonClassNames, deployedFrontendUrl, font, trim } from "@/utils/constants"
import context from "@/utils/context/context"
import { Password } from "@/utils/types"
// import { ArrowTopRightIcon, Pencil1Icon, PlusIcon, Share1Icon, Share2Icon } from "@radix-ui/react-icons"
import { Entypo, MaterialIcons } from "@expo/vector-icons"
import { useContext, useEffect, useState } from "react"
import { toast } from "@/utils/constants"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Link, useRouter } from "expo-router"
import GradientButton from "@/components/GradientButton"
import { LinearGradient } from "expo-linear-gradient"
import * as Clipboard from "expo-clipboard"

const PasswordCard = ({ item }: { item: Password }) => {
    async function handlePublicLink() {
        if (item.public !== true) return toast("Private passwords cannot have public links!")
        if (item.views === 0) return toast("No public views left!")
        const url = deployedFrontendUrl
        Clipboard.setStringAsync(`${url}/public/${item.id}`)
        toast(`Public link for password of "${item.name}" copied (views left: ${item.views})`)
    }

    return (
        <LinearGradient colors={["rgba(255, 255, 255, 0)", "rgba(125, 125, 125, 0.07)"]} start={{ x: 0, y: 0.91 }} end={{ x: 0, y: 0 }} >
            <TouchableOpacity activeOpacity={1}  >
                <View className={` flex flex-col flex-grow md:flex-row w-full  justify-between items-start  rounded-lg p-5 border border-[#1F1F1F] transition-all`} >
                    <View className=" flex flex-col  gap-1">
                        <Text style={{ ...font.semiBold }} className="   text-3xl bg-clip-text bg-gradient-to-b from-[#FFFFFF] to-[hsl(0,0%,100%,42%)]  text-transparent  ">{item.name}</Text>
                        {/* <h4>Created: {(new Date(item.createdAt)).toLocaleString()}</h4> */}
                        <View className=" flex flex-row items-center py-4">
                            <View className={`py-1 px-3 text-sm text-nowrap shrink rounded-full  bg-[rgba(255,255,255,0.27)] text-whit transition-all`}>
                                <Text style={{ ...font.regular }} className=" opacity-50">{trim(item.team.name, 24)}</Text>
                            </View>
                            <View className=" bg-[#444444] w-6 h-0.5">

                            </View>
                            <View className={`py-1 px-3 text-sm text-nowrap shrink rounded-full  bg-[rgba(0,163,255,0.27)] transition-all`}>
                                <Text className="" style={{ ...font.regular, color: "#00A3FF" }} >{trim(item.group.name, 24)}</Text>
                            </View>
                        </View>
                        <Text style={{ ...font.regular }} className=" text-[#696969] text-xs">Created at: {(new Date(item.createdAt)).toLocaleString()}</Text>
                    </View>
                    <View className="flex flex-row md:flex-col min-h-fit md:min- w-full pt-4 md:pt-0 md:w-fit gap-1 justify-between">
                        <TouchableOpacity activeOpacity={0.7} onPress={handlePublicLink} className={` w-fit p-2 self-end flex justify-center items-center aspect-square rounded-lg bg-[#1E1E1E] text-[#A5A5A5] `}>
                            {/* <Share1Icon className=" w-4 h-4" /> */}
                            <Entypo name="share" className=" w-4 h-4" />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Link href={`/passwords/view/${item.id}`} className={`bg-[rgba(6,234,249,0.15)] rounded-full text-white flex flex-row gap-2  justify-center items-center w-fit py-1 px-3`}>
                                <Text style={{ ...font.regular }} className=" text-sm text-nowrap">View Password</Text>
                                <MaterialIcons name="arrow-outward" className=" w-4 h-4 " />
                                {/* <ArrowTopRightIcon className=" w-4 h-4" /> */}

                            </Link>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </LinearGradient>
    )
}

export default function PasswordSection() {
    const [passwords, setPasswords] = useState<Password[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { selectedGroup, selectedTeam } = useContext(context)

    const router = useRouter()
    async function getInitialData() {
        setLoading(true)
        const res = await apiHandler.getPasswordsGeneral({ groupId: selectedGroup, teamId: selectedTeam })
        if (!res || !res.success) return
        setPasswords(res.passwords)
        setLoading(false)
    }

    useEffect(() => {
        if (!selectedTeam) return
        getInitialData()
    }, [selectedGroup, selectedTeam])

    return loading ? (
        <Loader />
    ) : (
        <ScrollView>
            <View className=" gap-4 pt-5 pb-48 flex flex-col  w-full">
                {/* <Link href={"/passwords/create"} style={{backgroundImage:"linear-gradient(180deg, transparent 9%, hsl(0,0%,49%,7%) 100%)"}} className=" cursor-pointer active:scale-95 py-8 w-full  hover:shadow-[0_9px_27px_0px_hsl(0,0,0,100%)] rounded-lg border border-[#4B4B4B] text-[#4B4B4B] hover:text-[#001B7B] hover:border-[#001B7B] transition-all flex justify-center items-center flex-col">
            <PlusIcon className=" w-8 h-8" />
            <Text style={{ ...font.semiBold }} className=" ">Create New</Text style={{ ...font.semiBold }}>
        </Link> */}
                <GradientButton props={{ onPress: () => { router.push("/passwords/create") } }} text="Create New" />
                {passwords.map((item, idx) => {
                    return (
                        <PasswordCard key={`${idx}-password-card`} item={item} />
                    )
                })}
            </View>
        </ScrollView>
    )
}
