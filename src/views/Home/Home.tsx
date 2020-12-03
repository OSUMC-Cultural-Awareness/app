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
  Snackbar,
} from "react-native-paper";

import { Store } from "../../redux";
import { Admin, Culture, OfflineError, Ledger } from "../../lib";
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
  const [msg, setMsg] = useState("");
  const [offline, setOffline] = useState(false)

  const fetchCultures = async () => {
    try {
      const cultures = await Culture.list();
      setCultures(cultures);
    } catch (err) {
      if (err instanceof OfflineError) {
        try {
          const ledger = await Ledger.list();
          let cultures = [];
          ledger.forEach(
            (val, key) => cultures.push({ name: key, modified: cultures[key] })
          );
          setCultures(cultures)
          setOffline(true)
        } catch (err) {
          setMsg(err.toString())
        }
      }
    };
  }

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
        offline={offline}
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

  const fabStyles = {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  };

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
              offline={offline}
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
        <Snackbar
          visible={msg != ""}
          onDismiss={() => setMsg("")}
          action={{
            label: 'Undo', onPress: () =>
              setMsg("")
          }}>
          {msg}
        </Snackbar>
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
