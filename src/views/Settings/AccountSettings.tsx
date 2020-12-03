import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Checkbox, List, IconButton, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Routes } from "../../routes";
import { Storage } from "../../storage";

type Props = {
  token: string;
  logout: () => void;
  email: string;
  navigation: StackNavigationProp<Routes, "Settings">;
};

const Styles = StyleSheet.create({
  // HACK: This is so that icons line up with other icons on the
  // Settings page.
  leftIcon: {
    left: -5,
  },
});

/**
 * AccountSettings displays Log in/Log out and whether or not to remember the user's email.
 *
 * @param {Props} props
 * @returns {React.ReactElement} React Component
 */
export default function AccountSettings(props: Props): React.ReactElement {
  const { token, email, logout, navigation } = props;

  const [expanded, setExpanded] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const getEmail = async () => {
      let email: string;
      try {
        email = await AsyncStorage.getItem(Storage.RememberedEmail);
      } catch (err) {
        setRemember(false);
        return;
      }

      if (email) {
        setRemember(true);
      }
    };

    getEmail();
  }, []);

  const rememberEmail = async () => {
    switch (remember) {
      case true:
        try {
          await AsyncStorage.removeItem(Storage.RememberedEmail);
        } catch (err) {
          setRemember(false);
          return;
        }

        setRemember(false);
        break;
      case false:
        try {
          await AsyncStorage.setItem(Storage.RememberedEmail, email);
        } catch (err) {
          setRemember(false);
          return;
        }

        setRemember(true);
    }
  };

  return (
    <View>
      <List.Accordion
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        title="Account"
        left={(props) => (
          <List.Icon {...props} icon="account" style={Styles.leftIcon} />
        )}
      >
        {token !== "" && (
          <List.Item
            title="Remember Email"
            onPress={() => rememberEmail()}
            left={(props) => (
              <IconButton
                {...props}
                icon="email"
                onPress={() => rememberEmail()}
              />
            )}
            right={(props) => (
              <Checkbox
                onPress={() => rememberEmail()}
                {...props}
                status={remember ? "checked" : "unchecked"}
              />
            )}
          />
        )}
      </List.Accordion>
      {expanded && (
        <View>
          {!token ? (
            <Button
              icon="login"
              mode="contained"
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              Log In
            </Button>
          ) : (
            <Button
              icon="logout"
              mode="contained"
              onPress={() => {
                logout();
                navigation.navigate("Home");
              }}
            >
              Log Out
            </Button>
          )}
        </View>
      )}
    </View>
  );
}
