import React, { useState } from "react";
import { FlatList, SafeAreaView } from "react-native";

import { ActivityIndicator } from "react-native-paper";

import { GeneralInsight } from "../../lib";

import styles from "./style";

/**
 * Properties for {@link Insights}
 */
type InsightProps = {
  // callback called when the {@link FlatList} is refreshed
  onRefresh: () => void;
  // Insights to render
  insights: [string, GeneralInsight[]][] | GeneralInsight[];
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
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  const refresh = () => {
    setRefreshing(true);
    onRefresh();
    setRefreshing(false);
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
