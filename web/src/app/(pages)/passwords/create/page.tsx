"use client"
import CreateGroupDialog from '@/components/CreateGroupDialog';
import CreateTeamDialog from '@/components/CreateTeamDialog';
import Dropdown from '@/components/Dropdown';
import { apiHandler } from '@/utils/api';
import { buttonClassNames, trim } from '@/utils/constants';
import context from '@/utils/context/context';
import { useForm } from '@/utils/hooks/useForm';
import { CreatePasswordData, DropdownItem, Group, Team } from '@/utils/types';
import { Share1Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

export default function Page() {
    const { user, teams, groups, setTeams, setGroups, selectedTeam } = useContext(context)
    const [show, setShow] = useState(false)
    const [data, handleChange, changeValue] = useForm<CreatePasswordData>({ name: "", password: "", groupId: "", teamId: "", public: "false", views: "0" })
    const router = useRouter()

    const createTeamBtn = useRef<HTMLButtonElement>(null)
    const createGroupBtn = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        async function getInitialData() {
            changeValue({ name: "teamId", value: selectedTeam })
        }
        getInitialData()
    }, [changeValue, selectedTeam])

    useEffect(() => {
        if (data.public === "false")
            changeValue({ name: "views", value: 0 })
    }, [data.public, changeValue])


    useEffect(() => {
        if (data.teamId === "") return
        const reqGrp = groups.find((val, idx) => (val.team.id === data.teamId && val.default))
        if (!reqGrp) return
        changeValue({ name: "groupId", value: reqGrp.id })
    }, [data.teamId, groups, changeValue])

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await apiHandler.createPassword(data)
        if (!res) return
        toast(`Successfully created password for ${data.name}!`)
        router.replace("/passwords")
    }

    const teamDropDownData: DropdownItem[] = teams.map((item, idx) => ({ name: item.name, value: item.id }))
    function handleTeamChange(val: string) {
        changeValue({ name: "teamId", value: val })
    }
    function handleTeamCreate() {
        createTeamBtn.current?.click()
    }
    const addTeamBtn: DropdownItem = { name: "Create a new Team +", value: "create", onClickFn: handleTeamCreate }

    const groupDropDownData: DropdownItem[] = groups.filter((item, idx) => (item.team.id === (data.teamId !== "" ? data.teamId : teams.length > 0 ? item.team.id === teams[0].id : ""))).map((item, idx) => ({ name: item.name, value: item.id }))
    function handleGroupChange(val: string) {
        changeValue({ name: "groupId", value: val })
    }
    function handleGroupCreate() {
        createGroupBtn.current?.click()
    }
    const addGroupBtn: DropdownItem = { name: "Create a new Group +", value: "create", onClickFn: handleGroupCreate }

    const visibilityOptions: DropdownItem[] = [{ value: "false", name: "Private" }, { value: "true", name: "Public" }]
    const viewOptions: DropdownItem[] = [...Array(51)].map((_, id) => id).filter((it) => it % 5 === 0).map((i) => ({ name: i.toString(), value: i.toString() }))

    function handleVisibilityChange(val: string) {
        changeValue({ name: "public", value: val })
    }

    function handleViewChange(val: string) {
        changeValue({ name: "views", value: val })
    }

    function addTeam(team: Team, group: Group) {
        setTeams((prev) => [...prev, team])
        setGroups((prev) => [...prev, group])
    }

    function addGroup(group: Group) {
        setGroups((prev) => [...prev, group])
    }

    const team = teams.find((i) => i.id === data.teamId)
    const group = groups.find((i) => i.id === data.groupId)

    return (
        <div className=' flex flex-col justify-center items-center gap-6 px-3 md:px-12 lg:px-24 py-8 md:py-12  text-slate-50'>
            <form onSubmit={handleFormSubmit} className='w-full md:w-[65vw] lg:w-[50vw] flex  flex-col'>
                <section className=' flex flex-col gap-2 md:flex-row justify-between'>
                    {/* <Header text={`${editMode?"Edit":"View"} a password`}/> */}
                    <section className=' flex flex-col gap-2'>
                        <section className=' flex  items-center flex-row w-full gap-2'>
                            <div className=" min-w-1 max-w-1 min-h-8 h-full rounded-full flex flex-grow bg-[#00A3FF]"></div>
                            <input autoComplete="billing new-password webauthn" required value={data.name} placeholder='ATM pin' name='name' onChange={handleChange} className=" text-2xl outline-none bg-transparent underline decoration-[#00A3FF] md:text-4xl font-bold transition-all" />
                        </section>
                        <section className=" flex flex-row items-center py-2 md:py-4">
                            <div className={`py-1 px-3 text-sm text-nowrap shrink rounded-full font-normal bg-white bg-opacity-[17%] text-white transition-all`}>
                                <h3 className=" ">{trim(team ? team.name : "Team", 24)}</h3>
                            </div>
                            <div className=" bg-[#444444] w-6 h-0.5">
                            </div>
                            <div className={`py-1 px-3 text-sm text-nowrap shrink rounded-full font-normal bg-[#00A3FF] bg-opacity-[27%] text-[#00A3FF] transition-all`}>
                                <h3>{trim(group ? group.name : "Group", 24)}</h3>
                            </div>
                        </section>
                    </section>

                    <section className=' flex flex-row items-center justify-end h-fit w-full  md:w-fit gap-1 p-2 md:p-6'>
                        {/* <button onClick={handlePublicLink} title='Get public link' className={`${buttonDarkClassNames} !p-2 !md:w-fit !w-full flex justify-center items-center`}>
                    <MagicWandIcon className='w-6 h-6' />
                </button>
                <button onClick={() => { setEditMode((m) => !m) }} title='Edit this password' className={`${buttonDarkClassNames} !p-2 !md:w-fit !w-full flex justify-center items-center`}>
                    <Pencil1Icon className='w-6 h-6' />
                </button>
                <AlertComponent title='Are you sure?' description={`This will delete the password for "${data.name}"`} onAction={handleDelete} trigger={
                    (
                        <button title='Delete this password' className={`${buttonDarkClassNames} !p-2 !md:w-fit !w-full flex justify-center items-center`}>
                            <TrashIcon className='w-6 h-6' />
                        </button>
                    )
                } /> */}
                    </section>

                </section>
                <div className=' flex flex-col md:flex-row gap-5  p-3 md:p-6 rounded-md  w-full'>
                    <section className=' w-full md:w-3/5 flex flex-col'>
                        <article className=' flex flex-col gap-1 w-full pb-5'>
                            {/* <div className=' flex w-full flex-row items-center justify-between'>
                        <label className=' text-sm font-medium' htmlFor="password">Password</label>
                        {passEditMode ?
                            <button type='button' onClick={discardPasswordChanges} className=' flex flex-row gap-0.5 items-center text-[#ABABAB]'>
                                <MdCancel className=' w-3 h-3' />
                                <h4 className=' text-sm'>Discard</h4>
                            </button>
                            :
                            <button type='button' onClick={() => setPassEditMode((p) => !p)} className=' flex flex-row gap-0.5 items-center text-[#ABABAB]'>
                                <Pencil1Icon className=' w-3 h-3' />
                                <h4 className=' text-sm'>Edit</h4>
                            </button>}
                    </div> */}
                            <section className=' flex flex-row gap-1 w-full'>
                                {
                                    <div className='flex flex-col gap-1 w-full'>
                                        <input required minLength={1} name='password' className='w-full rounded-sm bg-[#0E0E0E] border border-[#303030] text-lg py-1 px-4 placeholder:text-[#969696] text-white' type={show ? "text" : "password"} placeholder='49620' value={data.password} onChange={handleChange} />
                                        <div className=' flex flex-row gap-1  py-1 justify-start items-center'>
                                            <input type="checkbox" className=' accent-black h-4 w-4' value={show ? "checked" : "unchecked"} onChange={(e) => { setShow((prev) => !prev) }} />
                                            <h3 className=' text-xs'>Show password</h3>
                                        </div>
                                    </div>

                                }

                            </section>

                        </article>
                        {/* <article className=' flex flex-col  gap-2 w-full'>
            <section className=' flex flex-col gap-1 w-full'>
                <label htmlFor="team">Team</label>
                <Dropdown className='!w-full' data={[...teamDropDownData, addTeamBtn]} defaultSelectedItem={data.teamId} handleChange={handleTeamChange} />
                <CreateTeamDialog addTeam={addTeam} btn={(<button type='button' title="Add Password" ref={createTeamBtn} className={`hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)} />
            </section>
            <section className=' flex flex-col gap-1 w-full'>
                <label htmlFor="group">Group</label>
                <Dropdown className='!w-full' data={[...groupDropDownData, addGroupBtn]} defaultSelectedItem={data.groupId} handleChange={handleGroupChange} />
                <CreateGroupDialog addGroup={addGroup} team={data.teamId} teams={teams} btn={(<button type='button' title="Add Password" ref={createGroupBtn} className={` hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)} />
            </section>
        </article> */}
                        <article className=' flex flex-col gap-2 w-full p-4 rounded-lg bg-transparent border border-[#3E3E3E]'>
                            <section className=' flex flex-col gap-1 w-full'>
                                <div className=' flex w-full flex-row items-center justify-between'>
                                    <label htmlFor="team" className=' text-sm font-medium'>Team</label>
                                    {/* {editMode ?
                                <button type='button' onClick={discardTeamGroupChanges} className=' flex flex-row gap-0.5 items-center text-[#ABABAB]'>
                                    <MdCancel className=' w-3 h-3' />
                                    <h4 className=' text-sm'>Discard</h4>
                                </button>
                                :
                                <button type='button' onClick={() => setEditMode((p) => !p)} className=' flex flex-row gap-0.5 items-center text-[#ABABAB]'>
                                    <Pencil1Icon className=' w-3 h-3' />
                                    <h4 className=' text-sm'>Edit</h4>
                                </button>} */}
                                </div>
                                {
                                    <><Dropdown className='!w-full' data={[addTeamBtn, ...teamDropDownData]} defaultSelectedItem={data.teamId} handleChange={handleTeamChange} />
                                        <CreateTeamDialog btn={(<button type='button' title="Add Password" ref={createTeamBtn} className={`hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)} /></>
                                }
                            </section>
                            <section className=' flex flex-col gap-1 w-full'>
                                <label htmlFor="group" className=' text-sm font-medium'>Group</label>
                                {
                                    <>
                                        <Dropdown className='!w-full' data={[addGroupBtn, ...groupDropDownData]} defaultSelectedItem={data.groupId} handleChange={handleGroupChange} />
                                        <CreateGroupDialog team={data.teamId} teams={teams} btn={(<button type='button' title="Add Password" ref={createGroupBtn} className={` hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)} />
                                    </>
                                }
                            </section>

                        </article>
                        <div className=' w-full py-5 md:flex hidden'>
                            <button type='submit' className={` ${buttonClassNames} w-full`}>
                                Create
                            </button>
                        </div>
                    </section>
                    <section className=' w-full md:w-2/5 h-fit p-4 rounded-lg border border-[#3E3E3E] flex flex-col'>
                        <article className=' flex flex-col gap-2 w-full'>
                            <section className=' flex flex-row gap-2 items-center'>
                                <div className=' p-2 rounded-md bg-[#1E1E1E] text-[#A5A5A5]'>
                                    <Share1Icon className=' w-4 h-4' />
                                </div>
                                <h2 className=' text-white text-ls font-medium'>Sharing Options</h2>
                            </section>

                            <section className=' flex flex-col gap-1 w-full'>
                                <label htmlFor="group">Select Max Number of Views</label>

                                {<Dropdown className='!w-full' disabled={data.public !== "true"} data={viewOptions.find((i) => i.value === data.views) ? viewOptions : [...viewOptions, { name: data.views, value: data.views }]} defaultSelectedItem={data.views} handleChange={handleViewChange} />
                                }
                            </section>
                            <section className={` flex ${false ? "flex-row items-center" : "flex-col"}  gap-1 w-full`}>
                                <label htmlFor="team">Visibility:</label>

                                {
                                    <Dropdown className='!w-full' data={visibilityOptions} defaultSelectedItem={data.public} handleChange={handleVisibilityChange} />
                                }
                            </section>
                            {/* <section className=' w-full'>
                        <AlertComponent title='Are you sure?' description={`This will delete the password for "${data.name}"`} onAction={handleDelete} trigger={
                            (
                                <button title='Delete this password' className={` !px-4 !py-2 !w-full text-[#950000] rounded-sm flex-nowrap  !bg-transparent border border-[#670000] flex flex-row gap-2 hover:text-[#950000] active:scale-95 justify-center items-center`}>
                                    <TrashIcon className='w-6 h-6' />
                                    <h3 className=' text-nowrap'>Delete Permanently</h3>
                                </button>
                            )
                        } />
                    </section> */}
                        </article>
                        {/* <p className='  test p-6 '>hii</p> */}
                    </section>
                    <div className=' w-full py-5 md:hidden flex'>
                        <button type='submit' className={` ${buttonClassNames} w-full`}>
                            Create
                        </button>
                    </div>

                </div>

            </form>
        </div>
    )
}
