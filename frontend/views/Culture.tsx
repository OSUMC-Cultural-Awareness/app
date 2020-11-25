import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Linking,
  // Clipboard is deprecated, but necessary because of incompatibility with Expo
  // See https://github.com/react-native-clipboard/clipboard/issues/71#issuecomment-701138494
  Clipboard,
} from "react-native";

import {
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { connect } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  Card,
  ActivityIndicator,
  IconButton,
  FAB,
  Divider,
  List,
  Paragraph,
  Button,
  Title,
  Snackbar,
  Menu,
} from "react-native-paper";

import {
  Culture,
  GeneralInsight,
  SpecializedInsight,
  specializedToArray,
  Ledger,
} from "../api";

import { Routes } from "../routes";
import { Store } from "../redux";

type Props = {
  navigation: StackNavigationProp<Routes, "Culture">;
  route: RouteProp<Routes, "Culture">;
  token: string;
};

type TabProps = {
  General: { insights: GeneralInsight[] };
  Specialized: { insights: SpecializedInsight };
};

const Tab = createMaterialTopTabNavigator<TabProps>();

const Styles = StyleSheet.create({
  spinner: { top: "50%", position: "relative" },

  fab: {
    // TODO: Emulate Fixed for the Floating Action Button
  },

  card: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },

  editInput: {
    width: "100%",
  },

  specialAddInsight: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
});

const ExampleInsight = {
  summary: "summary",
  information: "information",
  source: { data: "www.example.com", type: "link" },
};

/**
 * CultureView displays information about a specific culture. The name of the culture
 * to query the API for is specified in `props.route.params`.
 *
 * Admin:
 *   This route allows editing and creating insights about the particular culture.
 *
 * @param: props: properties to pass to CultureView
 *
 * @returns React Element
 */
function CultureView(props: Props): React.ReactElement {
  const cultureName = props.route.params ? props.route.params.cultureName : "";
  const token = props.token || "";

  let [culture, setCulture] = useState<Culture | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const [showErr, setShowErr] = useState<boolean>(false);
  const route = useRoute();

  useEffect(() => props.navigation.setOptions({ title: cultureName }), []);
  useEffect(() => {
    fetchCulture();
  }, []);

  /**
   * Updates the Culture in place by calling `setCulture`.
   *
   * @param {Culture} culture to update CultureView with.
   *
   * HACK: As a result of how useState works it creates a new object and moves all the values over
   * rather than something as simple as setCulture, this is because React checks differences of objects shallowly.
   */
  const setCultureInPlace = (culture: Culture) => {
    const newCulture = new Culture(
      culture.name,
      culture.generalInsights,
      culture.specializedInsights
    );

    setCulture(newCulture);
  };

  /**
   * Fetch culture information from Api or fallback to downloaded information
   */
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
        props.navigation.navigate("Home");
      }
    }
  };

  /**
   * Update a culture's information in the Api
   */
  const updateCulture = async (): Promise<void> => {
    try {
      await culture.update(token);
      setCultureInPlace(culture);
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

  let specInsights = specializedToArray(culture.specializedInsights);

  /**
   * Delete an insight from a list
   *
   * @param {number | [string, number]} index of insight to delete
   */
  const deleteInsight = (index: number | [string, number]) => {
    if (index instanceof Array) {
      const [key, i] = index;
      culture.specializedInsights[key].splice(i, 1);

      if (culture.specializedInsights[key].length === 0) {
        delete culture.specializedInsights[key];
      }
    } else {
      culture.generalInsights.splice(index, 1);
    }

    setCultureInPlace(culture);
  };

  /**
   * Add an insight to either the General or Specialized tab
   */
  const addInsightOrCategory = () => {
    switch (getFocusedRouteNameFromRoute(route) ?? "General") {
      case "General":
        culture.generalInsights.push(ExampleInsight);
        break;
      case "Specialized":
        culture.specializedInsights["Specialized Insight"] = [ExampleInsight];
        break;
    }

    setCultureInPlace(culture);
  };

  /**
   * addSpecializedInsight adds an insight to a category of SpecializedInsight
   *
   * @param {string} key of specializedInsight
   */
  const addSpecializedInsight = (key: string) => {
    culture.specializedInsights[key].push(ExampleInsight);

    setCultureInPlace(culture);
  };

  /**
   * Renders a InsightCard
   *
   * @param {GeneralInsight} insight to render
   * @param {number | [string, number]} index of insight
   *
   * @returns {React.ReactElement} React Component
   */
  const InsightCardView = (
    insight: GeneralInsight,
    index: number | [string, number]
  ): React.ReactElement => {
    return (
      <InsightCard
        key={`insight-card-${index.toString()}`}
        index={index}
        editing={editing}
        insight={insight}
        onPress={(index) =>
          props.navigation.navigate("EditInsight", {
            culture: culture,
            index: index,
          })
        }
        onDelete={deleteInsight}
      />
    );
  };

  return (
    <View>
      <Tab.Navigator initialRouteName="General">
        <Tab.Screen name="General">
          {() => (
            <Insights
              renderItem={(row: { item: GeneralInsight; index: number }) =>
                InsightCardView(row.item, row.index)
              }
              onRefresh={async () => fetchCulture()}
              insights={culture.generalInsights}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Specialized">
          {() => (
            <Insights
              insights={specInsights}
              onRefresh={async () => fetchCulture()}
              renderItem={(row: {
                item: { text: string; insights: GeneralInsight[] };
                index: number;
              }) => {
                const { text, insights } = row.item;
                return (
                  <List.Accordion title={text} id={row.index}>
                    {insights.map((item: GeneralInsight, index: number) =>
                      InsightCardView(item, [text, index])
                    )}
                    {editing && (
                      <Button
                        icon="plus"
                        onPress={() => addSpecializedInsight(text)}
                        mode="contained"
                        style={Styles.specialAddInsight}
                      >
                        {""}
                      </Button>
                    )}
                  </List.Accordion>
                );
              }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <>
        {token &&
          (editing ? (
            <ToolsFAB
              onSave={() => updateCulture()}
              onAdd={addInsightOrCategory}
            />
          ) : (
            <EditFAB onPress={() => setEditing(!editing)} />
          ))}
      </>
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
 * @returns {React.ReactElement} React component
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
      style={Styles.fab}
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
 * @returns {React.ReactElement} React component
 */
function ToolsFAB(props: ToolsFABProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <FAB.Group
      visible={true}
      style={Styles.fab}
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
  key: string;
  // Insight to display on card
  insight: GeneralInsight;
  // editing whether the admin is editing the current page
  editing: boolean;
  // index in the list of General or Specialized lists
  index: number | [string, number];
  // callback to be used when an insight is deleted
  onDelete: (index: number | [string, number]) => void;
  // callback to be used when an insight is pressed
  onPress: (index: number | [string, number]) => void;
};

/**
 * InsightCard card to display information about an Insight
 *
 * @param {InsightCardProps} props
 * @returns {React.ReactElement} React component
 */
function InsightCard(props: InsightCardProps): React.ReactElement {
  const { insight, index, editing, onPress } = props;
  const [showMenu, setShowMenu] = useState(false);
  const link = insight.source.data;

  return (
    <Card style={Styles.card} onPress={() => editing && onPress(index)}>
      <Card.Content>
        <Title>{insight.summary}</Title>
        <Paragraph>{insight.information}</Paragraph>
      </Card.Content>
      <Card.Actions>
        {link && Linking.canOpenURL(link) && (
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor={
              <IconButton
                icon="link"
                size={20}
                onPress={() => setShowMenu(true)}
              />
            }
          >
            <Menu.Item
              title="Copy link"
              onPress={() => Clipboard.setString(link)}
            />
            <Divider />
            <Menu.Item
              title="Open link"
              onPress={() => Linking.openURL(link)}
            />
          </Menu>
        )}
        {editing && (
          <IconButton
            icon="delete"
            size={20}
            onPress={() => props.onDelete(index)}
          />
        )}
      </Card.Actions>
    </Card>
  );
}

export default connect(
  (
    state: Store,
    ownProps: {
      navigation: StackNavigationProp<Routes, "Culture">;
      route: RouteProp<Routes, "Culture">;
    }
  ) => ({
    token: state.user.token,
    navigation: ownProps.navigation,
    route: ownProps.route,
  }),
  null
)(CultureView);
