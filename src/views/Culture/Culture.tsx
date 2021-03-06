import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Alert, Platform } from "react-native";

import {
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { connect } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  ActivityIndicator,
  List,
  Button,
  Snackbar,
  Portal,
  Banner,
  FAB,
} from "react-native-paper";

import InsightCard, { Action } from "./InsightCard";
import Insights from "./Insights";
import ToolsFAB from "./ToolsFAB";
import Header from "../Header";
import styles from "./style";

import { Culture, GeneralInsight, SpecializedInsight, Ledger } from "../../lib";

import { Routes } from "../../routes";
import { Store } from "../../redux";

type Props = {
  navigation: StackNavigationProp<Routes, "Culture">;
  route: RouteProp<Routes, "Culture">;
  token: string;
};

type TabProps = {
  general: { insights: GeneralInsight[] };
  specialized: { insights: SpecializedInsight };
};

const Tab = createMaterialTopTabNavigator<TabProps>();

const ExampleInsight = {
  summary: "summary",
  information: "information",
  source: { data: "www.example.com", type: "link" },
};

const adminNewCultureBanner = `Welcome to a brand new Culture!

1. To add a new insight hit the tool button
2. To edit an insight click on it
3. Don't forget to save!
`;

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
  const navigation = props.navigation;

  const [culture, setCulture] = useState<Culture | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [banner, setBanner] = useState(false);
  const [dirty, setDirty] = useState(
    props.route.params ? props.route.params.dirty : false
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const route = useRoute();

  useLayoutEffect(() => {
    const header = Header({
      title: cultureName,
      searchQuery: searchQuery,
      showSearch: showSearch,
      onSearchChange: (text: string) => setSearchQuery(text),
      onSearchStart: () => setShowSearch(true),
      onCancel: () => setShowSearch(false),
    });

    navigation.setOptions(header({ navigation }));
  }, [navigation, showSearch, searchQuery, cultureName]);

  useEffect(() => {
    fetchCulture();
  }, []);

  // Prevent leaving with unsaved changes
  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        const unsaved = dirty || props.route.params.dirty;

        if (!unsaved) {
          return;
        }

        e.preventDefault();

        if (Platform.OS === "web") {
          // HACK: Use Web Confirmation when on Web Platform.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const leave = confirm(
            "You have unsaved changes. Are you sure you want to discard them and leave the screen?"
          );

          if (leave) {
            navigation.dispatch(e.data.action);
          }
        } else {
          Alert.alert(
            "Discard changes?",
            "You have unsaved changes. Are you sure you want to discard them and leave the screen?",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => e.preventDefault(),
              },
              {
                text: "Discard",
                style: "destructive",
                onPress: () => navigation.dispatch(e.data.action),
              },
            ],
            { cancelable: false }
          );
        }
      }),
    [navigation, dirty]
  );

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
      culture.specializedInsights,
      culture.modified
    );

    setDirty(true);
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
        if (!token) {
          // TODO: Display Magical Unicorn Culture
          props.navigation.navigate("Home");
        } else {
          setBanner(true);
          setEditing(true);
          setCulture(new Culture(cultureName, [], new Map(), Date.now()));
        }
      }
    }
  };

  /**
   * Update a culture's information in the Api
   */
  const updateCulture = async (): Promise<void> => {
    try {
      await culture.update(token, props.route.params.prevName);
      setCultureInPlace(culture);
      setDirty(false);
      navigation.setParams({
        cultureName: cultureName,
        dirty: false,
        prevName: props.route.params.prevName,
      });
    } catch (err) {
      // TODO: better error messages
      //
      // Error messages currently are cryptic ie: "Not Enough Segments" -- referring to JWT.
      setMsg(err.toString());
      console.error(err);
    }
    setEditing(!editing);
  };

  const hideSnackbar = () => setMsg("");

  const onCardAction = (action: Action) => {
    if (action === "copy") {
      setMsg("Link copied!");
      return;
    }

    switch (action.type) {
      case "open":
        setMsg(`Opening ${action.link}`);
        break;
      case "delete":
        setMsg(`Deleting ${action.summary}`);
    }
  };

  if (!culture) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  /**
   * Delete an insight from a list
   *
   * @param {number | [string, number]} index of insight to delete
   */
  const deleteInsight = (index: number | [string, number]) => {
    if (index instanceof Array) {
      const [key, i] = index;
      const val = culture.specializedInsights.get(key);
      val.splice(i, 1);

      culture.specializedInsights.set(key, val);

      if (val.length === 0) {
        culture.specializedInsights.delete(key);
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
    switch (getFocusedRouteNameFromRoute(route) ?? "general") {
      case "general":
        culture.generalInsights.push(ExampleInsight);
        break;
      case "specialized":
        culture.specializedInsights.set("Specialized Insight", [
          ExampleInsight,
        ]);
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
    culture.specializedInsights.set(key, [
      ...culture.specializedInsights.get(key),
      ExampleInsight,
    ]);

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
        onAction={onCardAction}
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

  const generalResults = generalInsightResults(
    culture.generalInsights,
    searchQuery
  );

  const specializedResults = specializedInsightResults(
    culture.specializedInsights,
    searchQuery
  );

  return (
    <View style={styles.view}>
      {token !== "" && (
        <Banner
          icon="alert"
          visible={banner}
          actions={[{ label: "Ok", onPress: () => setBanner(false) }]}
        >
          {adminNewCultureBanner}
        </Banner>
      )}
      <Tab.Navigator initialRouteName="general">
        <Tab.Screen name="general">
          {() => (
            <Insights
              renderItem={(row: { item: GeneralInsight; index: number }) =>
                InsightCardView(row.item, row.index)
              }
              onRefresh={() => {
                fetchCulture();
                setDirty(false);
              }}
              insights={generalResults}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="specialized">
          {() => (
            <Insights
              insights={specializedResults}
              onRefresh={() => {
                fetchCulture();
                setDirty(false);
              }}
              renderItem={(row: {
                item: [string, GeneralInsight[]];
                index: number;
              }) => {
                const [title, insights] = row.item;
                return (
                  <List.Accordion title={title} id={row.index}>
                    {insights.map((item: GeneralInsight, index: number) =>
                      InsightCardView(item, [title, index])
                    )}
                    {editing && (
                      <Button
                        icon="plus"
                        onPress={() => addSpecializedInsight(title)}
                        mode="contained"
                        style={styles.specialAddInsight}
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
      {token !== "" && editing && (
        <ToolsFAB onSave={() => updateCulture()} onAdd={addInsightOrCategory} />
      )}
      {token !== "" && !editing && (
        <FAB.Group
          icon="pencil"
          style={styles.fab}
          open={false}
          onPress={() => setEditing(!editing)}
          visible={true}
          actions={[]}
          onStateChange={() => setEditing(!editing)}
        />
      )}
      <Portal>
        <Snackbar
          visible={msg !== ""}
          onDismiss={hideSnackbar}
          action={{
            label: "Ok",
            onPress: hideSnackbar,
          }}
        >
          {msg}
        </Snackbar>
      </Portal>
    </View>
  );
}

/**
 * Filers generalInsights based on search query.
 *
 * @param {GeneralInsight[]} insights
 * @param {string} search query
 *
 * @returns filtered general insights
 */
function generalInsightResults(
  insights: GeneralInsight[],
  searchQuery: string
): GeneralInsight[] {
  return insights.filter((insight) => {
    if (!searchQuery) {
      return true;
    }

    const content = (insight.summary + insight.information).toLowerCase();
    const query = searchQuery.toLowerCase();

    return content.includes(query);
  });
}

/**
 * Filters specializedInsights based on search query.
 *
 * @param {Map<string, GeneralInsight[]>} Specialized Insights
 * @param {string} query
 *
 * @returns {[string, GeneralInsight[]][]} filtered specialized insights
 */
function specializedInsightResults(
  specialized: Map<string, GeneralInsight[]>,
  query: string
): [string, GeneralInsight[]][] {
  const specArray = Array.from(specialized.entries());
  const matched: [string, GeneralInsight[]][] = specArray.map(
    ([category, insights]) => {
      if (!query) {
        return [category, insights];
      }

      const filtered: GeneralInsight[] = insights.filter((insight) => {
        if (!query) {
          return true;
        }
        const content = (insight.summary + insight.information).toLowerCase();
        const q = query.toLowerCase();

        return content.includes(q);
      });

      return [category, filtered];
    }
  );

  return matched.filter((topic) => topic[1].length !== 0);
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
