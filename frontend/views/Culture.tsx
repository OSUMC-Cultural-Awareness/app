import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, SafeAreaView, View } from "react-native";

import {
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import {
  Card,
  ActivityIndicator,
  IconButton,
  FAB,
  List,
  Paragraph,
  TextInput,
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
    backgroundColor: "#1e88e5",
    position: "absolute",
    margin: 16,
    bottom: 0,
    right: 0,
  },

  view: {
    flex: 1,
  },

  card: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },

  editInput: {
    width: "100%",
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
  const route = useRoute();

  // Only used when editing
  let [newCulture, setNewCulture] = useState<Culture | null>(culture);

  useEffect(() => props.navigation.setOptions({ title: cultureName }), []);
  useEffect(() => {
    fetchCulture();
  }, []);

  /**
   * Fetch culture information from Api or fallback to downloaded information
   */
  const fetchCulture = async (): Promise<void> => {
    try {
      const culture = await Culture.get(cultureName);
      setCulture(culture);
      setNewCulture(culture);
    } catch (err) {
      // Offline, try reading from storage
      try {
        const culture = await Ledger.read(cultureName);
        setCulture(culture);
        setNewCulture(culture);
      } catch (err) {
        console.error(err);
        // TODO: Display Magical Unicorn Culture
        props.navigation.goBack();
      }
    }
  };

  /**
   * Update a culture's information in the Api
   */
  const updateCulture = async (): Promise<void> => {
    try {
      await culture.update("TODO: insert Admin token for updating");
      setCulture(newCulture);
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

  let specInsights: { text: string; insights: GeneralInsight[] }[];
  if (editing) {
    specInsights = specializedToArray(newCulture.specializedInsights);
  } else {
    specInsights = specializedToArray(culture.specializedInsights);
  }

  /**
   * Delete an insight from a list
   */
  const deleteInsight = (index: number | [string, number]) => {
    if (index instanceof Array) {
      const [key, i] = index;
      newCulture.specializedInsights[key].splice(i, 1);
    } else {
      newCulture.generalInsights.splice(index, 1);
    }

    setCulture(newCulture);
  };

  /**
   * Add an insight to either the General or Specialized tab
   */
  const addInsight = () => {
    switch (getFocusedRouteNameFromRoute(route) ?? "General") {
      case "General":
        newCulture.generalInsights.push({
          summary: "summary",
          information: "information",
          source: { data: "www.example.com", type: "link" },
        });
        break;
      case "Specialized":
        newCulture.specializedInsights["Specialized Insight"] = [];
    }

    setCulture(newCulture);
  };

  const editInsight = (
    index: number | [string, number],
    field: "Summary" | "Description",
    newText: string
  ) => {
    switch (field) {
      case "Summary":
        if (index instanceof Array) {
          const [key, i] = index;
          newCulture.specializedInsights[key][i].summary = newText;
        } else {
          newCulture.generalInsights[index].summary = newText;
        }
        break;
      case "Description":
        if (index instanceof Array) {
          const [key, i] = index;
          newCulture.generalInsights[key][i].information = newText;
        } else {
          newCulture.generalInsights[index].information = newText;
        }
        break;
    }

    setNewCulture(
      new Culture(
        newCulture.name,
        newCulture.generalInsights,
        newCulture.specializedInsights
      )
    );
  };

  return (
    <View style={Styles.view}>
      <Tab.Navigator initialRouteName="General">
        <Tab.Screen name="General">
          {() => (
            <Insights
              renderItem={({ item, index }) => (
                <InsightCard
                  index={index}
                  editing={editing}
                  insight={item}
                  onDelete={deleteInsight}
                  onEdit={editInsight}
                />
              )}
              onRefresh={async () => fetchCulture()}
              insights={
                editing ? newCulture.generalInsights : culture.generalInsights
              }
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Specialized">
          {() => (
            <Insights
              insights={specInsights}
              onRefresh={async () => fetchCulture()}
              renderItem={({ item }) => {
                const { text, insights } = item;
                return (
                  <List.Accordion title={text}>
                    {insights.map((item: GeneralInsight, index: number) => (
                      <InsightCard
                        insight={item}
                        index={[text, index]}
                        editing={editing}
                        onDelete={deleteInsight}
                        onEdit={editInsight}
                      />
                    ))}
                  </List.Accordion>
                );
              }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {editing ? (
        <ToolsFAB onSave={() => updateCulture()} onAdd={addInsight} />
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
    </View>
  );
}

/**
 * Properties for {@link Insights}
 */
type InsightProps = {
  // callback called when the {@link FlatList} is refreshed
  onRefresh: () => void;
  // Insights to render
  insights: { text: string; insights: GeneralInsight[] }[] | GeneralInsight[];
  // how to render the insights
  renderItem: ({ item: any }) => React.ReactElement;
};

/**
 * Component that displays a list of components of either {@link GeneralInsights}
 * or {{text: string, insights: GeneralInsight[]}[]}.
 *
 * @param {InsightProps} props
 * @returns {React.ReactElement}
 */
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
        keyExtractor={(_, index) => index.toString()}
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
    <FAB.Group
      fabStyle={{ backgroundColor: "#1e88e5" }}
      icon="pencil"
      open={false}
      onPress={() => props.onPress()}
      visible={true}
      actions={[]}
      onStateChange={() => props.onPress()}
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

/**
 * Properties for {@link InsightCard}
 */
type InsightCardProps = {
  // Insight to display on card
  insight: GeneralInsight;
  // editing whether the admin is editing the current page
  editing: boolean;
  // index in the list of General or Specialized lists
  index: number | [string, number];
  // callback to be used when an insight is deleted
  onDelete: (index: number | [string, number]) => void;

  // callback to be used when
  onEdit: (
    index: number | [string, number],
    field: "Summary" | "Description",
    newText: string
  ) => void;
  //onLink: (index: number | [string, number]) => void;
};

/**
 * InsightCard card to display information about an Insight
 *
 * @param {InsightCardProps} props
 * @returns {React.ReactElement}
 */
function InsightCard(props: InsightCardProps): React.ReactElement {
  const { insight, index, editing, onEdit } = props;

  return (
    <Card style={Styles.card}>
      <Card.Content>
        <Title>
          {editing ? (
            <TextInput
              style={Styles.editInput}
              value={insight.summary}
              label="Summary"
              onChangeText={(newText: string) =>
                onEdit(index, "Summary", newText)
              }
            />
          ) : (
            insight.summary
          )}
        </Title>
        <Paragraph>
          {editing ? (
            <TextInput
              style={Styles.editInput}
              value={insight.information}
              label="Description"
              multiline={true}
              onChangeText={(newText: string) =>
                onEdit(index, "Description", newText)
              }
            />
          ) : (
            insight.information
          )}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="link" size={20} />
        {editing ? (
          <IconButton
            icon="delete"
            size={20}
            onPress={() => props.onDelete(index)}
          />
        ) : null}
      </Card.Actions>
    </Card>
  );
}
