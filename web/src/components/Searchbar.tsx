"use client"
import { apiHandler } from "@/utils/api"
import { generateRandomColor } from "@/utils/constants"
import { Password } from "@/utils/types"
import {MagnifyingGlassIcon} from "@radix-ui/react-icons"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Password[]>([])
  async function getSuggestions(searchTerm : string) {
    const res = await apiHandler.searchPasswords({searchTerm})
    if(!res||!res.success)return
    console.log(res)
    setSuggestions(res.passwords)
  }
  useEffect(() => {
    if(searchTerm.trim().length===0)return setSuggestions((p)=>[])
    getSuggestions(searchTerm)
  }, [searchTerm])
  
  return (
    <section className={` relative flex w-full md:w-[40vh] border border-[#494949] bg-black text-white rounded-lg flex-row items-center transition-all gap-3 py-2 px-4`}>
        <input onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Passwords" type="text" name="" id="" className=' outline-none bg-transparent w-full  placeholder:text-[#4D4D4D] placeholder:italic  ' />
        <MagnifyingGlassIcon className=' w-5 h-5 text-[#7D7D7D]' />
        <section onMouseDown={(e) => e.preventDefault()} className={` absolute bottom-0 translate-y-full ${focused&&suggestions.length ? "flex" : "hidden"}  w-full flex-col bg-slate-50 z-20 rounded-md p-0.5`}>
              {suggestions.map((item, idx) => {
                const color = generateRandomColor()
                return (
                  <Link href={`/passwords/view/${item.id}`} onFocus={() => setFocused(true)}
                   key={`search-password-${idx}`} className=" px-3 py-2 rounded-sm flex flex-row items-center gap-2 bg-transparent hover:bg-slate-200 cursor-pointer transition-all">
                    <div className=" rounded-full aspect-square p-1 w-10 flex justify-center items-center" style={{backgroundColor:color}}>
                      <h2 className=" font-semibold text-xl text-slate-50">{(item.name.slice(0,2).toUpperCase())}</h2>
                    </div>
                      <div className=" flex flex-col ">
                        <h2 className=" text-lg font-bold text-zinc-950">{item.name}</h2>
                        <p className=" text-xs  text-zinc-800">{`${item.team.name} (${item.group.name})`}</p>
                      </div>
                  </Link>
                )
              })}
            </section>
    </section>
  )
}
