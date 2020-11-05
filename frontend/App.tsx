import "react-native-gesture-handler";
import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from "expo";
import { homePage } from "./views/homePage";
import { adminDashboard } from "./views/adminDashboard";
import { adminLogin } from "./views/adminLogin";
import { adminRegistration } from "./views/adminRegistration";
import { CultureView } from "./views/culture";
import { Routes } from "./routes";

function App() {
  const Stack = createStackNavigator<Routes>();

  return (
    <NavigationContainer>
      {
        <Stack.Navigator initialRouteName="Culture">
          <Stack.Screen
            name="Culture"
            component={CultureView}
            initialParams={{ cultureName: "African American" }}
          />
          <Stack.Screen name="Home" component={homePage} />
          <Stack.Screen name="Dashboard" component={adminDashboard} />
          <Stack.Screen name="Login" component={adminLogin} />
          <Stack.Screen name="Register" component={adminRegistration} />
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
