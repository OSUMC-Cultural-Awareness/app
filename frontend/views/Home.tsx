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
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import {
  List,
  ActivityIndicator,
  Button,
  FAB,
  IconButton,
  Modal,
  Portal,
} from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Routes } from "../routes";
import { Store } from "../redux/UserReducer";
import { Admin, Culture } from "../api";

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
    bottom: -450,
  },
  view: {
    height: "100%",
  },
  inviteModal: {
    padding: 20,
    background: "white",
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

  return (
    <View style={styles.view}>
      <Tab.Navigator initialRouteName="Cultures">
        <Tab.Screen name="Cultures">
          {() => <Cultures navigation={props.navigation} token={token} />}
        </Tab.Screen>
        {token ? (
          <Tab.Screen name="Admins">
            {() => (
              <>
                <Admins token={token} user={props.user} />
              </>
            )}
          </Tab.Screen>
        ) : (
          <></>
        )}
      </Tab.Navigator>
      {ListFooter()}
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
    fetchCultureData();
  }, []);

  const fetchCultureData = async () => {
    let cultureNames = await Culture.list();
    setCultures(cultureNames);
  };

  if (!cultures) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        data={cultures}
        keyExtractor={(_, index) => index.toString()}
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

  const onDelete = (email: string) => {
    //TODO: not refreshing the data on client side
    Admin.delete(email, props.token);
    fetchAdminData();
  };

  const onEdit = (user: {
    email: string;
    name: string;
    superUser: boolean;
  }) => {
    //TODO: update Admin.update() perams
    //Admin.update(email, props.token)
    fetchAdminData();
  };

  const onInvite = async (email: string) => {
    try {
      await Admin.invite(email, props.token);
    } catch (err) {
      // somehow display error
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
