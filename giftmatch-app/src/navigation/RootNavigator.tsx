import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { HomeScreen } from "../screens/HomeScreen";
import { QuestionnaireScreen } from "../screens/QuestionnaireScreen";
import { AnalysisScreen } from "../screens/AnalysisScreen";
import { ResultsScreen } from "../screens/ResultsScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { colors } from "../theme/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.primary,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
        <Stack.Screen
          name="Analysis"
          component={AnalysisScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
