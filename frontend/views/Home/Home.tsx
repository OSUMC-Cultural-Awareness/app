import React, { useState, useEffect } from "react";
import { View, Platform, useWindowDimensions } from "react-native";

import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FAB,
  Portal,
  Modal,
  Text,
  ActivityIndicator,
} from "react-native-paper";

import { Store } from "../../redux";
import { Admin, Culture } from "../../lib";
import { Routes } from "../../routes";

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
  const { token, route, navigation, user } = props;

  const [cultures, setCultures] = useState(null);
  const [admins, setAdmins] = useState(null);
  const [inviteModal, setInviteModal] = useState(false);
  const window = useWindowDimensions();
  const safeArea = useSafeAreaInsets();

  const fetchCultures = async () => {
    let cultureNames = await Culture.list();
    setCultures(cultureNames);
  };

  useEffect(() => {
    fetchCultures();
  }, []);

  const fetchAdmins = async () => {
    if (!props.token) {
      return;
    }

    const admins = user.superUser ? await Admin.list(token) : [user];
    setAdmins(admins);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (!token) {
    return (
      <Cultures
        navigation={props.navigation}
        token={""}
        cultures={cultures}
        onRefresh={() => fetchCultures()}
      />
    );
  }

  const onAdd = () => {
    switch (getFocusedRouteNameFromRoute(route) ?? "Cultures") {
      case "Cultures":
        setCultures([
          ...cultures,
          { name: "New Culture", modified: Date.now() },
        ]);
        break;
      case "Admins":
        setInviteModal(true);
    }
  };

  const onInvite = async (email: string) => {
    try {
      await Admin.invite(email, token);
    } catch (err) {
      // show error message
    }
  };

  if (!admins) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  // HACK: In order to get the FAB to be positioned properly on both Web and Mobile.
  //
  // Web: use position: fixed.
  // Mobile: useWindowDimensions hook, this doesn't work on Web.
  const fabStyles = {
    margin: 16,
    right: 0,
    position: Platform.OS === "web" ? "fixed" : "absolute",
  };

  if (Platform.OS !== "web") {
    fabStyles["top"] = window.height - safeArea.bottom;
  } else {
    fabStyles["bottom"] = 0;
  }

  return (
    <View style={styles.view}>
      <Tab.Navigator initialRouteName="Cultures">
        <Tab.Screen name="Cultures">
          {() => (
            <Cultures
              navigation={navigation}
              token={token}
              cultures={cultures}
              onRefresh={() => fetchCultures()}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Admins">
          {() => (
            <Admins
              token={token}
              admins={admins}
              onRefresh={() => fetchAdmins()}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <FAB icon="plus" style={fabStyles as any} onPress={onAdd} />
      <Portal>
        <Modal visible={inviteModal} onDismiss={() => setInviteModal(false)}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
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
