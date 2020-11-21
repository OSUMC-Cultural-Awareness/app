import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Culture } from "../api/culture";
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

const styles = StyleSheet.create({
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
    height: 80,
    backgroundColor: "#606070",
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
});

type Props = {
  navigation: StackNavigationProp<Routes, "Home">;
  route: RouteProp<Routes, "Home">;
  user: Admin;
  token: string;
};

type TabProps = {
  // TODO
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
    const fetchCultureData = async () => {
      let cultureNames = await Culture.list();
      setCultures(cultureNames);
    };

    fetchCultureData();
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      let users;
      if (props.user.superUser) {
        users = await Admin.list(token);
      } else {
        users = [props.user];
      }
      setUsers(users);
    };

    fetchAdminData();
  }, []);

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

  
  // These are the documents that we fetched from the database above
  // Pass these as arguments to Admins and Cultures components respectively

  console.log(users);
  console.log(cultures);

  return (
    // TODO:
    // We want to refactor this code to work like the Culture view
    // Use the same patterns/base components as Culture.tsx
    // Fill in the Cultures tab and Admins tab
    //

    <View>
      <Tab.Navigator initialRouteName="Cultures">
        {/* CULTURES TAB */}
        <Tab.Screen name="Cultures">
          {/* TODO: create a cultures component that lists the cultures, reuse the FlatList that was originally in here */}
        </Tab.Screen>

        {/* ADMINS TAB */}
        {/* This tab should only be visible to users who are logged in */}
        <Tab.Screen name="Admins">
          {/* TODO: create admins component that lists the admins  */}
        </Tab.Screen>
      </Tab.Navigator>
      <>
        {token &&
          (editing ? (
            // TODO: create ToolsFAB component, updateAdmin function

            // <ToolsFAB
            //   onSave={() => updateAdmin()}
            //   onAdd={addInsightOrCategory}
            // />
          ) : (
            // TODO: create EditFab component

            // <EditFAB onPress={() => setEditing(!editing)} />
          ))}
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
    </View>

    // <SafeAreaView style={{ flex: 1 }}>
    //   <FAB icon="plus" style={styles.fab}></FAB>
    //   <FlatList
    //     style={{ flex: 1 }}
    //     data={cultures}
    //     keyExtractor={(_, index) => index.toString()}
    //     ListFooterComponent={ListFooter}
    //     renderItem={({ item }) => {
    //       return (
    //         <List.Item
    //           title={item.name}
    //           onPress={() =>
    //             props.navigation.navigate("Culture", { cultureName: item.name })
    //           }
    //           right={() =>
    //             props.token ? (
    //               <IconButton
    //                 icon="delete"
    //                 onPress={() => Culture.delete(item.name, props.token)}
    //               />
    //             ) : null
    //           }
    //         />
    //       );
    //     }}
    //     //ListEmptyComponent={EmptyListMessage}
    //   />
    // </SafeAreaView>
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
