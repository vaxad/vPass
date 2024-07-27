"use client"

import Loader from "@/components/Loader"
import { apiHandler } from "@/utils/api"
import { buttonClassNames, trim } from "@/utils/constants"
import context from "@/utils/context/context"
import { Password } from "@/utils/types"
import { ArrowTopRightIcon, Pencil1Icon, PlusIcon, Share1Icon, Share2Icon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

const PasswordCard = ({ item }: { item: Password }) => {
    const [hover, setHover] = useState(false);
    function handlePublicLink() {
        if (item.public !== true) return toast("Private passwords cannot have public links!")
        if (item.views === 0) return toast("No public views left!")
        const url = process.env.NEXT_PUBLIC_FRONTEND_URL
        navigator.clipboard.writeText(`${url}/public/${item.id}`)
        toast(`Public link for password of "${item.name}" copied (views left: ${item.views})`)
    }

    return (
        <article onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ backgroundImage: "linear-gradient(180deg, transparent 9%, hsl(0,0%,49%,7%) 100%)" }} className={` flex flex-col flex-grow md:flex-row w-full h-full justify-between items-start  rounded-lg p-5 border border-[#1F1F1F] hover:border-[#001B7B] transition-all hover:shadow-[0_9px_27px_0px_hsl(0,0,0,100%)]`} >
            <section className=" flex flex-col h-full gap-1">
                <h2 className=" font-bold  text-3xl bg-clip-text bg-gradient-to-b from-[#FFFFFF] to-[hsl(0,0%,100%,42%)]  text-transparent  ">{item.name}</h2>
                {/* <h4>Created: {(new Date(item.createdAt)).toLocaleString()}</h4> */}
                <section className=" flex flex-row items-center py-4">
                    <div className={`py-1 px-3 text-sm text-nowrap shrink rounded-full font-normal bg-white bg-opacity-[17%] text-white  ${hover ? "" : ""} transition-all`}>
                        <h3 className=" opacity-50">{trim(item.team.name, 24)}</h3>
                    </div>
                    <div className=" bg-[#444444] w-6 h-0.5">

                    </div>
                    <div className={`py-1 px-3 text-sm text-nowrap shrink rounded-full font-normal bg-[#00A3FF] bg-opacity-[27%] text-[#00A3FF]  ${hover ? "" : ""} transition-all`}>
                        <h3>{trim(item.group.name, 24)}</h3>
                    </div>
                </section>
                <h4 className=" text-[#696969] text-xs">Created at: {(new Date(item.createdAt)).toLocaleString()}</h4>
            </section>
            <div className="flex flex-row md:flex-col min-h-fit md:min-h-full w-full pt-4 md:pt-0 md:w-fit gap-1 justify-between">
                <button onClick={handlePublicLink} className={` w-fit p-2 self-end flex justify-center items-center aspect-square rounded-lg bg-[#1E1E1E] text-[#A5A5A5] `}>
                    <Share1Icon className=" w-4 h-4" />
                </button>
                <Link href={`/passwords/view/${item.id}`} className={`bg-[#06EAF9] bg-opacity-15 rounded-full text-white flex flex-row gap-2 h-fit justify-center items-center w-fit py-1 px-3`}>
                    <h4 className=" text-sm text-nowrap">View Password</h4>
                    <ArrowTopRightIcon className=" w-4 h-4" />
                </Link>
            </div>
        </article>
    )
}

export default function PasswordSection() {
    const [passwords, setPasswords] = useState<Password[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { selectedGroup, selectedTeam } = useContext(context)


    useEffect(() => {
        async function getInitialData() {
            setLoading(true)
            const res = await apiHandler.getPasswordsGeneral({ groupId: selectedGroup, teamId: selectedTeam })
            if (!res || !res.success) return
            setPasswords(res.passwords)
            setLoading(false)
        }
        getInitialData()
    }, [selectedGroup, selectedTeam, setPasswords, setLoading])

    return loading ? (
        <Loader size={200} />
    ) : (
        <section className=" gap-4 py-3 grid grid-cols-1 md:grid-cols-2  w-full">
            <Link href={"/passwords/create"} style={{ backgroundImage: "linear-gradient(180deg, transparent 9%, hsl(0,0%,49%,7%) 100%)" }} className=" cursor-pointer active:scale-95 py-8 w-full h-full hover:shadow-[0_9px_27px_0px_hsl(0,0,0,100%)] rounded-lg border border-[#4B4B4B] text-[#4B4B4B] hover:text-[#001B7B] hover:border-[#001B7B] transition-all flex justify-center items-center flex-col">
                <PlusIcon className=" w-8 h-8" />
                <h2 className=" font-medium">Create New</h2>
            </Link>
            {passwords.map((item, idx) => {
                return (
                    <PasswordCard key={`${idx}-password-card`} item={item} />
                )
            })}
        </section>
    )
}
