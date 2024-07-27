"use client"
import AlertComponent from '@/components/AlertComponent';
import CreateGroupDialog from '@/components/CreateGroupDialog';
import CreateTeamDialog from '@/components/CreateTeamDialog';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header'
import Loader from '@/components/Loader';
import LoadingScreen from '@/components/LoadingScreen';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { decrypt } from '@/lib/cipher.utils';
import { apiHandler } from '@/utils/api';
import { buttonClassNames, buttonDarkClassNames, trim } from '@/utils/constants';
import context from '@/utils/context/context';
import { useForm } from '@/utils/hooks/useForm';
import { CreatePasswordData, DropdownItem, Group, Password, Team } from '@/utils/types';
import { CopyIcon, MagicWandIcon, Pencil1Icon, Share1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { MdCancel } from 'react-icons/md';
import { toast } from 'sonner';
import { BsCursorFill } from "react-icons/bs";

export default function Page({ params }: { params: { id: string } }) {
    const { user, teams, groups, setTeams, setGroups } = useContext(context)
    const [show, setShow] = useState(false)
    const [data, handleChange, changeValue] = useForm<CreatePasswordData>({ name: "", password: "", groupId: "", teamId: "", public: "false", views: "0" })
    const [ogData, setOgData] = useState<Password>()
    const [loading, setLoading] = useState<boolean>(true)
    const [editMode, setEditMode] = useState(false)
    const [passEditMode, setPassEditMode] = useState(false)
    const router = useRouter()
    const createTeamBtn = useRef<HTMLButtonElement>(null)
    const createGroupBtn = useRef<HTMLButtonElement>(null)

    async function handleDelete() {
        const res = await apiHandler.deletePassword(params.id)
        if (!res || !res.success) return
        toast("Password deleted successfully!")
        router.replace("/passwords")
    }

    useEffect(() => {

        async function getInitialData() {
            const passData: { success: boolean, password: Password } = await apiHandler.getPasswordById({ passId: params.id })
            if (!passData || !passData.success) return
            setOgData(passData.password)
            // const teamData: { success: boolean, teams: Team[] } = await apiHandler.getMyTeams();
            // if (!teamData || !teamData.success) return
            // setTeams(teamData.teams)
            // const groupData = await apiHandler.getMyGroups();
            // if (!groupData) return
            // setGroups(groupData.groups)
            changeValue({ name: "name", value: passData.password.name })
            changeValue({ name: "teamId", value: passData.password.team.id })
            changeValue({ name: "groupId", value: passData.password.group.id })
            changeValue({ name: "public", value: passData.password.public ? "true" : "false" })
            changeValue({ name: "views", value: passData.password.views.toString() })
            setLoading(false)
            const decrypted = decrypt(passData.password.encrypted, passData.password.iv)
            if (!decrypted) return toast("Password could not be decrypted!")
            changeValue({ name: "password", value: decrypted })
        }

        getInitialData()
    }, [changeValue, setLoading, params.id])

    useEffect(() => {
        if (data.teamId === "") return
        const reqGrp = groups.find((val, idx) => (val.team.id === data.teamId && val.default))
        if (!reqGrp) return
        changeValue({ name: "groupId", value: reqGrp.id })
    }, [data.teamId, groups, changeValue])

    async function handleFormSubmit() {
        // e.preventDefault();
        setEditMode(false)
        setPassEditMode(false)
        if (!editMode && !passEditMode) return
        const res = await apiHandler.editPassword(data, params.id)
        if (!res || !res.password) return
        setOgData(res.password)
        toast(`Successfully edited password for ${data.name}!`)
    }

    function handleCopy() {
        navigator.clipboard.writeText(data.password)
        toast("Password copied to clipboard!")
    }


    function handlePublicLink() {
        if (data.public !== "true") return toast("Private passwords cannot have public links!")
        if (data.views === "0") return toast("No public views left!")
        const url = process.env.NEXT_PUBLIC_FRONTEND_URL
        navigator.clipboard.writeText(`${url}/public/${params.id}`)
        toast(`Public link for password of "${data.name}" copied (views left: ${data.views})`)
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

    function discardChanges() {
        setEditMode(false)
        if (!ogData) return;
        const decrypted = decrypt(ogData.encrypted, ogData.iv)
        if (!decrypted) return
        changeValue({ name: "password", value: decrypted })
        changeValue({ name: "public", value: ogData.public ? "true" : "false" })
        changeValue({ name: "views", value: ogData.views.toString() })
        changeValue({ name: "teamId", value: ogData.team.id })
        changeValue({ name: "teamId", value: ogData.team.id })
        changeValue({ name: "groupId", value: ogData.group.id })
    }

    function handleViewChange(val: string) {
        changeValue({ name: "views", value: val })
    }

    const team = teams.find((i) => i.id === data.teamId)
    const group = groups.find((i) => i.id === data.groupId)
    const ogTeam = ogData ? teams.find((i) => i.id === ogData.team.id) : null
    const ogGroup = ogData ? groups.find((i) => i.id === ogData.group.id) : null

    return loading ? (
        <LoadingScreen />
    ) : (
        <div className=' flex flex-col justify-center items-center gap-6 px-3 md:px-12 lg:px-24 py-8 md:py-12  text-slate-50'>
            <section className='w-full md:w-[65vw] lg:w-[50vw] flex  flex-col'>
                <section className=' flex flex-col gap-2 md:flex-row justify-between'>
                    {/* <Header text={`${editMode?"Edit":"View"} a password`}/> */}
                    <section className=' flex flex-col gap-2'>
                        <section className=' flex flex-row w-full gap-2'>
                            <div className=" max-w-1 rounded-full flex flex-grow bg-[#00A3FF]"></div>
                            <header className=" text-2xl md:text-4xl font-bold transition-all">{data.name}</header>
                        </section>
                        <section className=" flex flex-row items-center py-2 md:py-4">
                            <div className={`py-1 px-3 text-sm text-nowrap shrink rounded-full font-normal bg-white bg-opacity-[17%] text-white transition-all`}>
                                <h3 className=" ">{trim(ogTeam ? ogTeam.name : "Team", 24)}</h3>
                            </div>
                            <div className=" bg-[#444444] w-6 h-0.5">
                            </div>
                            <div className={`py-1 px-3 text-sm text-nowrap shrink rounded-full font-normal bg-[#00A3FF] bg-opacity-[27%] text-[#00A3FF] transition-all`}>
                                <h3>{trim(ogGroup ? ogGroup.name : "Group", 24)}</h3>
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
                        {editMode ?
                            <button type='button' onClick={discardChanges} className=' flex flex-row gap-0.5 items-center text-[#ABABAB]'>
                                <MdCancel className=' w-3 h-3' />
                                <h4 className=' text-sm'>Discard</h4>
                            </button>
                            :
                            <button type='button' onClick={() => setEditMode((p) => !p)} className=' flex flex-row gap-0.5 items-center text-[#ABABAB]'>
                                <Pencil1Icon className=' w-3 h-3' />
                                <h4 className=' text-sm'>Edit</h4>
                            </button>}
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
                                {!editMode ?
                                    <><div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={handleCopy} className=' shadow-[0_0px_40px_10px_hsl(0,0%,0%,62%)_inset,_0_7px_12px_black] cursor-pointer w-full rounded-sm border border-[#999999] bg-gradient-to-br from-[#101010] via-[#242142] to-[#101010] text-sm md:text-lg text-nowrap py-1 px-4 text-[#999999] hover:text-white flex flex-row justify-center items-center gap-1'>
                                        {!show ? <>
                                            <BsCursorFill className=' w-3 h-3 -scale-x-100 ' />
                                            <h2 className=' hidden md:flex'>Hover to Reveal Password</h2>
                                            <h2 className=' md:hidden flex'>Tap to Reveal Password</h2>
                                        </>
                                            :
                                            <h2>{data.password}</h2>}
                                    </div>
                                        <button onClick={handleCopy} title='Copy this password' className={`${buttonClassNames} !p-2`}>
                                            <CopyIcon className='w-6 h-6' />
                                        </button>
                                    </>
                                    :
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
                        <Dropdown className='!w-full' disabled={!editMode} data={[...teamDropDownData, addTeamBtn]} defaultSelectedItem={data.teamId} handleChange={handleTeamChange} />
                        <CreateTeamDialog addTeam={addTeam} btn={(<button type='button' title="Add Password" ref={createTeamBtn} className={`hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)} />
                    </section>
                    <section className=' flex flex-col gap-1 w-full'>
                        <label htmlFor="group">Group</label>
                        <Dropdown className='!w-full' disabled={!editMode} data={[...groupDropDownData, addGroupBtn]} defaultSelectedItem={data.groupId} handleChange={handleGroupChange} />
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
                                {editMode ?
                                    <><Dropdown className='!w-full' disabled={!editMode} data={[addTeamBtn, ...teamDropDownData]} defaultSelectedItem={data.teamId} handleChange={handleTeamChange} />
                                        <CreateTeamDialog btn={(<button type='button' title="Add Password" ref={createTeamBtn} className={`hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)} /></>
                                    :
                                    <div className=' w-full rounded-sm bg-[#0E0E0E] border border-[#303030] text-lg py-1 px-4 text-[#969696]'>
                                        <h2>{trim(team ? team.name : "Team", 25)}</h2>
                                    </div>}
                            </section>
                            <section className=' flex flex-col gap-1 w-full'>
                                <label htmlFor="group" className=' text-sm font-medium'>Group</label>
                                {editMode ?
                                    <>
                                        <Dropdown className='!w-full' disabled={!editMode} data={[addGroupBtn, ...groupDropDownData]} defaultSelectedItem={data.groupId} handleChange={handleGroupChange} />
                                        <CreateGroupDialog team={data.teamId} teams={teams} btn={(<button type='button' title="Add Password" ref={createGroupBtn} className={` hidden ${buttonClassNames} text-2xl  !py-1 !px-4 !h-fit font-extrabold`}>+</button>)} />
                                    </>
                                    :
                                    <div className=' w-full rounded-sm bg-[#0E0E0E] border border-[#303030] text-lg py-1 px-4 text-[#969696]'>
                                        <h2>{trim(group ? group.name : "Group", 25)}</h2>
                                    </div>}
                            </section>

                        </article>
                        {editMode ?
                            <div className=' w-full py-5  !hidden !md:flex'>
                                <button onClick={handleFormSubmit} className={` ${buttonClassNames} w-full`}>
                                    Save
                                </button> </div> : <></>}
                    </section>
                    <section className=' w-full md:w-2/5 h-fit p-4 rounded-lg border border-[#3E3E3E] flex flex-col'>
                        <article className=' flex flex-col gap-2 w-full'>
                            <section className=' flex flex-row gap-2 items-center'>
                                <button onClick={handlePublicLink} className=' p-2 rounded-md bg-[#1E1E1E] text-[#A5A5A5]'>
                                    <Share1Icon className=' w-4 h-4' />
                                </button>
                                <h2 className=' text-white text-ls font-medium'>Sharing Options</h2>
                            </section>

                            <section className=' flex flex-col gap-1 w-full'>
                                <label htmlFor="group">Select Max Number of Views</label>

                                {editMode ? <Dropdown className='!w-full' disabled={editMode ? data.public !== "true" : true} data={viewOptions.find((i) => i.value === data.views) ? viewOptions : [...viewOptions, { name: data.views, value: data.views }]} defaultSelectedItem={data.views} handleChange={handleViewChange} />
                                    :
                                    <div className=' py-1.5 px-2 text-sm rounded-lg border-[#595959] border bg-[#1B1B1B] w-fit'>
                                        {ogData ? ogData.views : "0"}
                                    </div>}
                            </section>
                            <section className={` flex ${!editMode ? "flex-row items-center" : "flex-col"}  gap-1 w-full`}>
                                <label htmlFor="team">Visibility:</label>

                                {editMode ?
                                    <Dropdown className='!w-full' disabled={!editMode} data={visibilityOptions} defaultSelectedItem={data.public} handleChange={handleVisibilityChange} />
                                    :
                                    <div className=' py-1.5 px-2 text-xs rounded-lg border-[#595959] border bg-[#1B1B1B] w-fit'>
                                        {ogData ? ogData.public ? "Public" : "Private" : "Private"}
                                    </div>}
                            </section>
                            <section className=' w-full'>
                                <AlertComponent title='Are you sure?' description={`This will delete the password for "${data.name}"`} onAction={handleDelete} trigger={
                                    (
                                        <button title='Delete this password' className={` !px-4 !py-2 !w-full text-[#950000] rounded-sm flex-nowrap  !bg-transparent border border-[#670000] flex flex-row gap-2 hover:text-[#950000] active:scale-95 justify-center items-center`}>
                                            <TrashIcon className='w-6 h-6' />
                                            <h3 className=' text-nowrap'>Delete Permanently</h3>
                                        </button>
                                    )
                                } />
                            </section>

                        </article>
                        {/* <p className='  test p-6 '>hii</p> */}

                    </section>
                    {/* {editMode ? <button type='submit' className={` ${buttonClassNames} w-full font-semibold text-xl flex justify-center items-center`}>
                    {"Edit"}
                </button> : <></>} */}

                </div>
                {editMode ?
                    <div className=' w-full py-3 !flex !md:hidden '>
                        <button onClick={handleFormSubmit} className={` ${buttonClassNames} w-full`}>
                            Save
                        </button>
                    </div>
                    : <></>}

            </section>
        </div>
    )
}
