import React, { useState, useEffect } from "react";
import { View, FlatList, SafeAreaView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActivityIndicator, List, IconButton, FAB } from "react-native-paper";

import { Routes } from "../../routes";

import { Culture, Ledger } from "../../lib";

import styles from "./styles";

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
export default function Cultures(props: CultureProps): React.ReactElement {
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
                  {props.token !== "" && (
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
      {props.token !== "" && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setCultures([...cultures, ""])}
        ></FAB>
      )}
    </SafeAreaView>
  );
}
