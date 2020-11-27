import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Routes } from "../../routes";

import { Store } from "../../redux";
import { Admin, Culture } from "../../lib";

import Cultures from "./Cultures";
import Admins from "./Admins";
import styles from "./styles";

type Props = {
  navigation: StackNavigationProp<Routes, "Home">;
  route: RouteProp<Routes, "Home">;
  user: Admin;
  token: string;
};

type TabProps = {
  Cultures: { cultures: Culture[] };
  Admins: { admins: Admin[] };
};

const Tab = createMaterialTopTabNavigator<TabProps>();

function Home(props: Props): React.ReactElement {
  const token = props.token;

  return (
    <View style={styles.view}>
      {token ? (
        <Tab.Navigator initialRouteName="Cultures">
          <Tab.Screen name="Cultures">
            {() => <Cultures navigation={props.navigation} token={token} />}
          </Tab.Screen>
          <Tab.Screen name="Admins">
            {() => <Admins token={token} user={props.user} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <Cultures navigation={props.navigation} token={""} />
      )}
    </View>
  );
}

export default connect(
  (
    state: Store,
    ownProps: {
      navigation: StackNavigationProp<Routes, "Home">;
      route: RouteProp<Routes, "Home">;
    }
  ) => ({
    navigation: ownProps.navigation,
    route: ownProps.route,
    user: state.user.user,
    token: state.user.token,
  }),
  null
)(Home);
