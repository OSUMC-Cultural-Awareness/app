import { StatusBar } from "expo-status-bar";
//import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from "expo";
import { useState } from "react";
import Constants from "expo-constants";
import { homePage } from "./views/homePage";
import { adminDashboard } from "./views/adminDashboard";
import { adminLogin } from "./views/adminLogin";
import { adminRegistration } from "./views/adminRegistration";
import { cultureEdit } from "./views/cultureEdit";
import { cultureInsights } from "./views/cultureInsights";
import { editInsight } from "./views/editInsight";

import { Provider as PaperProvider, Button, Avatar } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from "expo";
import { homePage } from "./views/homePage";
import { adminDashboard } from "./views/adminDashboard";
import { adminLogin } from "./views/adminLogin";
import { CultureView } from "./views/culture";
import { Routes } from "./routes";
import { Theme } from "./constants";

function App() {
  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
        {
          <Stack.Navigator initialRouteName="Home">
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
            <Stack.Screen name="Register" component={adminLogin} />
          </Stack.Navigator>
        }
      </NavigationContainer>
    </PaperProvider>
  );
}

export default registerRootComponent(App);

const styles = StyleSheet.create({
  emptyListStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: "center",
  },
  itemStyle: {
    padding: 10,
  },
  img: {
    padding: 35,
    height: 70,
    width: "25%",
  },
  headerFooterStyle: {
    width: "100%",
    height: 45,
    backgroundColor: "#606070",
  },
  bottomFooterStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 80,
    backgroundColor: "#606070",
  },
  textStyle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    padding: 7,
  },
});
