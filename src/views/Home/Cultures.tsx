import React, { useState } from "react";
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
  cultures: IterableIterator<[string, number]>;
  onRefresh: () => void;
  searchQuery?: string;
  offline: boolean;
};

/**
 * Component that displays a list of components of either {@link Cultures}
 *
 * @param {CultureProps} props
 * @returns {React.ReactElement} React component
 */
export default function Cultures(props: CultureProps): React.ReactElement {
  const { cultures, onRefresh, token, searchQuery, offline } = props;
  const [refreshing, setRefreshing] = useState(false);

  if (!cultures) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  const deleteCulture = async (name: string) => {
    try {
      await Culture.delete(name, token);
    } catch (err) {
      console.error("Failed to delete culture", err);
    }
    onRefresh();
  };

  const searchResults = (): [string, number][] => {
    return Array.from(cultures).filter((culture) => {
      const [name] = culture;
      if (!searchQuery) {
        return true;
      }

      const nameLower = name.toLowerCase();
      const query = searchQuery.toLowerCase();

      return nameLower.includes(query);
    });
  };

  return (
    <View>
      <FlatList
        data={searchResults()}
        keyExtractor={(_, index) => index.toString()}
        onRefresh={() => {
          setRefreshing(true);
          onRefresh();
          setRefreshing(false);
        }}
        refreshing={refreshing}
        renderItem={({ item }) => {
          const [name] = item;
          return (
            <List.Item
              title={name}
              onPress={() =>
                props.navigation.navigate("Culture", { cultureName: name })
              }
              right={() => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  {!offline && (
                    <IconButton
                      icon="download"
                      onPress={() => Ledger.add(name)}
                    />
                  )}
                  {token !== "" && (
                    <IconButton
                      icon="delete"
                      onPress={() => deleteCulture(name)}
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
