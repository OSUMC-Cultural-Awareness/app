import "react-native-gesture-handler";
import * as React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Provider as PaperProvider, Button, Avatar } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from "expo";
import Home from "./views/Home";
import { adminManagement } from "./views/adminManagement";
import Login from "./views/Login";
import CultureView from "./views/Culture";
import { Routes } from "./routes";
import { Theme } from "./constants";
import userReducer from "./redux/UserReducer";

const store = createStore(userReducer);

function App() {
  const Stack = createStackNavigator<Routes>();
  const linking = {
    prefixes: ["/"],
  };

  return (
    <PaperProvider theme={Theme}>
      <Provider store={store}>
        <NavigationContainer linking={linking}>
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
            <Stack.Screen name="Dashboard" component={adminManagement} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
}

export default registerRootComponent(App);
