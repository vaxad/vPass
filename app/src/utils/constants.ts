
// styles

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import context from "./context/context";
import useStore from "./zustand/store";

export const buttonClassNames = " py-2 px-4 rounded-md text-xl font-semibold text-white border border-[#3A3A3A] active:scale-95 transition-all"

export const buttonDarkClassNames = " py-2 px-4 rounded-lg hover:bg-zinc-950 focus:bg-zinc-950 hover:text-slate-50 focus:text-slate-50 border border-slate-50 bg-slate-50 text-zinc-950 transition-all font-semibold active:scale-90"

export const otpLength = 6;

export const trim = (text: string, length: number = 8) => {
    return text.length <= length ? text : text.slice(0, length) + "..."
}

const { toast: sendToast } = useStore.getState()
export const toast = sendToast;
export function generateRandomColor() {
    const red = Math.floor(Math.random() * 200);
    const green = Math.floor(Math.random() * 200);
    const blue = Math.floor(Math.random() * 200);

    const color = "#" + red.toString(16).padStart(2, '0') +
        green.toString(16).padStart(2, '0') +
        blue.toString(16).padStart(2, '0');

    return color;
}

export const font = {
    bold: { fontFamily: "SpaceGrotesk_700Bold", color: "white" },
    regular: { fontFamily: "SpaceGrotesk_400Regular", color: "white" },
    medium: { fontFamily: "SpaceGrotesk_500Medium", color: "white" },
    semiBold: { fontFamily: "SpaceGrotesk_600SemiBold", color: "white" },
    extraBold: { fontFamily: "SpaceGrotesk_800ExtraBold", color: "white" },
    black: { fontFamily: "SpaceGrotesk_900Black", color: "white" }
}

export async function setLocalItem(name: string, value: string) {
    await AsyncStorage.setItem(name, value)
}

export async function getLocalItem(name: string) {
    const value = await AsyncStorage.getItem(name)
    return value;
}

export async function removeLocalItem(name: string) {
    await AsyncStorage.removeItem(name)
}

export const localBackendUrl = "https://zbsz21km-5000.inc1.devtunnels.ms"
export const deployedBackendUrl = "https://vpass.onrender.com"
export const deployedFrontendUrl = "https://v-pass.vercel.app"