import React, { useEffect } from "react";
import { View } from "react-native";

import { Checkbox, List, IconButton } from "react-native-paper";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Store, updateTheme } from "../../redux";
import { ThemeType } from "../../theme";
import { Storage } from "../../storage";

type Props = {
  updateTheme: (type: ThemeType) => void;
  theme: ThemeType;
};

/**
 * ThemeToggler toggle between Dark and Light Theme
 * when changed updates the Redux store and saves it to local storage.
 *
 * @param {Props} props
 *
 * @returns {React.ReactElement}
 */
function ThemeToggler(props: Props): React.ReactElement {
  const { updateTheme, theme } = props;

  useEffect(() => {
    const getTheme = async () => {
      let theme: ThemeType;
      try {
        theme = (await AsyncStorage.getItem(Storage.Theme)) as ThemeType;
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

  const handleChange = async () => {
    const newTheme = theme === "Dark" ? "Light" : "Dark";
    updateTheme(newTheme);
    try {
      await AsyncStorage.setItem(Storage.Theme, newTheme);
    } catch (err) {
      console.log("failed to set theme");
    }
  };

  return (
    <View>
      <List.Item
        title="Dark Theme"
        onPress={handleChange}
        left={(props) => (
          <IconButton {...props} icon="brightness-6" onPress={handleChange} />
        )}
        right={(props) => (
          <Checkbox
            onPress={handleChange}
            {...props}
            status={theme === "Dark" ? "checked" : "unchecked"}
          />
        )}
      />
    </View>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateTheme,
    },
    dispatch
  );

export default connect(
  (state: Store) => ({ theme: state.theme }),
  mapDispatchToProps
)(ThemeToggler);
