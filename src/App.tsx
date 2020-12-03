import React, { useEffect } from "react";

import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";

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
  Culture,
  EditInsight,
  Register,
  Recovery,
  Settings,
} from "./views";

import { Routes, Linking } from "./routes";
import { lightTheme, darkTheme, ThemeStorage, ThemeType } from "./theme";
import { Reducer, updateTheme, Store } from "./redux";

const store = createStore(Reducer);

function App() {
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

  return (
    <Provider store={store}>
      <NavigatorScreen />
    </Provider>
  );
}

type NavigatorProps = {
  theme: ThemeType;
};

/**
 * Navigator contained inside of {@link App} manages navigation and theming.
 *
 * @remark This component isn't just inside of {@link App} because it needs to connect
 * to the Redux store in order to properly re-render when a change to the theme is done.
 *
 * @param {NavigatorProps} props
 * @returns {React.ReactElement}
 */
function Navigator(props: NavigatorProps): React.ReactElement {
  const { theme } = props;

  const Stack = createStackNavigator<Routes>();

  return (
    <NavigationContainer
      linking={Linking}
      theme={theme === "Dark" ? DarkTheme : DefaultTheme}
    >
      <PaperProvider theme={theme === "Dark" ? darkTheme : lightTheme}>
        <StatusBar style={theme === "Dark" ? "light" : "dark"} />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Culture"
            component={Culture}
            options={{
              headerTitleAlign: "left",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTitleAlign: "left",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitleAlign: "left",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerTitleAlign: "left",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="EditInsight"
            component={EditInsight}
            options={{
              headerTitleAlign: "left",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerTitleAlign: "left",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Recovery"
            component={Recovery}
            options={{
              headerTitleAlign: "left",
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

const NavigatorScreen = connect(
  (state: Store) => ({
    theme: state.theme,
  }),
  null
)(Navigator);

export default registerRootComponent(App);
