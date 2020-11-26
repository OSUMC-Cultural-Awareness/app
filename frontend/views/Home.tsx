import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, SafeAreaView, Alert } from "react-native";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  ActivityIndicator,
  List,
  IconButton,
  FAB,
  Portal,
  Modal,
  Text,
} from "react-native-paper";

import { Routes } from "../routes";

import { Store } from "../redux";
import { Admin, Culture, Ledger } from "../api";

const styles = StyleSheet.create({
  spinner: { top: "50%", position: "relative" },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },

  view: {
    flex: 1,
  },

  inviteModal: {
    padding: 20,
    background: "white",
  },

  list: {
    flex: 1,
  },
});

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
      {!token ? (
        <Cultures navigation={props.navigation} token={token} />
      ) : (
        <Tab.Navigator initialRouteName="Cultures">
          <Tab.Screen name="Cultures">
            {() => <Cultures navigation={props.navigation} token={token} />}
          </Tab.Screen>
          {token && (
            <Tab.Screen name="Admins">
              {() => <Admins token={token} user={props.user} />}
            </Tab.Screen>
          )}
        </Tab.Navigator>
      )}
    </View>
  );
}

/**
 * Properties for {@link Cultures}
 */
type CultureProps = {
  navigation: StackNavigationProp<Routes, "Home">;
  token: string;
};

/**
 * Component that displays a list of components of either {@link Cultures}
 *
 * @param {CultureProps} props
 * @returns {React.ReactElement} React component
 */
function Cultures(props: CultureProps): React.ReactElement {
  const [cultures, setCultures] = useState(null);
  useEffect(() => {
    const fetchCultureData = async () => {
      let cultureNames = await Culture.list();
      setCultures(cultureNames);
    };

    fetchCultureData();
  }, []);

  if (!cultures) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={cultures}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.name}
              onPress={() =>
                props.navigation.navigate("Culture", { cultureName: item.name })
              }
              right={() => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    icon="download"
                    onPress={() => Ledger.add(item.name)}
                  />
                  {props.token && (
                    <IconButton
                      icon="delete"
                      onPress={() => Culture.delete(item.name, props.token)}
                    />
                  )}
                </View>
              )}
            />
          );
        }}
      />
      {props.token && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setCultures([...cultures, ""])}
        ></FAB>
      )}
    </SafeAreaView>
  );
}

/**
 * Properties for {@link Users}
 */
type AdminProps = {
  token: string;
  user: Admin;
};

/**
 * Component that displays a list of components of either {@link Users}
 *
 * @param {AdminProps} props
 * @returns {React.ReactElement} React component
 */
function Admins(props: AdminProps): React.ReactElement {
  const [users, setUsers] = useState(null);
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    let users;
    if (props.user.superUser) {
      users = await Admin.list(props.token);
    } else {
      users = [props.user];
    }
    setUsers(users);
  };

  const onDelete = async (email: string) => {
    try {
      await Admin.delete(email, props.token);
    } catch {
      // show error message
    }
    fetchAdminData();
  };

  const onEdit = (user: {
    email: string;
    name: string;
    superUser: boolean;
  }) => {
    //TODO: update Admin.update() perams
    try {
      //Admin.update(email, props.token)
      fetchAdminData();
    } catch {
      // show error message
    }
  };

  const onInvite = async (email: string) => {
    try {
      await Admin.invite(email, props.token);
    } catch (err) {
      // show error message
    }
  };

  if (!users) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        data={users}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.email}
              onPress={() => {
                Alert.alert("user pressed", item.name, [
                  { text: "OK", onPress: () => console.log("OK Pressed") },
                ]);
              }}
              right={() =>
                props.token ? (
                  <>
                    <IconButton icon="pencil" onPress={() => onEdit(item)} />
                    <IconButton
                      icon="delete"
                      onPress={() => onDelete(item.email)}
                    />
                  </>
                ) : null
              }
            />
          );
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(!visible)}
      />
      <Portal>
        <Modal visible={visible} contentContainerStyle={styles.inviteModal}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
    </SafeAreaView>
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
