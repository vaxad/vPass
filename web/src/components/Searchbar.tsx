import {MagnifyingGlassIcon} from "@radix-ui/react-icons"

export default function Searchbar() {
  return (
    <section className={` flex w-full md:w-[40vh] border border-[#494949] bg-black text-white rounded-lg flex-row items-center transition-all gap-3 py-2 px-4`}>
        <input placeholder="Search Passwords" type="text" name="" id="" className=' outline-none bg-transparent w-full  placeholder:text-[#4D4D4D] placeholder:italic  ' />
        <MagnifyingGlassIcon className=' w-5 h-5' />
    </section>
  )
}
