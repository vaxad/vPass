import {create} from 'zustand';
import { Toast } from '../types';

type StoredToast = Toast | string

type StoreState = {
    toasts: Toast[],
    setToasts: (item:StoredToast[])=>void,
    toast: (text:StoredToast)=>void
};
function getDefaultToast(text:string):Toast{
    return {
        message:text,
        type:"NORMAL"
    }
}
const useStore = create<StoreState>((set) => ({
    toasts: [],
    setToasts: (item:StoredToast[]) => set(() => ({ toasts: item.map((i)=>typeof(i)==="string"?getDefaultToast(i):i) })),
    toast: (item:StoredToast) => set((state) => ({ toasts: [...state.toasts, (typeof(item)==="string"?getDefaultToast(item):item)] })),
}));

export default useStore;