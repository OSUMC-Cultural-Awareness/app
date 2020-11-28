import React, { useState } from "react";
import { View, StyleSheet, Linking } from "react-native";

import {
  Divider,
  List,
  IconButton,
  Snackbar,
  Portal,
} from "react-native-paper";

import ThemeToggler from "./ThemeToggler";
import DownloadedCultures from "./DownloadedCultures";
import Feedback from "./Feedback";
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
  const openLink = () => Linking.openURL(disclaimerURL);
  const [msg, setMsg] = useState("");

  return (
    <View>
      <ThemeToggler />
      <Divider />
      <List.Item
        title="Disclaimer"
        onPress={openLink}
        left={(props) => (
          <IconButton
            {...props}
            style={Styles.leftIcon}
            onPress={openLink}
            icon="file-document-outline"
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="eye"
            style={Styles.rightIcon}
            onPress={openLink}
          />
        )}
      />
      <Divider />
      <Feedback />
      <Divider />
      <DownloadedCultures
        onUpdateFinish={(err) => setMsg(err || "Update finished")}
      />
      <Portal>
        <Snackbar
          visible={msg !== ""}
          onDismiss={() => setMsg("")}
          action={{ label: "Ok", onPress: () => setMsg("") }}
        >
          {msg}
        </Snackbar>
      </Portal>
    </View>
  );
}
