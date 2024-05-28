import { Stack } from "expo-router";
import {
  useFonts,
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/dev';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold
  });
  return fontsLoaded ?(
      <Stack 
      screenOptions={({ route }) => ({
        gestureEnabled: true,
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
        animation: "fade_from_bottom"
      })}
      />
):<></>;
}
