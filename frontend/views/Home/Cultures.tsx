import React from "react";
import { View, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActivityIndicator, List, IconButton } from "react-native-paper";

import { Routes } from "../../routes";

import { Culture, Ledger } from "../../lib";

import styles from "./styles";

/**
 * Properties for {@link Cultures}
 */
type CultureProps = {
  navigation: StackNavigationProp<Routes, "Home">;
  token: string;
  cultures: Culture[];
};

/**
 * Component that displays a list of components of either {@link Cultures}
 *
 * @param {CultureProps} props
 * @returns {React.ReactElement} React component
 */
export default function Cultures(props: CultureProps): React.ReactElement {
  if (!props.cultures) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  return (
    <View>
      <FlatList
        data={props.cultures}
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
    </View>
  );
}
