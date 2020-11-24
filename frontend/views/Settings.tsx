import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Checkbox, List, IconButton, Colors } from "react-native-paper";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { updateUser } from "../redux/UserAction";
import { updateTheme } from "../redux/ThemeAction";
import { Routes } from "../routes";
import { Store } from "../redux/UserReducer";
import { ThemeStorage, ThemeType } from "../constants";

type Props = {
  navigation: StackNavigationProp<Routes, "Settings">;
  route: RouteProp<Routes, "Settings">;
  token: string;
  updateUser: (user: Store["user"]) => void;
  updateTheme: (theme: ThemeType) => void;
};

function Settings(props: Props): React.ReactElement {
  return <ThemeToggler onChange={props.updateTheme} />;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateUser,
      updateTheme,
    },
    dispatch
  );

export default connect(
  (
    state: Store,
    ownProps: {
      navigation: StackNavigationProp<Routes, "Settings">;
      route: RouteProp<Routes, "Settings">;
    }
  ) => ({
    token: state.user.token,
    navigation: ownProps.navigation,
    route: ownProps.route,
  }),
  mapDispatchToProps
)(Settings);

type DarkThemeToggler = {
  onChange: (type: ThemeType) => void;
  theme: ThemeType;
};

function DarkThemeToggler(props: DarkThemeToggler): React.ReactElement {
  const { onChange, theme } = props;

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

      updateTheme(theme);
    };

    getTheme();
  }, []);

  // Unmount useEffect
  useEffect(() => {
    const setTheme = async () => {
      // TODO: Figure out why these need to be swapped.
      const actualTheme = theme === "Dark" ? "Light" : "Dark";

      try {
        await AsyncStorage.setItem(ThemeStorage, actualTheme);
      } catch (err) {
        console.log("failed to set theme");
      }
    };

    return async () => await setTheme();
  });

  const handleChange = () => {
    console.log("Current theme", theme);
    const newTheme = theme === "Dark" ? "Light" : "Dark";
    updateTheme(newTheme);
    console.log(newTheme);
    onChange(newTheme);
  };

  return (
    <View>
      <List.Item
        title="Dark Theme"
        onPress={handleChange}
        left={() => <IconButton icon="brightness-6" />}
        right={() => (
          <Checkbox
            status={theme === "Dark" ? "checked" : "unchecked"}
            color={Colors.grey800}
          />
        )}
      />
    </View>
  );
}

const ThemeToggler = connect(
  (state: Store, ownProps: { onChange: (theme: ThemeType) => void }) => ({
    onChange: ownProps.onChange,
    theme: state.theme,
  }),
  null
)(DarkThemeToggler);
