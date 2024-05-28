import Link from "next/link";
import SignOutBtn from "./SignOutBtn";
import { buttonClassNames } from "@/utils/constants";
import MobileNav from "./MobileNav";
import TeamChanger from "./TeamChanger";

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
    <nav className=" px-6 py-4 flex flex-row justify-between gap-2 items-center bg-slate-50 text-zinc-950">
        <Link href={"/passwords"} className=" text-3xl font-extrabold tracking-tighter">
            vPass
        </Link>
        <section className=" md:flex flex-row gap-3 justify-center items-center w-fit hidden">            
            {/* {paths.map((item, idx)=><Link key={`link-${idx}`} className={`${buttonClassNames}`} href={item.path}>{item.name}</Link>)} */}
            <TeamChanger/>
            <SignOutBtn/>
        </section>
        <MobileNav paths={paths}/>
    </nav>
  )
}
