import React, { useState } from "react";

import { IconButton, Avatar, Button, Menu } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { resetUser, Store } from "../redux";
import { Routes } from "../routes";

type Props = {
  // name of Admin
  name: string;
  navigation: StackNavigationProp<
    Routes,
    "Culture" | "Home" | "Settings" | "Login" | "Register"
  >;
  // Redux action in order to reset the User
  resetUser: () => void;
};

/**
 * RightHeaderButton right header button displays '...' if not logged in
 * and an avatar if logged in. Allows the user to navigate to Settings page or log out.
 *
 * @param {Props} props
 * @returns {React.ReactElement}
 */
function RightHeaderButton(props: Props): React.ReactElement {
  const { name, navigation, resetUser } = props;

  const [menu, setMenu] = useState(false);

  return (
    <Menu
      visible={menu}
      onDismiss={() => setMenu(false)}
      anchor={
        name === "" ? (
          <IconButton icon="dots-vertical" onPress={() => setMenu(true)} />
        ) : (
          <Button onPress={() => setMenu(true)}>
            <Avatar.Text size={32} label={name.substr(0, 2)} />
          </Button>
        )
      }
    >
      <Menu.Item
        onPress={() => {
          navigation.navigate("Settings");
          setMenu(false);
        }}
        title="Settings"
      />
      {name === "" ? (
        <Menu.Item
          title="Log in"
          onPress={() => {
            navigation.navigate("Login");
            setMenu(false);
          }}
        />
      ) : (
        <Menu.Item
          onPress={() => {
            resetUser();
            navigation.navigate("Home");
            setMenu(false);
          }}
          title="Log out"
        />
      )}
    </Menu>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      resetUser,
    },
    dispatch
  );

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
  mapDispatchToProps
)(RightHeaderButton);

export default ({ navigation }) => ({
  headerRight: () => <HeaderButton navigation={navigation} />,
});
