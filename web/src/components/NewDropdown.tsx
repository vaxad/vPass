import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { DropdownItem } from "@/utils/types"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";


export default function NewDropdown({data, defaultSelectedItem, handleChange, disabled=false, title }:{data:DropdownItem[], defaultSelectedItem?:string, handleChange:(val:string)=>void, disabled?:boolean, title?:string}) {
    const  ind = defaultSelectedItem===""?0:data.findIndex((i)=>i.value===defaultSelectedItem)
    const selectedItem = data[ind===-1?0:ind]
    function handleSelect(ind:number){
        handleChange(data[ind].value)
    }
    // console.log(data)
    return (
    <DropdownMenu>
    <DropdownMenuTrigger disabled={disabled} className={` w-fit flex text-white flex-row items-center gap-3 p-1 rounded-md outline-none bg-transparent border border-[#515151] transition-all ${disabled?"":""}`}>
        <div className=" p-1 bg-gradient-to-b from-[#181818] to-black aspect-square  w-8 h-8 flex justify-center items-center flex-grow rounded-sm text-xl font-medium bg-transparent border border-[#515151]">
            <h4 className=" text-white opacity-[36%]">{selectedItem?selectedItem.name[0].toUpperCase():"T"}</h4>
        </div>
        <h3 className=" font-medium text-sm">{selectedItem?selectedItem.name:"Loading your teams"}</h3>
        <div className=" py-0.5 px-2 rounded-full bg-[#54565c] text-white text-xs font-medium">Team</div>
        <div className=" flex flex-col flex-grow h-full w-fit bg-white bg-opacity-15 rounded-md text-[#9A9A9A] ">
            <div className=" ">
                <IoIosArrowUp className=" w-5 h-5" />
            </div>
            <div className=" ">
                <IoIosArrowDown className=" w-5 h-5" />

            </div>
        </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className=" !w-fit max-h-[40vh] overflow-y-auto !bg-black text-[#989898]">
        {title?<DropdownMenuLabel className=" !text-xs !py-1 !font-extralight">{title}</DropdownMenuLabel>:<></>}
        {data.map((item, idx)=>{
            return (
                <DropdownMenuItem className={` text-sm font-normal ${item.value===defaultSelectedItem?"text-white":""} ${item.onClickFn?" font-semibold":""}`} key={`dropdown-item-${idx}`} onClick={()=>item.onClickFn?item.onClickFn():handleSelect(idx)}>{item.name}</DropdownMenuItem>
            )
        })}
    </DropdownMenuContent>
    </DropdownMenu>

  )
}
  