import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Fonts } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    [Fonts.regular]: require('@/assets/fonts/Rubik-Regular.ttf'),
    [Fonts.medium]: require('@/assets/fonts/Rubik-Medium.ttf'),
    [Fonts.semiBold]: require('@/assets/fonts/Rubik-SemiBold.ttf'),
    [Fonts.bold]: require('@/assets/fonts/Rubik-Bold.ttf'),
  });

  // Keep the native splash screen up until the fonts are ready. The overlay
  // below hides it on its first layout.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* The detail screen draws its own header (← and the name fading in on scroll). */}
          <Stack.Screen name="pokemon/[id]" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
