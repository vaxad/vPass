"use client"
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

export default function Header({text}:{text:string}) {
    const router = useRouter()
    function handleBack(){
        router.back()
    }

  return (
    <section className=" flex flex-row items-center gap-6">
        <button onClick={handleBack} className=" p-3 rounded-full border border-slate-50 bg-slate-50 text-zinc-950 hover:bg-zinc-950 hover:text-slate-50 transition-all active:scale-95">
          <ChevronLeftIcon className="w-5 h-5"/>
        </button>
      <header className=" text-4xl font-extrabold transition-all">{text}</header>
      </section>
  )
}
