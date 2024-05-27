"use client"
import CreateGroupDialog from '@/components/CreateGroupDialog';
import CreateTeamDialog from '@/components/CreateTeamDialog';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header'
import { apiHandler } from '@/utils/api';
import { buttonClassNames } from '@/utils/constants';
import context from '@/utils/context/context';
import { useForm } from '@/utils/hooks/useForm';
import { CreatePasswordData, DropdownItem, Group, Team } from '@/utils/types';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

export default function Page() {
    const {user} = useContext(context)

    const [teams, setTeams] = useState<Team[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [show, setShow] = useState(false)
    const [data, handleChange, changeValue] = useForm<CreatePasswordData>({name:"", password:"", groupId:"", teamId:"", public:"false", views:"0"}) 
    const router = useRouter()
    
    const createTeamBtn = useRef<HTMLButtonElement>(null)
    const createGroupBtn = useRef<HTMLButtonElement>(null)

    async function getInitialData(){
        const teamData : {success: boolean, teams: Team[]} = await apiHandler.getMyTeams();
        if(!teamData)return
        const team = teamData.teams.find((item: Team, idx: Number)=>(item.personal && item.creator.id === user?.id))
        setTeams(teamData.teams)
        changeValue({name:"teamId", value: team?team.id:teamData.teams[0].id})
        const groupData = await apiHandler.getMyGroups();
        if(!groupData)return
        setGroups(groupData.groups)
    }

    useEffect(() => {
      getInitialData()
    }, [])

    useEffect(() => {
      if(data.public==="false")
        changeValue({name:"views",value:0})
    }, [data.public])
    

    useEffect(() => {
      if(data.teamId==="")return
      const reqGrp = groups.find((val, idx)=> (val.team.id===data.teamId && val.default))
      if(!reqGrp) return
      changeValue({name:"groupId", value:reqGrp.id})
    }, [data.teamId, groups])
    
    async function handleFormSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await apiHandler.createPassword(data)
        if(!res)return
        toast(`Successfully created password for ${data.name}!`)
        router.replace("/passwords")
    }

   const teamDropDownData:DropdownItem[] = teams.map((item, idx)=>({name:item.name,value:item.id}))
    function handleTeamChange(val:string){
        changeValue({name:"teamId",value:val})
    }
    function handleTeamCreate(){
        createTeamBtn.current?.click()
    }
    const addTeamBtn: DropdownItem = {name:"Create a new Team +", value:"create", onClickFn:handleTeamCreate}

    const groupDropDownData:DropdownItem[] = groups.filter((item, idx)=>(item.team.id===(data.teamId!==""?data.teamId:teams.length>0?item.team.id===teams[0].id:""))).map((item, idx)=>({name:item.name,value:item.id}))
    function handleGroupChange(val:string){
        changeValue({name:"groupId",value:val})
    }
    function handleGroupCreate(){
        createGroupBtn.current?.click()
    }
    const addGroupBtn: DropdownItem = {name:"Create a new Group +", value:"create", onClickFn:handleGroupCreate}
    
    const visibilityOptions:DropdownItem[] = [{value:"false", name:"Private"}, {value:"true", name:"Public"}]
    const viewOptions:DropdownItem[] = [...Array(51)].map((_, id)=>id).filter((it)=>it%5===0).map((i)=>({name:i.toString(), value:i.toString()}))
 
    function handleVisibilityChange(val:string){
        changeValue({name:"public",value:val})
    }

    function handleViewChange(val:string){
        changeValue({name:"views",value:val})
    }

    function addTeam(team:Team, group:Group){
        setTeams((prev)=>[...prev, team])
        setGroups((prev)=>[...prev, group])
    }

    function addGroup(group:Group){
        setGroups((prev)=>[...prev, group])
    }

  return (
    <div className=' flex flex-col gap-6 px-6 md:px-12 lg:px-24 py-12 bg-zinc-950 text-slate-50'>
        <Header text='Create a password'/>
        <form onSubmit={handleFormSubmit} className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-3 md:p-6 rounded-md border border-slate-600 '>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="name">Name</label>
                <input autoComplete='off' required minLength={3} name='name' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='ATM PIN' value={data.name} onChange={handleChange} />
            </article>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="password">Password</label>
                <input autoComplete='off' required minLength={1} name='password'  className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type={show?"text":"password"} placeholder='49620' value={data.password} onChange={handleChange} />
                <div className=' flex flex-row gap-1  py-1 justify-start items-center'>
                    <input type="checkbox" className=' accent-black h-4 w-4' value={show?"checked":"unchecked"} onChange={(e)=>{setShow((prev)=>!prev)}} />
                    <h3 className=' text-xs'>Show password</h3>
                </div>
            </article>
            <article className=' flex flex-col md:flex-row gap-2 w-full'>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="team">Team</label>
                    {/* <select className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="teamId" id="team-select" onChange={handleChange}>
                        {teams.map((item, idx) => {
                            return  (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            )
                        })}
                    </select> */}
                    {/* <article className=' flex flex-row gap-1'>
                        <Dropdown data={[...teamDropDownData, addTeamBtn]} defaultSelectedItem={data.teamId} handleChange={handleTeamChange} />
                        <CreateTeamDialog addTeam={addTeam} btn={(<h2 title="Add Password" className={` ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</h2>)}/>
                    </article> */}
                    <Dropdown  data={[...teamDropDownData, addTeamBtn]} defaultSelectedItem={data.teamId} handleChange={handleTeamChange} />
                    <CreateTeamDialog addTeam={addTeam} btn={(<button type='button' title="Add Password" ref={createTeamBtn} className={`hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)}/>

                </section>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="group">Group</label>
                    {/* <select className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="groupId" id="group-select" onChange={handleChange}>
                        {groups.filter((item, idx)=>(item.team.id===(data.teamId!==""?data.teamId:teams.length>0?item.team.id===teams[0].id:""))).map((item, idx) => {
                                return  (
                                    <option key={item.id} value={item.id}>{item.name+` (${item.team?.name})`}</option>
                                )
                            })}
                    </select> */}
                    {/* <article className=' flex flex-row gap-1'>
                        <Dropdown data={[...groupDropDownData, addGroupBtn]} defaultSelectedItem={data.groupId} handleChange={handleGroupChange} />
                        <CreateGroupDialog addGroup={addGroup} team={data.teamId} teams={teams} btn={(<h2 title="Add Password" className={` ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</h2>)}/>
                    </article> */}
                    <Dropdown  data={[...groupDropDownData, addGroupBtn]} defaultSelectedItem={data.groupId} handleChange={handleGroupChange} />
                    <CreateGroupDialog addGroup={addGroup} team={data.teamId} teams={teams} btn={(<button type='button' title="Add Password" ref={createGroupBtn} className={` hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)}/>

                </section>
            </article>
            <article className=' flex flex-col md:flex-row gap-2 w-full'>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="team">Visibility</label>
                    {/* <select className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="public" id="public-select" onChange={handleChange}>
                        {visibilityOptions.map((item, idx) => {
                            return  (
                                <option key={idx} value={item.value}>{item.name}</option>
                            )
                        })}
                    </select> */}
                    <Dropdown data={visibilityOptions} defaultSelectedItem={data.public} handleChange={handleVisibilityChange} />
                </section>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="group">Views</label>
                    {/* <select disabled={data.public!=="true"} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="views" id="views-select" onChange={handleChange}>
                        {viewOptions.map((item, idx) => {
                                return  (
                                    <option key={idx} value={item}>{item}</option>
                                )
                            })}
                    </select> */}
                    <Dropdown disabled={data.public==="false"} data={viewOptions} defaultSelectedItem={data.views} handleChange={handleViewChange} />
                </section>
            </article>
            <button type='submit' className={` ${buttonClassNames} w-full font-semibold text-xl`}>
                Submit
            </button>
        </form>
    </div>
  )
}
