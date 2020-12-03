import React, { useState, useLayoutEffect } from "react";
import { View, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActivityIndicator, List, IconButton } from "react-native-paper";

import { Routes } from "../../routes";

import { Culture, Ledger } from "../../lib";

import Header from "../Header";
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
  const { cultures, onRefresh, token, navigation } = props;
  const [searchQuery, setSearchQuery] = useState(undefined);
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    const header = Header({
      title: "Cultural Awareness",
      searchQuery: searchQuery,
      showSearch: showSearch,
      onSearchChange: (text: string) => setSearchQuery(text),
      onSearchStart: () => setShowSearch(true),
      onCancel: () => setShowSearch(false),
    });

    navigation.setOptions(header({ navigation }));
  }, [navigation, showSearch, searchQuery]);

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

  const searchResults = (): Culture[] => {
    return cultures.filter((culture) => {
      if (!searchQuery) {
        return true;
      }

      const name = culture.name.toLowerCase();
      const query = searchQuery.toLowerCase();

      return name.includes(query);
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
