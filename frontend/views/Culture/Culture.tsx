import React, { useState, useEffect } from "react";
import { View } from "react-native";

import {
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { connect } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ActivityIndicator, List, Button, Snackbar } from "react-native-paper";

import EditFAB from "./EditFab";
import InsightCard from "./InsightCard";
import Insights from "./Insights";
import ToolsFAB from "./ToolsFAB";
import Styles from "./style";

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
  const [msg, setMsg] = useState<string>("");
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
      culture.specializedInsights,
      culture.modified
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
      // TODO: better error messages
      //
      // Error messages currently are cryptic ie: "Not Enough Segments" -- referring to JWT.
      setMsg(err.toString());
      console.error(err);
    }
    setEditing(!editing);
  };

  const hideSnackbar = () => setMsg("");

  if (!culture) {
    return (
      <ActivityIndicator animating={true} size="large" style={Styles.spinner} />
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
    switch (getFocusedRouteNameFromRoute(route) ?? "general") {
      case "general":
        culture.generalInsights.push(ExampleInsight);
        break;
      case "specialized":
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
      <Tab.Navigator initialRouteName="general">
        <Tab.Screen name="general">
          {() => (
            <Insights
              renderItem={(row: { item: GeneralInsight; index: number }) =>
                InsightCardView(row.item, row.index)
              }
              onRefresh={() => fetchCulture()}
              insights={culture.generalInsights}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="specialized">
          {() => (
            <Insights
              insights={Array.from(culture.specializedInsights.entries())}
              onRefresh={() => fetchCulture()}
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
      {token !== "" && (
        <View>
          {editing ? (
            <ToolsFAB
              onSave={() => updateCulture()}
              onAdd={addInsightOrCategory}
            />
          ) : (
            <EditFAB onPress={() => setEditing(!editing)} />
          )}
        </View>
      )}
      <Snackbar
        visible={msg !== ""}
        onDismiss={hideSnackbar}
        action={{
          label: "Hide",
          onPress: hideSnackbar,
        }}
      >
        {msg}
      </Snackbar>
    </View>
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
