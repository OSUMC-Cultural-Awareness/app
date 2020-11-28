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
  onRefresh: () => void;
};

/**
 * Component that displays a list of components of either {@link Cultures}
 *
 * @param {CultureProps} props
 * @returns {React.ReactElement} React component
 */
export default function Cultures(props: CultureProps): React.ReactElement {
  const { cultures, onRefresh, token } = props;

  if (!cultures) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  const deleteCulture = async (culture: Culture) => {
    try {
      await Culture.delete(culture.name, token);
    } catch (err) {
      console.error("Failed to delete culture", err);
    }
    onRefresh();
  };

  return (
    <View>
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
                  {token !== "" && (
                    <IconButton
                      icon="delete"
                      onPress={() => deleteCulture(item)}
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
