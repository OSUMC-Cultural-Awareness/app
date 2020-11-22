import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import {
  List,
  ActivityIndicator,
  Colors,
  Button,
  FAB,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Routes } from "../routes";
import { Store } from "../redux/UserReducer";
import { Admin } from "../api/admin";
import { Culture } from "../api/culture";

const styles = StyleSheet.create({
  spinner: { top: "50%", position: "relative" },
  emptyListStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: "center",
  },
  itemStyle: {
    padding: 10,
  },
  img: {
    padding: 35,
    height: 70,
    width: "25%",
  },
  headerFooterStyle: {
    width: "100%",
    height: 45,
    backgroundColor: "#606070",
  },
  bottomFooterStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 70,
    backgroundColor: "#606070",
    position: "absolute",
    bottom: "0px",
    left: "0px",
    right: "0px",
    marginBottom: "0px",
  },
  textStyle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    padding: 7,
  },
  btn: {},
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  view: {
    height: "100%",
  },
});

type Props = {
  navigation: StackNavigationProp<Routes, "Home">;
  route: RouteProp<Routes, "Home">;
  user: Admin;
  token: string;
};

type TabProps = {
  Cultures: { insights: Culture[] };
  Admins: { insights: Admin };
};

const Tab = createMaterialTopTabNavigator<TabProps>();

function Home(props: Props): React.ReactElement {
  const [cultures, setCultures] = useState(null);
  const [users, setUsers] = useState(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const [showErr, setShowErr] = useState<boolean>(false);
  const route = useRoute();
  const token = props.token;

  const hideSnackbar = () => setShowErr(false);

  useEffect(() => {
    fetchCultureData();
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchCultureData = async () => {
    let cultureNames = await Culture.list();
    setCultures(cultureNames);
  };

  const fetchAdminData = async () => {
    let users;
    if (props.user.superUser) {
      users = await Admin.list(token);
    } else {
      users = [props.user];
    }
    setUsers(users);
  };

  const ListHeader = () => {
    //View to set in Header
    return (
      <View style={styles.headerFooterStyle}>
        <Text style={styles.textStyle}>Cultural Awareness Home Page</Text>
      </View>
    );
  };

  const ListFooter = () => {
    //View to set in Footer
    return (
      <View style={styles.bottomFooterStyle}>
        <Button onPress={() => console.log("Pressed!")}>
          General Disclaimer
        </Button>
        <TouchableOpacity style={styles.btn} onPress={handleAdminLogin}>
          <Image
            source={require("../assets/admin_login.png")}
            style={styles.img}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleAdminLogin = (evt) => {
    props.navigation.navigate("Login");
  };
  const handleDisclaimer = (evt) => {
    console.log("Pressed");
  };

  if (cultures === null)
    return <ActivityIndicator animating={true} color={Colors.red800} />;

  return (
    // TODO:
    // We want to refactor this code to work like the Culture view
    // Use the same patterns/base components as Culture.tsx

    <View style={styles.view}>
      <Tab.Navigator initialRouteName="Cultures">
        {/* CULTURES TAB */}
        <Tab.Screen name="Cultures">
          {() => (
            <Cultures
              onRefresh={async () => fetchCultureData()}
              cultures={cultures}
              navigation={props.navigation}
              token={token}
            />
          )}
        </Tab.Screen>

        {/* ADMINS TAB */}
        {/* This tab should only be visible to users who are logged in how can we prevent the following component from rendering if a user is not signed in? */}
        {/* TODO: create admins component that lists the admins, pass users to that component */}
        <Tab.Screen name="Admins">
          {() => (
            <Admins
              onRefresh={async () => fetchAdminData()}
              users={users}
              navigation={props.navigation}
              token={token}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <>
        {/* {token &&
          (editing ? (
            TODO: create ToolsFAB component, updateAdmin function

            <ToolsFAB
              onSave={() => updateAdmin()}
              onAdd={addInsightOrCategory}
            />
          ) : (
            TODO: create EditFab component

            <EditFAB onPress={() => setEditing(!editing)} />
          ))} */}
      </>
      <Snackbar
        visible={showErr}
        onDismiss={hideSnackbar}
        action={{
          label: "Hide",
          onPress: hideSnackbar,
        }}
      >
        {err}
      </Snackbar>
      {ListFooter()}
    </View>
  );
}

/**
 * Properties for {@link Cultures}
 */
type CultureProps = {
  // callback called when the {@link FlatList} is refreshed
  onRefresh: () => void;
  // Cultures to render
  cultures: { name: string; cultures: Culture[] }[];
  navigation: any;
  token: string;
};

/**
 * Component that displays a list of components of either {@link Cultures}
 *
 * @param {CultureProps} props
 * @returns {React.ReactElement} React component
 */
function Cultures(props: CultureProps): React.ReactElement {
  const { cultures, onRefresh } = props;
  const [refreshing, setRefreshing] = useState(false);

  if (!cultures) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  const refresh = () => {
    onRefresh();
    setRefreshing(true);
  };

  return (
    <SafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        data={cultures}
        keyExtractor={(_, index) => index.toString()}
        onRefresh={() => refresh()}
        refreshing={refreshing}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.name}
              onPress={() =>
                props.navigation.navigate("Culture", { cultureName: item.name })
              }
              right={() =>
                props.token ? (
                  <IconButton
                    icon="delete"
                    onPress={() => Culture.delete(item.name, props.token)}
                  />
                ) : null
              }
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

/* ADMIN */

/**
 * Properties for {@link Users}
 */
type AdminProps = {
  // callback called when the {@link FlatList} is refreshed
  onRefresh: () => void;
  // Users to render
  users: { name: string ; users: Admin[] }[];
  navigation: any;
  token: string;
};

/**
 * Component that displays a list of components of either {@link Users}
 *
 * @param {AdminProps} props
 * @returns {React.ReactElement} React component
 */
function Admins(props: AdminProps): React.ReactElement {
  const { users, onRefresh } = props;
  const [refreshing, setRefreshing] = useState(false);

  if (!users) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  const refresh = () => {
    onRefresh();
    setRefreshing(true);
  };


  return (
    <SafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        data={users}
        keyExtractor={(_, index) => index.toString()}
        onRefresh={() => refresh()}
        refreshing={refreshing}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.name}
              onPress={() => {
                Alert.alert("user pressed", item.name, [{ text: "OK", onPress: () => console.log("OK Pressed") }]);
              }
                //props.navigation.navigate("Culture", { cultureName: item.name })
              }
              right={() =>
                props.token ? (
                  <IconButton
                    icon="delete"
                    onPress={() => Admin.delete(item.name, props.token)}
                  />
                ) : null
              }
            />
          );
        }}
      />
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
