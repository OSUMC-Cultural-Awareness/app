import React from "react";
import { View, StyleSheet, Platform } from "react-native";

import {
  IconButton,
  Avatar,
  TouchableRipple,
  Searchbar,
  Title,
} from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { connect } from "react-redux";

import { Store } from "../redux";
import { Routes } from "../routes";

type RightHeaderButtonProps = {
  // name of Admin
  name: string;
  navigation: StackNavigationProp<
    Routes,
    "Culture" | "Home" | "Settings" | "Login" | "Register"
  >;
  showSearch: boolean;
  onSearchStart: () => void;
  onCancel: () => void;
};

const styles = StyleSheet.create({
  view: { flex: 1, flexDirection: "row" },

  innerView: { justifyContent: "center" },

  ripple: { marginRight: 15 },

  searchView: { marginEnd: 25 },

  title: { fontWeight: "600" },
});

/**
 * RightHeaderButton right header button displays '...' if not logged in
 * and an avatar if logged in. Allows the user to navigate to Settings page or log out.
 *
 * @param {RightHeaderButtonProps} props
 * @returns {React.ReactElement}
 */
function RightHeaderButton(props: RightHeaderButtonProps): React.ReactElement {
  const { name, showSearch, navigation, onSearchStart, onCancel } = props;

  return (
    <View style={styles.view}>
      <View style={styles.innerView}>
        {showSearch ? (
          <IconButton icon="cancel" onPress={onCancel} />
        ) : (
          <IconButton icon="magnify" onPress={onSearchStart} />
        )}
      </View>
      <View style={styles.innerView}>
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
    </View>
  );
}

const HeaderButton = connect(
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

type Props = {
  title: string;
  searchQuery?: string;
  onSearchChange: (text: string) => void;
  onSearchStart: () => void;
  showSearch: boolean;
  onCancel: () => void;
};

export default function Header(props: Props) {
  const {
    title,
    showSearch,
    searchQuery,
    onSearchChange,
    onSearchStart,
    onCancel,
  } = props;

  let searchBarStyles = {};
  if (Platform.OS === "ios") {
    searchBarStyles = { height: 30 };
  }

  return ({ navigation }) => ({
    headerTitle: () => (
      <View style={styles.searchView}>
        {showSearch ? (
          <Searchbar
            autoFocus={true}
            placeholder="search"
            style={searchBarStyles}
            onChangeText={onSearchChange}
            value={searchQuery}
          />
        ) : (
          <Title style={styles.title}>{title}</Title>
        )}
      </View>
    ),
    headerRight: () => (
      <HeaderButton
        navigation={navigation}
        onSearchStart={onSearchStart}
        showSearch={showSearch}
        onCancel={onCancel}
      />
    ),
  });
}
