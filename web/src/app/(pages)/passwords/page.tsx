import Searchbar from "@/components/Searchbar";
import { buttonDarkClassNames } from "@/utils/constants";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export default function Page() {
  return (
    <div className = {` flex flex-grow h-full flex-col bg-zinc-950 text-slate-50 py-12 px-6 md:px-12 lg:px-24`}>
      <section className=" flex flex-row items-center gap-6">
        <button className=" p-3 rounded-full border border-slate-50 bg-slate-50 text-zinc-950 hover:bg-zinc-950 hover:text-slate-50 transition-all active:scale-95">
          <ChevronLeftIcon className="w-5 h-5"/>
        </button>
      <header className=" text-4xl font-extrabold underline decoration-transparent hover:decoration-slate-50 transition-all">Passwords</header>
      </section>
      <section className=" py-6 flex flex-row gap-2">
      <Searchbar />
      <button title="Add Password" className={` ${buttonDarkClassNames} text-2xl font-extrabold`}>+</button>
      </section>
    </div>
  )
}
