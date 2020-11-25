import React from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";
import "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { Culture } from "../api/culture";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import {
  List,
  ActivityIndicator,
  Colors,
  FAB,
  IconButton,
} from "react-native-paper";

import { Routes } from "../routes";
import { Store } from "../redux";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },

  list: {
    flex: 1,
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

  if (cultures === null) {
    return <ActivityIndicator animating={true} color={Colors.red800} />;
  }

  return (
    <SafeAreaView style={styles.list}>
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
      {props.token && <FAB icon="plus" style={styles.fab} />}
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
