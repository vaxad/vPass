import Link from "next/link";
import SignOutBtn from "./SignOutBtn";
import { buttonClassNames } from "@/utils/constants";
import MobileNav from "./MobileNav";
import TeamChanger from "./TeamChanger";

export default function Navbar() {

    const paths = [
        {
            path: "/",
            name: "Home"
        },
        {
            path: "/passwords",
            name: "Passwords"
        },
        {
            path: "/teams",
            name: "Teams"
        }
    ]

    return (
        <nav className=" px-6 py-2 flex flex-row justify-between gap-2 items-center border-b border-[#171717] ">
            <section className=" flex flex-row items-center gap-2">
                <img className=" w-8 h-8" src="/logo.svg" />
                <Link href={"/passwords"} className=" flex flex-row tracking-tighter text-xl bg-clip-text bg-gradient-to-b from-[#FFFFFF] to-[#999999]  text-transparent ">
                    <strong className=" font-extrabold">V</strong>pass
                </Link>
                <TeamChanger />
            </section>
            <section className=" flex flex-row gap-3 justify-center items-center w-fit">
                {/* <TeamChanger/> */}
                <SignOutBtn />
            </section>
            {/* <MobileNav paths={paths}/> */}
        </nav>
    )
}
