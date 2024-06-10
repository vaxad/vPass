import { font } from "@/utils/constants";
import { DropdownItem } from "@/utils/types"
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";


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
        <View className=" flex flex-col " style={{ zIndex: 10000, elevation: 50 }}>
            <TouchableOpacity onPress={toggleOpen} onBlur={toggleOpen} disabled={disabled} className={` ${className}  w-fit flex flex-row items-center gap-2 outline-none ${disabled ? "" : ""}`}>
                <Text style={font.regular} className={`text-[#367AFF]  text-sm w-fit ${className} px-3 py-2 rounded-sm outline-none bg-[rgba(54,122,255,0.15)] transition-all`}>
                    {selectedItem ? selectedItem.name : "Loading your teams"}
                    {/* Select */}
                </Text>
                <View className=" flex flex-col flex-grow h-full w-fit ">
                    <View className=" ">
                        <MaterialIcons name="keyboard-arrow-up" color={"#9A9A9A"} className=" w-4 h-4" />
                    </View>
                    <View className=" ">
                        <MaterialIcons name="keyboard-arrow-down" color={"#9A9A9A"} className=" w-4 h-4" />
                    </View>
                </View>
            </TouchableOpacity>
            <View className={`w-fit ${className} relative   text-[#989898]`}>
                {open ? <View className=" absolute top-2 left-2 bg-white rounded-md flex flex-col p-2 " >
                    {title ? <Text style={font.regular} className=" !text-xs !py-1 px-4 !text-gray-600">{title}</Text> : <></>}
                    <FlatList
                        data={data}
                        renderItem={({ item, index: idx },) => (
                            <TouchableOpacity className={` text-sm py-2 px-2  ${item.value === defaultSelectedItem ? "text-white" : ""} ${item.onClickFn ? " " : ""}`} onPress={() => item.onClickFn ? item.onClickFn() : handleSelect(idx)}>
                                <Text style={font.regular} className=" !text-black"> {item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, ind) => ind.toString()}
                    />
                </View> : <></>}
            </View>
        </View>

    )
}
