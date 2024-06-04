import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { apiHandler } from "@/utils/api"
import { buttonClassNames, buttonDarkClassNames } from "@/utils/constants"
import { useForm } from "@/utils/hooks/useForm"
import { CreateGroupData, CreateTeamData, Group, Team, User } from "@/utils/types"
import { useContext, useEffect, useRef, useState } from "react"
import { Cross1Icon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import context from "@/utils/context/context"
import Dropdown from "./Dropdown"

const defaultButton = (<button className={`${buttonDarkClassNames}`}>Create</button>)
export default function CreateGroupDialog({ btn = defaultButton, team, teams }: { btn: React.JSX.Element, team:string, teams:Team[] }) {
  const {user, setGroups} = useContext(context)
  const [data, handleChange, changeValue] = useForm<CreateGroupData>({ name: "", teamId:team })
  const [term, setTerm] = useState("")
  const [focused, setFocused] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const router = useRouter();
  async function handleSearch(term: string) {
    if (term.trim().length === 0) return
    const res = await apiHandler.searchUser({ term });
    if (!res || !res.success) return
    setUsers(res.users.filter((i:User)=>i.id!==(user?user.id:"")))
  }
  useEffect(() => {
    handleSearch(term)
  }, [term])

  function addGroup(group: Group) {
    setGroups((prev) => [...prev, group])
}
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const res = await apiHandler.createGroup(data);
    if(!res || !res.success)return
    toast(`Created group ${data.name}!`)
    addGroup(res.group)
    closeRef.current?.click()
  }
  function clearData(e:boolean){
    if(e)return
    changeValue({name:"name", value:""})
    changeValue({name:"teamId", value:""})
  }
  return (
    <Dialog onOpenChange={clearData}>
      <DialogTrigger>
        {btn}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Group</DialogTitle>
          <DialogDescription>
            This will create a group within your selected group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-3 md:p-6 rounded-md border border-slate-600 '>
          <article className=' flex flex-col gap-1 w-full'>
            <label htmlFor="name">Name</label>
            <input required minLength={3} name='name' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='AWS Credentials' value={data.name} onChange={handleChange} />
          </article>
          <article className=' flex flex-col gap-1 w-full relative'>
            <label htmlFor="team">Team</label>
            <Dropdown data={teams.map((i)=>({name:i.name, value:i.id}))} defaultSelectedItem={data.teamId} handleChange={(val)=>changeValue({name:"teamId", value:val})}/>
          </article>
          <button type='submit' className={` ${buttonClassNames} w-full font-semibold text-xl`}>
            Submit
          </button>
        </form>
      <DialogClose className="hidden" ref={closeRef}></DialogClose>
      </DialogContent>
    </Dialog>
  )
}
