import {MagnifyingGlassIcon} from "@radix-ui/react-icons"

export default function Searchbar() {
  return (
    <section className={` flex w-full rounded-lg bg-slate-50  text-zinc-950 border border-slate-50 focus-within:text-slate-50 focus-within:bg-zinc-950  flex-row items-center transition-all gap-3 py-2 px-4`}>
        <MagnifyingGlassIcon className=' w-5 h-5' />
        <input type="text" name="" id="" className=' outline-none bg-transparent w-full   ' />
    </section>
  )
}
