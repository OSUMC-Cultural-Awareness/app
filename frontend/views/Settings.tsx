import React, { useEffect } from "react";
import { View } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Routes } from "../routes";
import { Store, updateUser } from "../redux";
import ThemeToggler from "./ThemeToggler";

type Props = {
  navigation: StackNavigationProp<Routes, "Settings">;
  route: RouteProp<Routes, "Settings">;
  token: string;
  updateUser: (user: Store["user"]) => void;
};

function Settings(props: Props): React.ReactElement {
  return (
    <View>
      <ThemeToggler />
      <Divider />
    </View>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateUser,
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
