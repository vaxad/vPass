import { font, trim } from "@/utils/constants";
import { DropdownItem } from "@/utils/types"
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";


export default function Dropdown({ data, defaultSelectedItem, handleChange, disabled = false, title, className = "" }: { data: DropdownItem[], defaultSelectedItem?: string, handleChange: (val: string) => void, disabled?: boolean, title?: string, className?: string }) {
    const ind = defaultSelectedItem === "" ? 0 : data.findIndex((i) => i.value === defaultSelectedItem)
    const selectedItem = data[ind === -1 ? 0 : ind]
    const [open, setOpen] = useState(false)
    function handleSelect(ind: number) {
        handleChange(data[ind].value)
    }
    function toggleOpen() {
        setOpen((o) => !o)
    }
    // console.log(data)
    return (
        <View className=" flex flex-col " style={{ zIndex: 10000, elevation: 500 }}>
            <LinearGradient colors={["#181818", "#000000"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ borderRadius: 6 }}>
                <TouchableOpacity onPress={toggleOpen} onBlur={toggleOpen} disabled={disabled} className={` ${className}  w-fit flex flex-row p-1  items-center gap-2 outline-none ${disabled ? "" : ""}`}>
                    <View className=" p-1 bg-gradient-to-b from-[#181818] to-black aspect-square h-[35px]  flex justify-center items-center flex-shrink rounded-sm text-xl font-medium bg-transparent border border-[#515151]">
                        <Text style={font.regular} className=" text-white opacity-[36%] ">{selectedItem ? selectedItem.name[0].toUpperCase() : "T"}</Text>
                    </View>
                    <Text style={font.regular} className="hidden md:flex font-medium text-sm md:pr-0 pr-2 ">{selectedItem ? selectedItem.name : "Loading your teams"}</Text>
                    <Text style={font.regular} className="flex md:hidden font-medium text-sm md:pr-0 pr-2 ">{selectedItem ? trim(selectedItem.name, 25) : "Loading"}</Text>
                    <Text style={font.regular} className=" hidden md:flex py-0.5 px-2 rounded-full bg-[#54565c] text-white text-xs font-medium">Team</Text>
                    <View className=" flex flex-col flex-grow justify-center items-center w-fit bg-[rgba(255,255,255,0.15)] rounded-md text-[#9A9A9A] ">
                        <View className=" ">
                            <MaterialIcons name="keyboard-arrow-up" color={"#9A9A9A"} className=" w-4 h-4" />
                        </View>
                        <View className=" ">
                            <MaterialIcons name="keyboard-arrow-down" color={"#9A9A9A"} className=" w-4 h-4" />
                        </View>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
            <View className={`w-fit ${className}`}>
                {open ?
                    <View className="absolute top-2  right-0" style={{ width: 300 }}>
                        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator contentContainerStyle={{ height: 400 }} className="  bg-white  rounded-md flex flex-col p-2 " style={{ zIndex: 10000, flex: 1, height: "100%", overflow: "visible" }} >
                            {title ? <Text style={font.regular} className=" !text-xs !py-1 px-4 !text-gray-600">{title}</Text> : <></>}
                            {/* <FlatList
                            data={data}
                            scrollEnabled={false}
                            style={{ flexGrow: 1 }}
                            showsVerticalScrollIndicator
                            renderItem={({ item, index: idx },) => (
                                <TouchableOpacity className={` text-sm py-2 px-2  ${item.value === defaultSelectedItem ? "text-white" : ""} ${item.onClickFn ? " " : ""}`} onPress={() => item.onClickFn ? item.onClickFn() : handleSelect(idx)}>
                                    <Text style={font.regular} className=" !text-black"> {item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, ind) => ind.toString()}
                        /> */}
                            {[...data, ...data].map((item, idx) => {
                                return (
                                    <TouchableOpacity key={`team-${idx}`} className={` text-sm py-2 px-2  ${item.value === defaultSelectedItem ? "text-white" : ""} ${item.onClickFn ? " " : ""}`} onPress={() => item.onClickFn ? item.onClickFn() : handleSelect(idx)}>
                                        <Text style={font.regular} className=" !text-black"> {item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    : <></>}
            </View>
        </View >

    )
}
