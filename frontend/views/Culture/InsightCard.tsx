import React, { useState } from "react";
import {
  Linking,
  StyleSheet,
  // Clipboard is deprecated, but necessary because of incompatibility with Expo
  // See https://github.com/react-native-clipboard/clipboard/issues/71#issuecomment-701138494
  Clipboard,
} from "react-native";

import {
  Card,
  IconButton,
  Divider,
  Paragraph,
  Title,
  Menu,
} from "react-native-paper";

import { GeneralInsight } from "../../lib";

const Styles = StyleSheet.create({
  spinner: { top: "50%", position: "relative" },

  card: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
});

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
export default function InsightCard(
  props: InsightCardProps
): React.ReactElement {
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
