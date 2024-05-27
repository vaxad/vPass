import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { DropdownItem } from "@/utils/types"


export default function Dropdown({data, defaultSelectedItem, handleChange, disabled=false }:{data:DropdownItem[], defaultSelectedItem?:string, handleChange:(val:string)=>void, disabled?:boolean}) {
    const  ind = defaultSelectedItem===""?0:data.findIndex((i)=>i.value===defaultSelectedItem)
    const selectedItem = data[ind===-1?0:ind]
    function handleSelect(ind:number){
        handleChange(data[ind].value)
    }
    console.log(data)
    return (
    <DropdownMenu>
    <DropdownMenuTrigger disabled={disabled} className={`w-full px-4 py-2 rounded-md outline-none text-slate-50 bg-zinc-950 focus:bg-slate-50 focus:text-zinc-950 border border-zinc-950 transition-all ${disabled?"":""}`}>
        {selectedItem?selectedItem.name:"Loading your teams"}
    </DropdownMenuTrigger>
    <DropdownMenuContent className=" !w-full max-h-[40vh] overflow-y-auto">
        {data.map((item, idx)=>{
            return (
                <DropdownMenuItem className={` ${item.onClickFn?" font-semibold":""}`} key={`dropdown-item-${idx}`} onClick={()=>item.onClickFn?item.onClickFn():handleSelect(idx)}>{item.name}</DropdownMenuItem>
            )
        })}
    </DropdownMenuContent>
    </DropdownMenu>

  )
}
  