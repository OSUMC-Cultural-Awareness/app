import React from "react";
import { View, StyleSheet } from "react-native";

import { IconButton, Avatar, TouchableRipple } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { connect } from "react-redux";

import { Store } from "../redux";
import { Routes } from "../routes";

type Props = {
  // name of Admin
  name: string;
  navigation: StackNavigationProp<
    Routes,
    "Culture" | "Home" | "Settings" | "Login" | "Register"
  >;
};

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: "center" },
  ripple: { marginRight: 15 },
});

/**
 * RightHeaderButton right header button displays '...' if not logged in
 * and an avatar if logged in. Allows the user to navigate to Settings page or log out.
 *
 * @param {Props} props
 * @returns {React.ReactElement}
 */
function RightHeaderButton(props: Props): React.ReactElement {
  const { name, navigation } = props;

  return (
    <View style={styles.view}>
      {name === "" ? (
        <IconButton
          icon="dots-vertical"
          onPress={() => navigation.navigate("Settings")}
        />
      ) : (
        <TouchableRipple
          style={styles.ripple}
          onPress={() => navigation.navigate("Settings")}
        >
          <Avatar.Text size={32} label={name[0]} />
        </TouchableRipple>
      )}
    </View>
  );
}

export const HeaderButton = connect(
  (
    state: Store,
    ownProps: {
      navigation: StackNavigationProp<
        Routes,
        "Culture" | "Home" | "Settings" | "Login" | "Register"
      >;
    }
  ) => ({
    name: state.user.user.name,
    navigation: ownProps.navigation,
  }),
  null
)(RightHeaderButton);

export default ({ navigation }) => ({
  headerRight: () => <HeaderButton navigation={navigation} />,
});
