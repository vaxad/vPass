"use client"

import Dropdown from "@/components/Dropdown"
import TeamChanger from "@/components/TeamChanger"
import context from "@/utils/context/context"
import { useContext } from "react"

export default function GroupSection() {
    const {groups, selectedGroup, setSelectedGroup, selectedTeam} = useContext(context)
    const allGroup = {name:"All", id:"", team: { id: ""} }
    const groupsToShow = [allGroup,...groups.filter((i)=>i.team.id===selectedTeam)]
  return (
    <>
    <section className=" hidden md:flex flex-col bg-slate-50 text-zinc-950 w-full rounded-lg px-4 py-4">
        <header className="text-xl md:text-2xl font-extrabold transition-all ">Groups</header>
        <section className=" flex flex-col gap-2 pt-5">
            {groupsToShow.map((item, idx) => {
                return (
                    <button onClick={()=>{setSelectedGroup(item.id)}} key={`group-${idx}`} className={`group py-3 px-4 rounded-lg border border-zinc-950 ${selectedGroup===item.id?"bg-slate-50 text-zinc-950 ":"bg-zinc-950 text-slate-50"} text-left hover:bg-slate-50 hover:text-zinc-950 active:scale-95 transition-all`}>
                        <h2 className=" text-lg font-bold group-hover:translate-x-4 group-hover:scale-105 transition-all">{item.name}</h2>
                    </button>
                )
            })}
        </section>
      </section>
      <section className=" md:hidden flex flex-row gap-1 w-full p-1 bg-slate-50 rounded-md ">
        <TeamChanger/>
        <Dropdown data={groupsToShow.map((i)=>({name:i.name, value:i.id}))} handleChange={(v)=>setSelectedGroup(v)} defaultSelectedItem={selectedGroup} />
      </section>
      </>
  )
}
