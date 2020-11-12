import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import {
  Card,
  ActivityIndicator,
  TextInput,
  FAB,
  List,
  Paragraph,
  Title,
  Snackbar,
} from "react-native-paper";

import {
  Culture,
  GeneralInsight,
  SpecializedInsight,
  specializedToArray,
} from "../api/culture";

import { Ledger } from "../api/ledger";
import { Routes } from "../routes";

type Props = {
  navigation: StackNavigationProp<Routes, "Culture">;
  route: RouteProp<Routes, "Culture">;
};

type TabProps = {
  General: { insights: GeneralInsight[] };
  Specialized: { insights: SpecializedInsight };
};

const Tab = createMaterialTopTabNavigator<TabProps>();

const Styles = StyleSheet.create({
  spinner: { top: "50%", position: "relative" },

  fab: {
    // TODO: this only works for Web need to better layout things to have a footer
    position: "fixed",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#1e88e5",
  },

  view: {
    height: "100%",
  },
});

/**
 * CultureView displays information about a specific culture. The name of the culture
 * to query the API for is specified in `props.route.params`.
 *
 * Admin:
 *   This route allows editing and creating insights about the particular culture.
 *
 * @param: props: properties to pass to CultureView
 *
 */
export function CultureView(props: Props): React.ReactElement {
  const { cultureName } = props.route.params;
  const [culture, setCulture] = useState<Culture | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const [showErr, setShowErr] = useState<boolean>(false);

  useEffect(() => props.navigation.setOptions({ title: cultureName }), []);
  useEffect(() => {
    fetchCulture();
  }, []);

  const fetchCulture = async (): Promise<void> => {
    try {
      const culture = await Culture.get(cultureName);
      setCulture(culture);
    } catch (err) {
      // Offline, try reading from storage
      try {
        const culture = await Ledger.read(cultureName);
        setCulture(culture);
      } catch (err) {
        console.error(err);
        // TODO: Display Magical Unicorn Culture
        props.navigation.goBack();
      }
    }
  };

  const updateCulture = async (): Promise<void> => {
    try {
      await culture.update("TODO: insert Admin token for updating");
    } catch (err) {
      setShowErr(true);
      // TODO: better error messages
      //
      // Error messages currently are cryptic ie: "Not Enough Segments" -- referring to JWT.
      setErr(err.toString());
      console.error(err);
    }
    setEditing(!editing);
  };

  const hideSnackbar = () => setShowErr(false);

  if (!culture) {
    return (
      <ActivityIndicator animating={true} size="large" style={Styles.spinner} />
    );
  }

  return (
    <SafeAreaView style={Styles.view}>
      <Tab.Navigator initialRouteName="General">
        <Tab.Screen name="General">
          {() => (
            <Insights
              renderItem={({ item }) => (
                <List.Item
                  title={
                    <TextInput
                      value={item.text}
                      style={{ width: "100%" }}
                      multiline={true}
                    />
                  }
                />
              )}
              onRefresh={async () => fetchCulture()}
              insights={culture.generalInsights}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Specialized">
          {() => (
            <Insights
              insights={specializedToArray(culture.specializedInsights)}
              onRefresh={async () => fetchCulture()}
              renderItem={({ item }) => {
                const { text, insights } = item;
                return (
                  <List.Accordion title={text}>
                    {insights.map((item: GeneralInsight) => (
                      <Card.Content>
                        <Title>{item.source}</Title>
                        <Paragraph>{item.text}</Paragraph>
                      </Card.Content>
                    ))}
                  </List.Accordion>
                );
              }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {editing ? (
        <ToolsFAB
          onSave={() => updateCulture()}
          onAdd={() => console.log("On Add")}
        />
      ) : (
        <EditFAB onPress={() => setEditing(!editing)} />
      )}

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
    </SafeAreaView>
  );
}

type InsightProps = {
  onRefresh: () => void;
  insights: { text: string; insights: GeneralInsight[] }[] | GeneralInsight[];
  renderItem: ({ item: any }) => React.ReactElement;
};

function Insights(props: InsightProps): React.ReactElement {
  const { insights, onRefresh, renderItem } = props;
  const [refreshing, setRefreshing] = useState(false);

  if (!insights) {
    return (
      <ActivityIndicator animating={true} size="large" style={Styles.spinner} />
    );
  }

  const refresh = () => {
    onRefresh();
    setRefreshing(true);
  };

  return (
    <SafeAreaView>
      <FlatList
        data={insights}
        keyExtractor={(item) => item.text}
        onRefresh={() => refresh()}
        refreshing={refreshing}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

/**
 * Properties for {@link EditFAB}
 */
type EditFABProps = {
  // onPress handles when the FAB is pressed.
  onPress: () => void;
};

/**
 * EditFAB displays a {@link FAB} that is labeled "edit" and has a pencil icon.
 *
 * @param {EditFABProps} props
 * @returns {React.ReactElement} React component
 */
function EditFAB(props: EditFABProps): React.ReactElement {
  return (
    <FAB
      icon="pencil"
      onPress={() => props.onPress()}
      label="edit"
      style={Styles.fab}
    />
  );
}

/**
 * Properties for {@link ToolsFAB}
 */
type ToolsFABProps = {
  // onSave function called when hitting the "save" button. This button should
  // toggle the whether this FAB is being displayed.
  onSave: () => void;
  // onAdd function called when hitting the "add" button.
  onAdd: () => void;
};

/**
 * ToolsFAB displays a {@link FAB.Group} that has two sub {@link FAB} one for editing and one for saving.
 *
 * @param {ToolsFABProps} props
 * @returns {React.ReactElement}
 */
function ToolsFAB(props: ToolsFABProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <FAB.Group
      visible={true}
      fabStyle={{ backgroundColor: "#1e88e5" }}
      open={open}
      icon={open ? "close" : "wrench"}
      actions={[
        { icon: "plus", onPress: () => props.onAdd() },
        { icon: "content-save", onPress: () => props.onSave() },
      ]}
      onStateChange={() => setOpen(!open)}
    />
  );
}
