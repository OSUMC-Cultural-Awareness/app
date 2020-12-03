import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";

import { List, Button, IconButton } from "react-native-paper";
// is importing Dayjs really worth it for something as simple as relative times?
// Not sure, but it's the easiest thing to do and is well maintained.
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Ledger } from "../../lib";
import styles from "./styles";

dayjs.extend(relativeTime);

type Props = {
  // Callback fired when "Update All" is pressed.
  onUpdateFinish: (err: string | null) => void;
};

/**
 * DownloadedCultures displays downloaded Cultures, allowing users to update all of them
 * or delete individual ones.
 *
 * @returns {React.ReactElement}
 */
export default function DownloadedCultures(props: Props): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const [ledger, setLedger] = useState<Map<string, number>>(new Map());

  const fetchLedger = async () => {
    let ledger: Map<string, number>;
    try {
      ledger = await Ledger.list();
    } catch (err) {
      console.error("Failed to load ledger", err);
      return;
    }

    if (!ledger) {
      return;
    }

    setLedger(ledger);
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLedger(new Map(ledger.entries()));
    }, 60000);
    return () => clearInterval(timer);
  });

  const ledgerArray = Array.from(ledger.entries());

  const DownloadedCulture = (props: { item: [string, number] }) => {
    const { item } = props;
    const [name, modified] = item;

    const remove = async (name: string) => {
      ledger.delete(name);

      try {
        await Ledger.remove(name);
      } catch (err) {
        console.error("Failed to remove downloaded culture: ", err);
        return;
      }

      setLedger(new Map(ledger.entries()));
    };

    return (
      <List.Item
        title={name}
        description={`Last modified ${dayjs().to(dayjs.unix(modified))}`}
        right={(props) => (
          <IconButton {...props} icon="delete" onPress={() => remove(name)} />
        )}
      />
    );
  };

  const update = async () => {
    try {
      await Ledger.update();
      fetchLedger();
      props.onUpdateFinish(null);
    } catch (err) {
      props.onUpdateFinish(err.toString());
      console.error("Failed to update downloaded cultures: ", err);
    }
  };

  if (ledger.size === 0) {
    return null;
  }

  return (
    <View>
      <List.Accordion
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        title="Downloaded Cultures"
        left={(props) => (
          <List.Icon {...props} icon="download" style={styles.leftIcon} />
        )}
      >
        <FlatList
          data={ledgerArray}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={DownloadedCulture}
        />
      </List.Accordion>
      {expanded && (
        <Button mode="contained" onPress={() => update()}>
          Update All
        </Button>
      )}
    </View>
  );
}
