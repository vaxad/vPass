"use client"
import { useContext } from 'react'
import Dropdown from './NewDropdown'
import context from '@/utils/context/context'
import { DropdownItem } from '@/utils/types'

export default function TeamChanger() {
    const {teams, setSelectedTeam, selectedTeam, user} = useContext(context)
    const list:DropdownItem[] = [...teams.map((i)=>({name:i.name, value:i.id}))]
  return !user&&teams.length===0?(<></>):(
    <section className=' px-4'>
      <Dropdown title='Teams' data={list} defaultSelectedItem={selectedTeam} handleChange={(val)=>{setSelectedTeam(val)}}/>
    </section>
  )
}
