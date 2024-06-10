"use client"
import { useContext } from 'react'
import Dropdown from './Dropdown'
import context from '@/utils/context/context'
import { DropdownItem } from '@/utils/types'

export default function GroupChanger() {
  const { groups, setSelectedGroup, selectedGroup, selectedTeam } = useContext(context)
  const list: DropdownItem[] = [...groups.filter((j) => j.team.id === selectedTeam).map((i) => ({ name: i.name, value: i.id }))]
  console.log(selectedTeam)
  return groups.length === 0 ? (<></>) : (
    <Dropdown title='Groups' data={list} defaultSelectedItem={selectedGroup} handleChange={(val) => { setSelectedGroup(val) }} />
  )
}
