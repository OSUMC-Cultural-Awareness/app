import React, { useState, useEffect, useLayoutEffect } from "react";
import { View } from "react-native";

import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Portal, ActivityIndicator, FAB, Snackbar } from "react-native-paper";

import { Store } from "../../redux";
import { Admin, Culture, OfflineError, Ledger } from "../../lib";
import { Routes } from "../../routes";

import Cultures from "./Cultures";
import Admins from "./Admins";
import styles from "./styles";
import InviteModal from "./InviteModal";
import Header from "../Header";

type Props = {
  navigation: StackNavigationProp<Routes, "Home">;
  route: RouteProp<Routes, "Home">;
  user: Admin;
  token: string;
  theme: string;
};

type TabProps = {
  Cultures: { cultures: Culture[] };
  Admins: { admins: Admin[] };
};

const Tab = createMaterialTopTabNavigator<TabProps>();

function Home(props: Props): React.ReactElement {
  const { token, route, user, navigation } = props;

  const [cultures, setCultures] = useState<Map<string, number>>(null);
  const [admins, setAdmins] = useState(null);
  const [inviteModal, setInviteModal] = React.useState(false);
  const [msg, setMsg] = useState<string>("");
  const [offline, setOffline] = useState(false);

  const [searchQuery, setSearchQuery] = useState(undefined);
  const [showSearch, setShowSearch] = useState(false);

  useLayoutEffect(() => {
    const header = Header({
      title: "Cultural Awareness",
      searchQuery: searchQuery,
      showSearch: showSearch,
      onSearchChange: (text: string) => setSearchQuery(text),
      onSearchStart: () => setShowSearch(true),
      onCancel: () => setShowSearch(false),
    });

    navigation.setOptions(header({ navigation }));
  }, [navigation, showSearch, searchQuery]);

  const fetchCultures = async () => {
    try {
      const cultures = await Culture.list();
      setCultures(cultures);
    } catch (err) {
      if (err instanceof OfflineError) {
        try {
          const cultures = await Ledger.list();
          setCultures(cultures);
          setOffline(true);
        } catch (err) {
          setMsg(err.toString());
        }
      } else {
        setMsg(err.toString());
      }
    }
  };

  useEffect(() => {
    fetchCultures();
  }, []);

  const fetchAdmins = async () => {
    if (!props.token) {
      return;
    }

    try {
      const admins = user.superUser ? await Admin.list(token) : [user];
      setAdmins(admins);
    } catch (err) {
      setMsg(err.toString());
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const cultureNames = cultures ? [...cultures.entries()] : [];

  if (!token) {
    return (
      <View>
        <Cultures
          navigation={props.navigation}
          token={""}
          cultures={cultureNames}
          onRefresh={() => fetchCultures()}
          searchQuery={searchQuery}
          offline={offline}
          onMsg={(msg) => setMsg(msg)}
        />
        <Portal>
          <Snackbar
            visible={msg != ""}
            onDismiss={() => setMsg("")}
            action={{
              label: "Ok",
              onPress: () => setMsg(""),
            }}
          >
            {msg}
          </Snackbar>
        </Portal>
      </View>
    );
  }

  const onAdd = () => {
    switch (getFocusedRouteNameFromRoute(route) ?? "Cultures") {
      case "Cultures":
        setCultures(
          new Map([...cultures.entries(), ["New Culture", Date.now()]])
        );
        break;
      case "Admins":
        setInviteModal(true);
    }
  };

  if (!admins) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  return (
    <View style={styles.view}>
      <Tab.Navigator initialRouteName="Cultures">
        <Tab.Screen name="Cultures">
          {() => (
            <Cultures
              navigation={navigation}
              token={token}
              searchQuery={searchQuery}
              cultures={cultureNames}
              onRefresh={() => fetchCultures()}
              offline={offline}
              onMsg={(msg) => setMsg(msg)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Admins">
          {() => (
            <Admins
              token={token}
              admins={admins}
              onRefresh={() => fetchAdmins()}
              searchQuery={searchQuery}
              onMsg={(msg) => setMsg(msg)}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <FAB style={styles.fab} icon="plus" onPress={onAdd} />
      <Portal>
        <Snackbar
          visible={msg != ""}
          onDismiss={() => setMsg("")}
          action={{
            label: "Ok",
            onPress: () => setMsg(""),
          }}
        >
          {msg}
        </Snackbar>
        <InviteModal
          show={inviteModal}
          token={token}
          onDismiss={() => setInviteModal(false)}
          onErr={(err: string) => setMsg(err)}
        />
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
    theme: state.theme,
  }),
  null
)(Home);
