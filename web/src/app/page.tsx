import { buttonDarkClassNames } from "@/utils/constants";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full flex-grow w-full flex-col gap-2 items-center justify-center p-24  text-slate-50">
      <h1 data-test="landing-header" className="text-center text-3xl md:text-6xl font-extrabold">vPass/Passify</h1>
      <p className=" text-center">A password manager for all</p>
      <div className=" flex flex-col md:flex-row justify-center items-center gap-4 py-6">
        <a href="https://github.com/vaxad/vPass" target="_blank" className={` ${buttonDarkClassNames} text-center`}>Go to Repo</a>
        <Link href={'/auth'} className={` ${buttonDarkClassNames} text-center `} >Get Started</Link>
      </div>
    </main>
  );
}
