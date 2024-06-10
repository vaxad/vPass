"use client"
import { useContext } from 'react'
import Dropdown from './NewDropdown'
import context from '@/utils/context/context'
import { DropdownItem } from '@/utils/types'
import { View } from 'react-native-animatable'

export default function TeamChanger() {
  const { teams, setSelectedTeam, selectedTeam, user } = useContext(context)
  const list: DropdownItem[] = [...teams.map((i) => ({ name: i.name, value: i.id }))]
  return !user && teams.length === 0 ? (<></>) : (
    <View className=' px-4 w-fit flex flex-row justify-end items-end' style={{ zIndex: 1000 }}>
      <Dropdown title='Teams' data={list} defaultSelectedItem={selectedTeam} handleChange={(val) => { setSelectedTeam(val) }} />
    </View>
  )
}
