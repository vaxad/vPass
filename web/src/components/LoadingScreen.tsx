import Loader from './Loader'

export default function LoadingScreen() {
  return (
    <div className=' flex w-full min-h-[75vh] justify-center items-center'>
        <Loader size={200}/>
    </div>
  )
}
