import { Dispatch, SetStateAction, createContext } from "react";
import { Group, Team, User } from "../types";
type ContextType = {
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>,
    groups: Group[],
    setGroups: Dispatch<SetStateAction<Group[]>>,
    teams: Team[],
    setTeams: Dispatch<SetStateAction<Team[]>>,
    selectedTeam: string,
    setSelectedTeam: Dispatch<SetStateAction<string>>,
    selectedGroup: string,
    setSelectedGroup: Dispatch<SetStateAction<string>>,
    toasts: string[],
    setToasts: Dispatch<SetStateAction<string[]>>,
    toast: (text:string)=>void
}
const context = createContext<ContextType>({ user: null, setUser: () => { }, teams: [], setTeams: () => { }, groups: [], setGroups: () => { }, selectedGroup: "", setSelectedGroup: () => { }, selectedTeam: "", setSelectedTeam: () => { }, toasts:[], setToasts: () => {}, toast: (text:string) => {} })

export default context