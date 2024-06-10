"use client"
import { apiHandler } from "@/utils/api"
import { font, generateRandomColor } from "@/utils/constants"
import { Password } from "@/utils/types"
import Entypo from "@expo/vector-icons/Entypo"
import { Link } from "expo-router"
import { useEffect, useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Password[]>([])
  async function getSuggestions(searchTerm: string) {
    const res = await apiHandler.searchPasswords({ searchTerm })
    if (!res || !res.success) return
    console.log(res)
    setSuggestions(res.passwords)
  }
  useEffect(() => {
    if (searchTerm.trim().length === 0) return setSuggestions((p) => [])
    getSuggestions(searchTerm)
  }, [searchTerm])

  return (
    <View className={` relative flex w-full md:w-[40vh] border border-[#494949] bg-black text-white rounded-lg flex-row items-center transition-all gap-3 py-2 px-4`}>
      <TextInput style={{ ...font.regular }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} value={searchTerm} onChangeText={(e) => setSearchTerm(e)} placeholder="Search Passwords" textContentType="name" className=' outline-none bg-transparent w-full  placeholder:text-[#4D4D4D] placeholder:italic  ' />
      <Entypo name="magnifying-glass" className=' w-5 h-5 text-[#7D7D7D]' />
      <TouchableOpacity activeOpacity={1} onPressIn={(e) => e.preventDefault()} className={` absolute bottom-0 translate-y-full ${focused && suggestions.length ? "flex" : "hidden"}  w-full flex-col bg-slate-50 z-20 rounded-md p-0.5`}>
        {suggestions.map((item, idx) => {
          const color = generateRandomColor()
          return (
            <TouchableOpacity activeOpacity={0.7} onFocus={() => setFocused(true)} >
              <Link href={`/passwords/view/${item.id}`}
                key={`search-password-${idx}`} className=" px-3 py-2 rounded-sm flex flex-row items-center gap-2 bg-transparent hover:bg-slate-200 cursor-pointer transition-all">
                <View className=" rounded-full aspect-square p-1 w-10 flex justify-center items-center" style={{ backgroundColor: color }}>
                  <Text style={{ ...font.semiBold }} className=" text-xl text-slate-50">{(item.name.slice(0, 2).toUpperCase())}</Text>
                </View>
                <View className=" flex flex-col ">
                  <Text style={{ ...font.bold }} className=" text-lg text-zinc-950">{item.name}</Text>
                  <Text style={{ ...font.regular }} className=" text-xs  text-zinc-800">{`${item.team.name} (${item.group.name})`}</Text>
                </View>
              </Link>
            </TouchableOpacity>
          )
        })}
      </TouchableOpacity>
    </View>
  )
}
