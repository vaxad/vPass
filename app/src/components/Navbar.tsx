import { Link } from "expo-router";
import SignOutBtn from "./SignOutBtn";
import { font } from "@/utils/constants";
import TeamChanger from "./TeamChanger";
import { Text, View } from "react-native";
// import { Image } from "react-native";
import { LogoSvg } from "@/assets/svgs";

export default function Navbar() {

    return (
        <View className=" px-4 py-2 flex flex-row justify-between gap-2 items-center " style={{ zIndex: 100, borderBottomWidth: 2, borderBottomColor: "#171717" }}>
            <View className=" flex flex-row items-center gap-2">
                {/* <Image className=" w-8 h-8" src={()=>require("../assets/images/")} /> */}
                <View className=" w-8 h-8 flex">
                    <LogoSvg />
                </View>
                <Link href={"/passwords"} className=" flex flex-row tracking-tighter  ">
                    <Text style={font.bold} className="text-xl">V</Text>
                    <Text style={font.regular} className="text-xl">pass</Text>
                </Link>
                {/* <TeamChanger /> */}
            </View>
            <View className=" flex flex-row gap-3 justify-center items-center w-fit">
                {/* <TeamChanger/> */}
                {/* <SignOutBtn /> */}
                <TeamChanger />

            </View>
            {/* <MobileNav paths={paths}/> */}
        </View>
    )
}
