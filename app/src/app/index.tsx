import SignOutBtn from "@/components/SignOutBtn";
import context from "@/utils/context/context";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  return (
    // <LinearGradient colors={['#FFFFFF', '#000000']} start={{x:0,y:0}} end={{x:1, y:1}} className=' w-full  flex flex-col ' style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <View className="flex flex-1 ">
      <Header />
      <Content />
      <Footer />
    </View>
    // </LinearGradient>
  );
}

function Content() {

  const {setToasts} = useContext(context)
  return (
    <View className="flex-1">
      <View className="py-12 md:py-24 lg:py-32 xl:py-48">
        <View className="px-4 md:px-6">
          <View className="flex flex-col items-center gap-4 text-center">
            <Text
              role="heading"
              className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Welcome to vPass
            </Text>
            <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
              Discover and collaborate on amce. Explore our services now.
            </Text>

            <TouchableOpacity onPress={()=>{
              console.log("hii")
              setToasts((prev)=>{
              console.log([...prev,`${prev.length} toast`])
              return [...prev,`${prev.length} toast`]
              })}} className="gap-4">
              <Text
                className=" text-white"
              >
                Explore
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top }}>
      <View className="px-4 lg:px-6 h-14 flex items-center flex-row justify-between ">
        <Link className="font-bold flex-1 items-center justify-center" href="/">
          ACME
        </Link>
        <View className="flex flex-row gap-4 sm:gap-6 items-center">
          <Link
            className="text-md font-medium hover:underline web:underline-offset-4"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="text-md font-medium hover:underline web:underline-offset-4"
            href="/signup"
          >
            Signup
          </Link>
          <Link
            className="text-md font-medium hover:underline web:underline-offset-4"
            href="/otp"
          >
            Otp
          </Link>
          <SignOutBtn/>
        </View>
      </View>
    </View>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className="flex shrink-0 bg-gray-100 native:hidden"
      style={{ paddingBottom: bottom }}
    >
      <View className="py-6 flex-1 items-start px-4 md:px-6 ">
        <Text className={"text-center text-gray-700"}>
          © {new Date().getFullYear()} Me
        </Text>
      </View>
    </View>
  );
}
