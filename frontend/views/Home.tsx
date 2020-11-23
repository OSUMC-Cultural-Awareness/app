//import React from 'react';
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
import * as React from "react";
import { useState, useEffect } from "react";
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
} from "react-native-paper";

import { Routes } from "../routes";
import { Store } from "../redux/UserReducer";
import { Ledger } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  token: string;
};

function Home(props: Props) {
  const [cultures, setCultures] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let cultureNames = await Culture.list();
      setCultures(cultureNames);
    };

    fetchData();
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
    //alert('Pressed!')
  };
  const handleDisclaimer = (evt) => {
    console.log("Pressed");
  };

  if (cultures === null)
    return <ActivityIndicator animating={true} color={Colors.red800} />;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={cultures}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={ListFooter}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.name}
              onPress={() =>
                props.navigation.navigate("Culture", { cultureName: item.name })
              }
              right={() =>
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                    <IconButton
                    icon="download"
                    onPress={() => Ledger.add(item.name)}
                    />
                    {props.token && <IconButton
                    icon="delete"
                    onPress={() => Culture.delete(item.name, props.token)}
                    />}
                  </View>
              }
            />
          );
        }}
        //ListEmptyComponent={EmptyListMessage}
      />
      {props.token && <FAB icon="plus" style={styles.fab} onPress={() => setCultures([...cultures, ""])}></FAB>}
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
    token: state.user.token,
    navigation: ownProps.navigation,
    route: ownProps.route,
  }),
  null
)(Home);
