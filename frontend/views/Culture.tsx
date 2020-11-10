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
} from "react-native-paper";

import { Culture, GeneralInsight, SpecializedInsight } from "../api/culture";
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

  useEffect(() => {
    props.navigation.setOptions({ title: cultureName });
  }, []);

  useEffect(() => {
    const fetchCulture = async (): Promise<void> => {
      const culture = await Culture.get(cultureName);
      console.log(culture);
      setCulture(culture);
    };

    fetchCulture();
  }, []);

  if (!culture) {
    return (
      <ActivityIndicator animating={true} size="large" style={Styles.spinner} />
    );
  }

  return (
    <SafeAreaView style={Styles.view}>
      <Tab.Navigator initialRouteName="General">
        <Tab.Screen name="General">
          {() => <GeneralInsightsView insights={culture.generalInsights} />}
        </Tab.Screen>
        <Tab.Screen name="Specialized">
          {() => (
            <SpecializedInsightView insights={culture.specializedInsights} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {editing ? (
        <ToolsFAB
          onSave={() => setEditing(!editing)}
          onAdd={() => console.log("On Add")}
        />
      ) : (
        <EditFAB onPress={() => setEditing(!editing)} />
      )}
    </SafeAreaView>
  );
}

function GeneralInsightsView(props: { insights: GeneralInsight[] }) {
  const { insights } = props;

  if (!insights) {
    return (
      <ActivityIndicator animating={true} size="large" style={Styles.spinner} />
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={insights}
        keyExtractor={(item) => item.text}
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
      />
    </SafeAreaView>
  );
}

function SpecializedInsightView(props: { insights: SpecializedInsight }) {
  const { insights } = props;

  if (!insights) {
    return (
      <ActivityIndicator animating={true} size="large" style={Styles.spinner} />
    );
  }

  // FIXME: this is ugly, but whenever compiling the Map it just gets
  // turned into an Object that doesn't have the properties `entries` nor `forEach` which is part of the specification.
  //
  // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  const mapToArray = (
    map: SpecializedInsight
  ): [string, GeneralInsight[]][] => {
    let ret = [];

    for (let key in map) {
      ret.push([key, map[key]]);
    }

    return ret;
  };

  return (
    <SafeAreaView>
      {mapToArray(insights).map(([key, value]) => {
        return (
          <List.Accordion title={key}>
            {value.map((item) => (
              <Card.Content>
                <Title>{item.source}</Title>
                <Paragraph>{item.text}</Paragraph>
              </Card.Content>
            ))}
          </List.Accordion>
        );
      })}
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
