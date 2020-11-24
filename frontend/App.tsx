import React, { useState, useEffect } from "react";

import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { createStore } from "redux";
import {
  Provider as PaperProvider,
  Button,
  Avatar,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from "expo";

import {
  Home,
  Login,
  CultureView,
  EditInsight,
  Register,
  Settings,
} from "./views";

import { Routes } from "./routes";
import { colors, ThemeStorage, ThemeType } from "./constants";
import userReducer from "./redux/UserReducer";
import { updateTheme } from "./redux/ThemeAction";

const store = createStore(userReducer);

function App() {
  const [theme, setTheme] = useState<ThemeType>("Light");

  const Stack = createStackNavigator<Routes>();
  const linking = {
    prefixes: ["/"],
  };

  store.subscribe(() => setTheme(store.getState().theme as ThemeType));

  useEffect(() => {
    const getTheme = async () => {
      let theme: ThemeType;
      try {
        theme = (await AsyncStorage.getItem(ThemeStorage)) as ThemeType;
      } catch (err) {
        theme = "Light";
      }

      if (!theme) {
        theme = "Light";
      }

      store.dispatch(updateTheme(theme));
    };

    getTheme();
  }, []);

  const paperThemeMode = theme === "Dark" ? PaperDarkTheme : PaperDefaultTheme;

  const paperTheme = {
    ...paperThemeMode,
    ...colors,
  };

  return (
    <Provider store={store}>
      <NavigationContainer
        linking={linking}
        theme={theme === "Dark" ? DarkTheme : DefaultTheme}
      >
        <PaperProvider theme={paperTheme}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Culture"
              component={CultureView}
              options={{
                headerRight: () => (
                  <Button onPress={() => console.log("button pressed")}>
                    <Avatar.Text size={36} label="NH" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="EditInsight" component={EditInsight} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </Provider>
  );
}

export default registerRootComponent(App);
