import React, { useState } from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";

import { ActivityIndicator } from "react-native-paper";

import { GeneralInsight } from "../../lib";

const Styles = StyleSheet.create({
  spinner: { top: "50%", position: "relative" },
});

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
export default function Insights(props: InsightProps): React.ReactElement {
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
