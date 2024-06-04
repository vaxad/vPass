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
import { buttonClassNames, buttonDarkClassNames, generateRandomColor } from "@/utils/constants"
import { useForm } from "@/utils/hooks/useForm"
import { CreateTeamData, Group, Team, User } from "@/utils/types"
import { useContext, useEffect, useRef, useState } from "react"
import { Cross1Icon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import context from "@/utils/context/context"

const defaultButton = (<button className={`${buttonDarkClassNames}`}>Create</button>)
export default function CreateTeamDialog({ btn = defaultButton }: { btn: React.JSX.Element }) {
  const {user, setTeams, setGroups} = useContext(context)
  const [data, handleChange, changeValue] = useForm<CreateTeamData>({ name: "", members: [] })
  const [term, setTerm] = useState("")
  const [focused, setFocused] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const router = useRouter();

  function addTeam(team: Team, group: Group) {
    setTeams((prev) => [...prev, team])
    setGroups((prev) => [...prev, group])
}

  function handleDelete(id:string){
    const filteredUsers = data.members.filter((i)=>i!==id)
    changeValue({name:"members", value:filteredUsers})
  }
  async function handleSearch(term: string) {
    if (term.trim().length === 0) return
    const res = await apiHandler.searchUser({ term });
    if (!res || !res.success) return
    setUsers(res.users.filter((i:User)=>i.id!==(user?user.id:"")))
  }
  useEffect(() => {
    handleSearch(term)
  }, [term])

  useEffect(() => {
    setSelectedUsers((selectedUsers)=>{
      // const userSet = new Set([...users, ...selectedUsers])
      // console.log({userSet})
      // const userSetArray: User[] = Array.from(userSet)
      // console.log({userSetArray})
      // return userSetArray.filter((i) => data.members.includes(i.id))
      const reducedArr = [...users, ...selectedUsers].reduce((prev, curr) => {
        if (prev.some(elem => elem.id === curr.id)){
              return prev
          } else {
          return [...prev, curr]
        }
      }, [] as User[])
      return reducedArr.filter((i) => data.members.includes(i.id))
    }
  )
  }, [data.members])
  

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const res = await apiHandler.createTeam(data);
    if(!res || !res.success)return
    toast(`Created team ${data.name} with ${data.members.length} members!`)
    addTeam(res.team, res.group)
    closeRef.current?.click()
  }
  // let selectedUsers : User[] = [];
  // selectedUsers = [...users, ...selectedUsers].filter((i) => data.members.includes(i.id))
  function handleTermChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value)
    setFocused(true)
  }
  function handleUserSelect(item: User) {
    if(selectedUsers.filter((i)=>i.id===item.id).length)return setFocused(false);
    setTerm("")
    changeValue({ name: "members", value: [...data.members, item.id] })
    setFocused(false)
  }

  useEffect(() => {
    console.log(data.members)
  }, [data.members])
  

  function clearData(e:boolean){
    if(e)return
    changeValue({name:"name", value:""})
    changeValue({name:"members", value:[]})
  }
  return (
    <Dialog onOpenChange={clearData}>
      <DialogTrigger>
        {btn}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Team</DialogTitle>
          <DialogDescription>
            This will create a team with you as the creator.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className=' flex flex-col gap-2 bg-slate-50 text-zinc-950 p-3 md:p-6 rounded-md border border-slate-600 '>
          <article className=' flex flex-col gap-1 w-full'>
            <label htmlFor="name">Name</label>
            <input required minLength={3} name='name' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='Marketing Team' value={data.name} onChange={handleChange} />
          </article>
          <article className=' flex flex-col gap-1 w-full relative'>
            <label htmlFor="members">Members</label>
            <input onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} name='search-name' className=' w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all' type="text" placeholder='Search user' value={term} onChange={handleTermChange} />
            <section onMouseDown={(e) => e.preventDefault()} className={` absolute bottom-0 translate-y-full ${focused ? "flex" : "hidden"}  w-full flex-col bg-slate-50 z-20 rounded-md p-0.5`}>
              {users.map((item, idx) => {
                const color = generateRandomColor()
                return (
                  <article onFocus={() => setFocused(true)} onClick={()=>{handleUserSelect(item)}}
                   key={`search-item-${idx}`} className=" px-3 py-2 rounded-sm flex flex-row items-center gap-2 bg-transparent hover:bg-slate-200 cursor-pointer transition-all">
                    <div className=" rounded-full aspect-square p-1 w-10 flex justify-center items-center" style={{backgroundColor:color}}>
                      <h2 className=" font-semibold text-xl text-slate-50">{(item.username.slice(0,2).toUpperCase())}</h2>
                    </div>

                      <div className=" flex flex-col ">
                        <h2 className=" text-lg font-bold text-zinc-950">{item.username}</h2>
                        <p className=" text-xs  text-zinc-800">{item.email}</p>
                      </div>
                  </article>
                )
              })}
            </section>
          </article>
          <article className=" flex flex-col flex-wrap gap-1">
            {selectedUsers.map((item, idx) => {
              return (
                <div key={`selected-user-${idx}`} className=" px-3 py-2 rounded-sm bg-zinc-950 text-slate-50 flex flex-row justify-between items-center gap-1">
                  <h4>{item.email}</h4>
                  <button type="button" onClick={()=>{handleDelete(item.id)}}>
                    <Cross1Icon className=" w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </article>
          <button type='submit' className={` ${buttonClassNames} w-full font-semibold text-xl`}>
            Submit
          </button>
        </form>
      <DialogClose onClick={()=>console.log("hii")} className="hidden" ref={closeRef}></DialogClose>
      </DialogContent>
    </Dialog>
  )
}
