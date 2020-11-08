import "react-native-gesture-handler";
import * as React from "react";

import { Provider as PaperProvider, Button, Avatar } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from "expo";
import { homePage } from "./views/homePage";
import { adminDashboard } from "./views/adminDashboard";
import { adminLogin } from "./views/adminLogin";
import { adminRegistration } from "./views/adminRegistration";
import { CultureView } from "./views/culture";
import { Routes } from "./routes";
import { Theme } from "./constants";

function App() {
  const Stack = createStackNavigator<Routes>();

  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
        {
          <Stack.Navigator initialRouteName="Culture">
            <Stack.Screen
              name="Culture"
              component={CultureView}
              initialParams={{ cultureName: "African Americans" }}
              options={{
                headerRight: () => (
                  <Button onPress={() => console.log("button pressed")}>
                    <Avatar.Text size={36} label="NH" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen name="Home" component={homePage} />
            <Stack.Screen name="Dashboard" component={adminDashboard} />
            <Stack.Screen name="Login" component={adminLogin} />
            <Stack.Screen name="Register" component={adminRegistration} />
          </Stack.Navigator>
        }
      </NavigationContainer>
    </PaperProvider>
  );
}

export default registerRootComponent(App);
