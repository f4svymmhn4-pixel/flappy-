import "react-native-gesture-handler";
import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { QuizProvider } from "./src/context/QuizContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { colors } from "./src/theme/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold: require("./assets/fonts/PlayfairDisplay_600SemiBold.ttf"),
    PlayfairDisplay_700Bold: require("./assets/fonts/PlayfairDisplay_700Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <QuizProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </QuizProvider>
        </FavoritesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
