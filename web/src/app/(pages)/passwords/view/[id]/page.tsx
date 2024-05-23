"use client"
import AlertComponent from '@/components/AlertComponent';
import Header from '@/components/Header'
import Loader from '@/components/Loader';
import LoadingScreen from '@/components/LoadingScreen';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { decrypt } from '@/lib/cipher.utils';
import { apiHandler } from '@/utils/api';
import { buttonClassNames, buttonDarkClassNames } from '@/utils/constants';
import context from '@/utils/context/context';
import { useForm } from '@/utils/hooks/useForm';
import { CreatePasswordData, Group, Password, Team } from '@/utils/types';
import { CopyIcon, MagicWandIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

export default function Page({params}:{params:{id:string}}) {
    const {user} = useContext(context)

    const [teams, setTeams] = useState<Team[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [show, setShow] = useState(false)
    const [data, handleChange, changeValue] = useForm<CreatePasswordData>({name:"", password:"", groupId:"", teamId:"", public:"false", views:0}) 
    const [loading, setLoading] = useState<boolean>(true)
    const [editMode, setEditMode] = useState(false)
    const router = useRouter()

    async function handleDelete(){
        const res = await apiHandler.deletePassword(params.id)
        if(!res||!res.success) return
        toast("Password deleted successfully!")
        router.replace("/passwords")
    }

    async function getInitialData(){
        const passData : {success: boolean, password: Password} = await apiHandler.getPasswordById({passId:params.id})
        if(!passData||!passData.success)return
        const teamData : {success: boolean, teams: Team[]} = await apiHandler.getMyTeams();
        if(!teamData||!teamData.success)return
        setTeams(teamData.teams)
        const groupData = await apiHandler.getMyGroups();
        if(!groupData)return
        setGroups(groupData.groups)
        changeValue({name:"name", value: passData.password.name})
        changeValue({name:"teamId", value: passData.password.team.id})
        changeValue({name:"groupId", value: passData.password.group.id})
        changeValue({name:"public", value: passData.password.public?"true":"false"})
        changeValue({name:"views", value: passData.password.views})
        setLoading(false)
        const decrypted = decrypt(passData.password.encrypted, passData.password.iv)
        if(!decrypted)return toast("Password could not be decrypted!")
        changeValue({name:"password", value: decrypted})
    }

    useEffect(() => {
      getInitialData()
    }, [])

    useEffect(() => {
      if(data.teamId==="")return
      const reqGrp = groups.find((val, idx)=> (val.team.id===data.teamId && val.default))
      if(!reqGrp) return
      changeValue({name:"groupId", value:reqGrp.id})
    }, [data.teamId, groups])
    
    async function handleFormSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setEditMode(false)
        if(!editMode) return
        const res = await apiHandler.editPassword(data, params.id)
        if(!res)return
        toast(`Successfully edited password for ${data.name}!`)
    }
    
    function handleCopy(){
        navigator.clipboard.writeText(data.password)
        toast("Password copied to clipboard!")
    }

    function handlePublicLink(){
        if(data.public!=="true")return toast("Private passwords cannot have public links!")
        if(data.views===0)return toast("No public views left!")
        const url = process.env.NEXT_PUBLIC_FRONTEND_URL
        navigator.clipboard.writeText(`${url}/public/${params.id}`)
        toast(`Public link for password of "${data.name}" copied (views left: ${data.views})`)
    }
    const visibilityOptions = [{value:"false", name:"Private"}, {value:"true", name:"Public"}]
    const viewOptions = [...Array(51)].map((_, id)=>id).filter((it)=>it%5===0)
  return loading?(
    <LoadingScreen/>
  ):(
    <div className=' flex flex-col gap-6 px-6 md:px-12 lg:px-24 py-12 bg-zinc-950 text-slate-50'>
        <section className=' flex flex-col gap-2 md:flex-row w-full justify-between'>
        <Header text={`${editMode?"Edit":"View"} a password`}/>
        <section className=' flex flex-row w-full md:w-fit gap-1'>
        <button onClick={handlePublicLink} title='Get public link' className={`${buttonDarkClassNames} !p-2 !md:w-fit !w-full flex justify-center items-center`}>
            <MagicWandIcon className='w-6 h-6'/>
        </button>
        <button onClick={()=>{setEditMode((m)=>!m)}} title='Edit this password' className={`${buttonDarkClassNames} !p-2 !md:w-fit !w-full flex justify-center items-center`}>
            <Pencil1Icon className='w-6 h-6'/>
        </button>
        <AlertComponent  title='Are you sure?' description={`This will delete the password for "${data.name}"`} onAction={handleDelete} trigger={
            (
            <button title='Delete this password' className={`${buttonDarkClassNames} !p-2 !md:w-fit !w-full flex justify-center items-center`}>
                <TrashIcon className='w-6 h-6'/>
            </button>
            )
        } />
        </section>
            
        </section>
        <form onSubmit={handleFormSubmit} className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-3 md:p-6 rounded-md border border-slate-600 '>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="name">Name</label>
                <input disabled={!editMode} required minLength={3} name='name' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='ATM PIN' value={data.name} onChange={handleChange} />
            </article>
            <article className=' flex flex-col gap-1 w-full'>
                <label htmlFor="password">Password</label>
                <section className=' flex flex-row gap-1 w-full'>
                    <input disabled={!editMode} required minLength={1} name='password'  className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type={show?"text":"password"} placeholder='49620' value={data.password} onChange={handleChange} />
                    <button onClick={handleCopy} title='Copy this password' className={`${buttonClassNames} !p-2`}>
                        <CopyIcon className='w-6 h-6'/>
                    </button>
                </section>
                <div className=' flex flex-row gap-1  py-1 justify-start items-center'>
                    <input type="checkbox" className=' accent-black h-4 w-4' value={show?"checked":"unchecked"} onChange={(e)=>{setShow((prev)=>!prev)}} />
                    <h3 className=' text-xs'>Show password</h3>
                </div>
            </article>
            <article className=' flex flex-col md:flex-row gap-2 w-full'>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="team">Team</label>
                    <select disabled={!editMode} defaultValue={data.teamId} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="teamId" id="team-select" onChange={handleChange}>
                        {teams.map((item, idx) => {
                            return  (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            )
                        })}
                    </select>
                </section>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="group">Group</label>
                    <select disabled={!editMode} defaultValue={data.groupId} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="groupId" id="group-select" onChange={handleChange}>
                        {groups.filter((item, idx)=>(item.team.id===(data.teamId!==""?data.teamId:teams.length>0?item.team.id===teams[0].id:""))).map((item, idx) => {
                                return  (
                                    <option key={item.id} value={item.id}>{item.name+` (${item.team?.name})`}</option>
                                )
                            })}
                    </select>
                </section>
            </article>
            <article className=' flex flex-col md:flex-row gap-2 w-full'>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="team">Visibility</label>
                    <select disabled={!editMode} defaultValue={data.public} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="public" id="public-select" onChange={handleChange}>
                        {visibilityOptions.map((item, idx) => {
                            return  (
                                <option key={idx} value={item.value}>{item.name}</option>
                            )
                        })}
                    </select>
                </section>
                <section className=' flex flex-col gap-1 w-full'>
                    <label htmlFor="group">Views</label>
                    <select defaultValue={data.views} disabled={editMode?data.public!=="true":true} className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' name="views" id="views-select" onChange={handleChange}>
                        {!viewOptions.includes(data.views)?
                            <option value={data.views}>{data.views}</option>
                            :<></>
                        }
                        {viewOptions.map((item, idx) => {
                            return  (
                                <option key={idx} value={item}>{item}</option>
                            )
                        })}
                    </select>
                </section>
            </article>
            {editMode?<button type='submit' className={` ${buttonClassNames} w-full font-semibold text-xl flex justify-center items-center`}>
                {"Edit"}
            </button>:<></>}
        </form>
    </div>
  )
}
