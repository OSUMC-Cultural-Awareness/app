import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActivityIndicator, List, IconButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { Routes } from "../../routes";

import { Culture, Ledger } from "../../lib";

import styles from "./styles";

/**
 * Properties for {@link Cultures}
 */
type CultureProps = {
  navigation: StackNavigationProp<Routes, "Home">;
  token: string;
  readonly cultures: [string, number][];
  onRefresh: () => void;
  searchQuery?: string;
  offline: boolean;
  onMsg: (msg: string) => void;
};

/**
 * Component that displays a list of components of either {@link Cultures}
 *
 * @param {CultureProps} props
 * @returns {React.ReactElement} React component
 */
export default function Cultures(props: CultureProps): React.ReactElement {
  const { cultures, onRefresh, token, searchQuery, offline, onMsg } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [ledger, setLedger] = useState(new Map());

  const loadLedger = async () => {
    try {
      const ledger = await Ledger.list();
      setLedger(ledger);
    } catch (err) {
      onMsg(err.toString());
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadLedger();
    }, [])
  );

  if (!cultures) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  const onDelete = async (name: string) => {
    try {
      await Culture.delete(name, token);
    } catch (err) {
      onMsg(err.toString());
      console.error("Failed to delete culture", err);
    }
    onRefresh();
  };

  const onDownload = async (name: string) => {
    try {
      await Ledger.add(name);
      loadLedger();
      onMsg(`Downloaded ${name}`);
    } catch (err) {
      onMsg(err.toString());
    }
  };

  const searchResults = (): [string, number][] => {
    return cultures.filter((culture) => {
      const [name] = culture;
      if (!searchQuery) {
        return true;
      }

      const nameLower = name.toLowerCase();
      const query = searchQuery.toLowerCase();

      return nameLower.includes(query);
    });
  };

  const results = searchResults();

  return (
    <View>
      <FlatList
        data={results}
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
                <View style={styles.cultureListActions}>
                  {!offline && !ledger.has(name) && (
                    <IconButton
                      icon="download"
                      onPress={() => onDownload(name)}
                    />
                  )}
                  {token !== "" && (
                    <IconButton icon="delete" onPress={() => onDelete(name)} />
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
