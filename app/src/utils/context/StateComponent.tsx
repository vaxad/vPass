import React, { ReactNode, useEffect, useState } from 'react'
import context from "./context"
import { Group, Password, Team, User } from '../types'
import { apiHandler } from '../api'

export default function StateComponent({children}: {children:ReactNode}) {
    const [user, setUser] = useState<User|null>(null)
    const [teams, setTeams] = useState<Team[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [selectedGroup, setSelectedGroup] = useState("")
    const [selectedTeam, setSelectedTeam] = useState("")

    async function getInitialData(){
      if(!user)return
      const teamData : {success: boolean, teams: Team[]} = await apiHandler.getMyTeams();
      if(!teamData||!teamData.success)return
      setTeams(teamData.teams)
      // const select = teamData.teams.findIndex((i)=>i.personal&&i.creator.id===user.id)
      // if(select!==-1)setSelectedTeam(teamData.teams[select].id)
      const groupData : {success: boolean, groups: Group[]} = await apiHandler.getMyGroups();
      if(!groupData)return
      setGroups(groupData.groups)
      // const grpSelect = groupData.groups.findIndex((i)=>i.team.id===teamData.teams[select].id&&i.default)
      // if(grpSelect!==-1)setSelectedGroup(groupData.groups[grpSelect].id)
    }

    function resetData(){
      setTeams([]);
      setGroups([]);
    }

    useEffect(() => {
      setSelectedGroup("")
    }, [selectedTeam])
    

    useEffect(() => {
      if(!user)return resetData()
      getInitialData()
    }, [user])
    
  return (
    <context.Provider value={{user, setUser, groups, setGroups, teams, setTeams, selectedGroup,  selectedTeam, setSelectedGroup, setSelectedTeam}}>
        {children}
    </context.Provider>
  )
}
