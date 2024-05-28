import Header from "@/components/Header";
import Searchbar from "@/components/Searchbar";
import { buttonDarkClassNames } from "@/utils/constants";
import Link from "next/link";
import PasswordSection from "./(components)/PasswordSection";
import GroupSection from "./(components)/GroupSection";

export default async function Page() {
  return (
    <div className = {` flex flex-grow h-full flex-col bg-zinc-950 text-slate-50 py-12 px-6 md:px-12 lg:px-24`}>
      <Header text="Passwords"/>
      <section className=" flex flex-col-reverse md:flex-row py-2 md:gap-5 ">
      <section className=" flex flex-col w-full ">
        <section className=" py-2 md:py-6 flex flex-row gap-2">
        <Searchbar />
        <Link href={'/passwords/create'} title="Add Password" className={` ${buttonDarkClassNames} text-2xl font-extrabold`}>+</Link>
        </section>
        <section>
          <PasswordSection/>
        </section>
      </section>
      <section className=" w-full md:w-1/3 py-2 md:py-6">
        <GroupSection />
      </section>
      </section>
    </div>
  )
}
