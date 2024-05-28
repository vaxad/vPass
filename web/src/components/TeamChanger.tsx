"use client"
import { useContext } from 'react'
import Dropdown from './Dropdown'
import context from '@/utils/context/context'
import { DropdownItem } from '@/utils/types'

export default function TeamChanger() {
    const {teams, setSelectedTeam, selectedTeam} = useContext(context)
    const list:DropdownItem[] = [{name:"All Teams", value:""},...teams.map((i)=>({name:i.name, value:i.id}))]
  return teams.length===0?(<></>):(
    <Dropdown data={list} defaultSelectedItem={selectedTeam} handleChange={(val)=>{setSelectedTeam(val)}}/>
  )
}
