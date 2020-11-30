import React from "react";

// Clipboard is deprecated, but necessary because of incompatibility with Expo
// See https://github.com/react-native-clipboard/clipboard/issues/71#issuecomment-701138494
import { Linking, Clipboard } from "react-native";

import { Card, IconButton, Paragraph, Title } from "react-native-paper";

import { GeneralInsight } from "../../lib";

import Styles from "./style";

export type Action =
  | "copy"
  | { type: "open"; link: string }
  | { type: "delete"; summary: string };

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
  // callback when an action is performed on an insight
  //
  // includes: Copying, Deleting, and Opening
  onAction: (action: Action) => void;
};

/**
 * InsightCard card to display information about an Insight
 *
 * @param {InsightCardProps} props
 * @returns {React.ReactElement} React component
 */
export default function InsightCard(
  props: InsightCardProps
): React.ReactElement {
  const { insight, index, editing, onPress, onAction } = props;
  const link = insight.source.data;

  return (
    <Card style={Styles.card} onPress={() => editing && onPress(index)}>
      <Card.Content>
        <Title>{insight.summary}</Title>
        <Paragraph>{insight.information}</Paragraph>
      </Card.Content>
      <Card.Actions>
        {link && Linking.canOpenURL(link) && (
          <IconButton
            icon="link"
            size={20}
            onPress={() => {
              onAction("copy");
              Clipboard.setString(link);
            }}
          />
        )}
        {link && Linking.canOpenURL(link) && (
          <IconButton
            icon="login-variant"
            size={20}
            onPress={() => {
              onAction({ type: "open", link: link });
              Linking.openURL(link);
            }}
          />
        )}
        {editing && (
          <IconButton
            icon="delete"
            size={20}
            onPress={() => {
              onAction({ type: "delete", summary: insight.summary });
              props.onDelete(index);
            }}
          />
        )}
      </Card.Actions>
    </Card>
  );
}
