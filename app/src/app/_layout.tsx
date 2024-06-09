import "../global.css";
import { Slot, Stack } from "expo-router";
import {
  useFonts,
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/dev';
import StateComponent from "@/utils/context/StateComponent";
import { StatusBar, View } from "react-native";
import AuthChecker from "@/components/AuthChecker";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient'
import Toaster from "@/components/Toaster";
export default function Layout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold
  });
  const { top, bottom } = useSafeAreaInsets();
  return fontsLoaded ?(
    <StateComponent>
      <LinearGradient colors={['#060A13', '#000000']} start={{x:0,y:0}} end={{x:1, y:1}} className=' w-full  flex flex-col ' style={{ height: "100%", display: "flex", flexDirection: "column" }}> 
      <StatusBar  barStyle={"light-content"} backgroundColor={"transparent"}/>
      <View className=" relative flex h-full w-full flex-col " style={{paddingBottom:bottom, paddingTop: top}}>
      {/* bg-gradient-to-br from-[#060A13] to-[#000000] */}
      <Stack 
      screenOptions={({ route }) => ({
        gestureEnabled: true,
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
        contentStyle:{
          backgroundColor:"transparent",
        },
        animation: "ios"
      })}
      />
      <Toaster/>
      <AuthChecker/>
      </View>
      </LinearGradient>
      
    </StateComponent>
):<></>;
}
