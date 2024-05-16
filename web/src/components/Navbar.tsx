import Link from "next/link";
import SignOutBtn from "./SignOutBtn";

export default function Navbar() {

    const paths = [
        {
            path:"/",
            name:"Home"
        },
        {
            path:"/passwords",
            name:"Passwords"
        },
        {
            path:"/teams",
            name:"Teams"
        }
    ]

  return (
    <nav className=" px-6 py-4 flex flex-row justify-between gap-2 items-center bg-slate-50 text-zinc-950 ">
        <header className=" text-3xl font-extrabold tracking-tighter">
            vPass
        </header>
        <section className=" flex flex-row gap-3 justify-center items-center w-fit">
            {paths.map((item, idx)=><Link key={`link-${idx}`} className=" py-2 px-4 rounded-lg bg-zinc-950 text-slate-50 border border-zinc-950 hover:bg-slate-50 hover:text-zinc-950 transition-all font-semibold active:scale-90" href={item.path}>{item.name}</Link>)}
            <SignOutBtn/>
        </section>

    </nav>
  )
}
