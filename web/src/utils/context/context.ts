import { Dispatch, SetStateAction, createContext } from "react";
import { User } from "../types";
type ContextType = {
    user:User | null
    setUser: Dispatch<SetStateAction<User | null>>
}
const context = createContext<ContextType>({user:null, setUser:()=>{}})

export default context