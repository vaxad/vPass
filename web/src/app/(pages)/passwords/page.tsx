import Searchbar from "@/components/Searchbar";
import PasswordSection from "./(components)/PasswordSection";
import GroupChanger from "@/components/GroupChanger";

export default async function Page() {
  return (
    <div className={` flex flex-grow h-full flex-col  text-slate-50 py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-24`}>
      {/* <Header text="Passwords"/> */}
      <section className=" flex flex-col gap-4">
        <header className=" text-2xl md:text-4xl font-semibold transition-all">Passwords:</header>
        <GroupChanger />
      </section>
      <section className=" flex flex-col-reverse md:flex-row py-2 md:gap-5 ">
        <section className=" flex flex-col w-full ">
          <section className=" py-2 md:py-6 flex flex-row gap-2">
            <Searchbar />
            {/* <Link href={'/passwords/create'} title="Add Password" className={` ${buttonDarkClassNames} text-2xl font-extrabold`}>+</Link> */}
          </section>
          <section>
            <PasswordSection />
          </section>
        </section>
        {/* <section className=" w-full md:w-1/3 py-2 md:py-6">
        <GroupSection />
      </section> */}
      </section>
    </div>
  )
}
