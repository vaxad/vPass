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
      <StatusBar  barStyle={"light-content"} backgroundColor={"#000000"}/>
      <View className=" flex h-full w-full " style={{paddingBottom:bottom, paddingTop: top}}>
      <Stack 
      screenOptions={({ route }) => ({
        gestureEnabled: true,
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
        animation: "ios"
      })}
      />
      <AuthChecker/>
      </View>
    </StateComponent>
):<></>;
}
