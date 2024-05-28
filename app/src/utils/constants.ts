
// styles

export const buttonClassNames = "py-2 px-4 rounded-lg bg-zinc-950 text-slate-50 border border-zinc-950 hover:bg-slate-50 focus:bg-slate-50 hover:text-zinc-950 focus:text-zinc-950 transition-all font-semibold active:scale-90"

export const buttonDarkClassNames = " py-2 px-4 rounded-lg hover:bg-zinc-950 focus:bg-zinc-950 hover:text-slate-50 focus:text-slate-50 border border-slate-50 bg-slate-50 text-zinc-950 transition-all font-semibold active:scale-90"

export const otpLength = 6;

export const trim = (text:string, length:number=8) => {
    return text.length<=length?text:text.slice(0,length)+"..."
}

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
    bold : {fontFamily:"SpaceGrotesk_700Bold"},
    regular : {fontFamily:"SpaceGrotesk_400Regular"},
    medium : {fontFamily:"SpaceGrotesk_500Medium"},
    semiBold : {fontFamily:"SpaceGrotesk_600SemiBold"},
    extraBold : {fontFamily:"SpaceGrotesk_800ExtraBold"},
    black : {fontFamily:"SpaceGrotesk_900Black"}
}

export function toast(text:string){
    console.info(text)
}

export const localBackendUrl = "https://zbsz21km-5000.inc1.devtunnels.ms"
export const deployedBackendUrl = "https://vpass.onrender.com"

