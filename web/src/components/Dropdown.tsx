import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownItem } from "@/utils/types"
// import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";


export default function NewDropdown({ data, defaultSelectedItem, handleChange, disabled = false, title, className = "" }: { data: DropdownItem[], defaultSelectedItem?: string, handleChange: (val: string) => void, disabled?: boolean, title?: string, className?: string }) {
    const ind = defaultSelectedItem === "" ? 0 : data.findIndex((i) => i.value === defaultSelectedItem)
    const selectedItem = data[ind === -1 ? 0 : ind]
    function handleSelect(ind: number) {
        handleChange(data[ind].value)
    }
    // console.log(data)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger disabled={disabled} className={` ${className}  w-fit flex flex-row items-center gap-2 outline-none ${disabled ? "" : ""}`}>
                <h3 className={`text-[#367AFF] font-medium text-sm w-fit ${className} px-3 py-2 rounded-sm outline-none bg-[#367AFF] bg-opacity-15 transition-all`}>{selectedItem ? selectedItem.name : "Loading your teams"}</h3>
                <div className=" flex flex-col flex-grow h-full w-fit text-[#9A9A9A] ">
                    <div className=" ">
                        {/* <IoIosArrowUp className=" w-4 h-4" /> */}
                    </div>
                    <div className=" ">
                        {/* <IoIosArrowDown className=" w-4 h-4" /> */}

                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`w-fit ${className} max-h-[40vh] overflow-y-auto !bg-black text-[#989898]`}>
                {title ? <DropdownMenuLabel className=" !text-xs !py-1 !font-extralight">{title}</DropdownMenuLabel> : <></>}
                {data.map((item, idx) => {
                    return (
                        <DropdownMenuItem className={` text-sm font-normal ${item.value === defaultSelectedItem ? "text-white" : ""} ${item.onClickFn ? " font-semibold" : ""}`} key={`dropdown-item-${idx}`} onClick={() => item.onClickFn ? item.onClickFn() : handleSelect(idx)}>{item.name}</DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
