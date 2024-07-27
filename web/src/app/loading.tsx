import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <main className=" min-h-screen w-full flex justify-center items-center p-6">
      <Loader size={300} />
    </main>
  )
}
