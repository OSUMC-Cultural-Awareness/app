import React from "react";
import { View, StyleSheet, Linking } from "react-native";

import { Divider, List, IconButton } from "react-native-paper";

import ThemeToggler from "./ThemeToggler";
import DownloadedCultures from "./DownloadedCultures";
import { disclaimerURL } from "../../constants";

// HACK: This is so that icons line up with other icons on the
// Settings page.
const Styles = StyleSheet.create({
  rightIcon: {
    right: -5,
  },

  leftIcon: {
    left: -5,
  },
});

/**
 * Settings page displays downloaded cultures, disclaimer, and dark theme toggler.
 *
 * @returns {React.ReactElement}
 */
export default function Settings(): React.ReactElement {
  return (
    <View>
      <ThemeToggler />
      <Divider />
      <List.Item
        title="Disclaimer"
        onPress={() => Linking.openURL(disclaimerURL)}
        left={(props) => (
          <List.Icon
            {...props}
            style={Styles.leftIcon}
            icon="file-document-outline"
          />
        )}
        right={(props) => (
          <IconButton {...props} icon="eye" style={Styles.rightIcon} />
        )}
      />
      <Divider />
      <DownloadedCultures />
    </View>
  );
}
