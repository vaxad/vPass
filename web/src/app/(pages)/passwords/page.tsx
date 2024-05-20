import Header from "@/components/Header";
import Searchbar from "@/components/Searchbar";
import { buttonDarkClassNames } from "@/utils/constants";
import Link from "next/link";
import PasswordSection from "./(components)/PasswordSection";

export default async function Page() {
  return (
    <div className = {` flex flex-grow h-full flex-col bg-zinc-950 text-slate-50 py-12 px-6 md:px-12 lg:px-24`}>
      <Header text="Passwords"/>
      <section className=" py-6 flex flex-row gap-2">
      <Searchbar />
      <Link href={'/passwords/create'} title="Add Password" className={` ${buttonDarkClassNames} text-2xl font-extrabold`}>+</Link>
      </section>
      <section>
        <PasswordSection/>
      </section>
    </div>
  )
}
