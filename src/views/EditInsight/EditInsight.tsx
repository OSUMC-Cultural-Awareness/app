import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import {
  FAB,
  TextInput,
  Divider,
  RadioButton,
  Portal,
  Title,
} from "react-native-paper";

import { GeneralInsight } from "../../lib";

import { Routes } from "../../routes";

type Props = {
  navigation: StackNavigationProp<Routes, "EditInsight">;
  route: RouteProp<Routes, "EditInsight">;
};

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: "space-evenly", overflow: "hidden" },

  fab: { position: "absolute", bottom: 0, right: 0, margin: 16 },

  input: {
    paddingHorizontal: 10,
    margin: 5,
  },
});

/**
 * EditInsight displays information for a particular insight and allows editing it.
 * Upon hitting the {@link FAB} it will bring the user back to {@Link CultureView}
 * in order to save the changes to the database.
 *
 * Admin:
 *   Admin ONLY screen
 *
 * @param {Props} props: properties to pass to {@link EditInsight}
 *
 * @returns {React.ReactElement} React Element
 */
export default function EditInsight(props: Props): React.ReactElement {
  const index = props.route.params.index;
  let { culture } = props.route.params;

  const isSpecialized: boolean = index instanceof Array;

  const insight: GeneralInsight =
    index instanceof Array
      ? culture.specializedInsights.get(index[0])[index[1]]
      : culture.generalInsights[index];
  const category: string = index instanceof Array ? index[0] : "";

  useEffect(() => props.navigation.setOptions({ title: insight.summary }), []);

  const [title, setTitle] = useState<string>(category);
  const [summary, setSummary] = useState<string>(insight.summary);
  const [info, setInfo] = useState<string>(insight.information);
  const [srcData, setSrcData] = useState<string>(insight.source.data);
  const [srcType, setSrcType] = useState<string>(insight.source.type);
  const [cultureName, setCultureName] = useState<string>(culture.name);

  /**
   * updateCulture updates the Culture's insight for either Specialized or General
   * screens.
   */
  const updateCulture = () => {
    const newInsight = {
      summary: summary,
      information: info,
      source: {
        data: srcData,
        type: srcType,
      },
    };

    if (index instanceof Array) {
      const [key, i] = index;

      let specialized = culture.specializedInsights.get(key);
      specialized[i] = newInsight;

      if (title !== index[0]) {
        culture.specializedInsights.delete(key);
        culture.specializedInsights.set(title, specialized);
      }
    } else {
      culture.generalInsights[index] = newInsight;
    }

    // set dirty if any changes have been made.
    const prevName = culture.name;
    const dirty =
      category !== title ||
      summary !== insight.summary ||
      info !== insight.information ||
      srcData !== insight.source.data ||
      srcType !== insight.source.type ||
      cultureName !== prevName;

    culture.name = cultureName;

    props.navigation.navigate("Culture", {
      cultureName: culture.name,
      prevName: prevName,
      dirty: dirty,
    });
  };

  return (
    <SafeAreaView style={styles.view}>
      <TextInput
        style={styles.input}
        value={cultureName}
        placeholder="Culture Name"
        label="Culture Name"
        mode="outlined"
        onChangeText={(text) => setCultureName(text)}
      />
      {isSpecialized && (
        <TextInput
          style={styles.input}
          value={title}
          placeholder="Title"
          label="Title"
          mode="outlined"
          onChangeText={(text) => setTitle(text)}
        />
      )}
      {isSpecialized && <Divider />}
      <TextInput
        style={styles.input}
        value={summary}
        placeholder="Summary"
        label="Summary"
        mode="outlined"
        left={<TextInput.Icon name="text-short" />}
        onChangeText={(text) => setSummary(text)}
      />
      <TextInput
        style={styles.input}
        value={info}
        mode="outlined"
        placeholder="Description"
        label="Description"
        left={<TextInput.Icon name="text-subject" />}
        numberOfLines={5}
        onChangeText={(text) => setInfo(text)}
        multiline={true}
      />
      <Divider />
      <Title style={{ margin: 10 }}>Source Type</Title>
      <RadioButton.Group
        onValueChange={(value) => setSrcType(value)}
        value={srcType}
      >
        <RadioButton.Item label="Link" value="link" />
      </RadioButton.Group>
      <Divider />
      <TextInput
        style={styles.input}
        value={srcData}
        label="Source"
        placeholder="Source Information"
        left={<TextInput.Icon name="book" />}
        mode="outlined"
        onChangeText={(text) => setSrcData(text)}
      />
      <Portal>
        <FAB style={styles.fab} icon="check" onPress={updateCulture} />
      </Portal>
    </SafeAreaView>
  );
}
