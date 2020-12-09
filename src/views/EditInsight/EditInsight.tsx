import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import {
  FAB,
  TextInput,
  Divider,
  RadioButton,
  HelperText,
  Portal,
  Title,
} from "react-native-paper";
import { useFormik } from "formik";

import { GeneralInsight, Culture } from "../../lib";

import { Routes } from "../../routes";
import { Fields, validator } from "./validation";

type Props = {
  navigation: StackNavigationProp<Routes, "EditInsight">;
  route: RouteProp<Routes, "EditInsight">;
};

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: "space-evenly", overflow: "hidden" },

  fab: { position: "absolute", alignSelf: "center", bottom: 0, margin: 16 },

  input: {
    paddingHorizontal: 10,
    margin: 5,
  },

  sourceTypeTitle: { margin: 10 },
});

const ExampleInsight = {
  summary: "summary",
  information: "information",
  source: { data: "www.example.com", type: "link" },
};

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
  const index = props.route.params ? props.route.params.index : 0;
  const culture = props.route.params
    ? props.route.params.culture
    : new Culture("Unknown", [ExampleInsight], new Map(), 0);

  const isSpecialized: boolean = index instanceof Array;

  const insight: GeneralInsight =
    index instanceof Array
      ? culture.specializedInsights.get(index[0])[index[1]]
      : culture.generalInsights[index];
  const category: string = index instanceof Array ? index[0] : "";

  useEffect(
    () => props.navigation.setOptions({ title: insight.summary || "Unknown" }),
    []
  );

  const initialValues: Fields = {
    cultureName: culture.name,
    title: category,
    summary: insight.summary,
    description: insight.information,
    source: insight.source.data,
    sourceType: insight.source.type,
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    validationSchema: validator(isSpecialized ? "specialized" : "general"),
    initialValues: initialValues,
    onSubmit: (values) => updateCulture(values),
  });

  /**
   * updateCulture updates the Culture's insight for either Specialized or General
   * screens.
   */
  const updateCulture = async (values: Fields) => {
    const {
      cultureName,
      title,
      summary,
      description,
      source,
      sourceType,
    } = values;

    const newInsight = {
      summary: summary,
      information: description,
      source: {
        data: source,
        type: sourceType,
      },
    };

    if (index instanceof Array) {
      const [key, i] = index;

      const specialized = culture.specializedInsights.get(key);
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
      description !== insight.information ||
      source !== insight.source.data ||
      sourceType !== insight.source.type ||
      cultureName !== prevName;

    culture.name = cultureName;

    props.navigation.navigate("Culture", {
      cultureName: culture.name,
      prevName: prevName,
      dirty: dirty,
    });
  };

  // focus the next input
  const nextInput = (ref: React.MutableRefObject<any>) => {
    if (!ref) {
      return;
    }

    ref.current.focus();
  };

  const cultureName = useRef();
  const title = useRef();
  const summary = useRef();
  const description = useRef();
  const source = useRef();

  return (
    <View style={styles.view}>
      <View>
        <TextInput
          style={styles.input}
          value={values.cultureName}
          onBlur={handleBlur("cultureName")}
          onSubmitEditing={() => nextInput(isSpecialized ? title : summary)}
          ref={cultureName}
          placeholder="Culture Name"
          returnKeyType="next"
          label="Culture Name"
          mode="outlined"
          onChangeText={handleChange("cultureName")}
        />
        {errors.cultureName && touched.cultureName && (
          <HelperText type="error">{errors.cultureName}</HelperText>
        )}
      </View>
      {isSpecialized && (
        <View>
          <TextInput
            style={styles.input}
            value={values.title}
            placeholder="Title"
            onSubmitEditing={() => nextInput(summary)}
            returnKeyType="next"
            ref={title}
            label="Title"
            mode="outlined"
            onChangeText={handleChange("title")}
          />
          {errors.title && touched.title && (
            <HelperText type="error">{errors.title}</HelperText>
          )}
        </View>
      )}
      {isSpecialized && <Divider />}
      <View>
        <TextInput
          style={styles.input}
          value={values.summary}
          onBlur={handleBlur("summary")}
          placeholder="Summary"
          onSubmitEditing={() => nextInput(description)}
          returnKeyType="next"
          ref={summary}
          label="Summary"
          mode="outlined"
          onChangeText={handleChange("summary")}
        />
        {errors.summary && touched.summary && (
          <HelperText type="error">{errors.summary}</HelperText>
        )}
      </View>
      <View>
        <TextInput
          style={styles.input}
          value={values.description}
          onBlur={handleBlur("description")}
          placeholder="Description"
          ref={description}
          returnKeyType="next"
          label="Description"
          mode="outlined"
          onChangeText={handleChange("description")}
          multiline={true}
          numberOfLines={5}
        />
        {errors.description && touched.description && (
          <HelperText type="error">{errors.description}</HelperText>
        )}
      </View>
      <Divider />
      <Title style={styles.sourceTypeTitle}>Source Type</Title>
      <RadioButton.Group
        onValueChange={handleChange("sourceType")}
        value={values.sourceType}
      >
        <RadioButton.Item label="Link" value="link" />
      </RadioButton.Group>
      <Divider />
      <View>
        <TextInput
          style={styles.input}
          value={values.source}
          onBlur={handleBlur("source")}
          placeholder="Source"
          onSubmitEditing={handleSubmit}
          ref={source}
          returnKeyType="next"
          label="Source"
          mode="outlined"
          onChangeText={handleChange("source")}
        />
        {errors.source && touched.source && (
          <HelperText type="error">{errors.source}</HelperText>
        )}
      </View>
      <Portal>
        <FAB style={styles.fab} icon="check" onPress={handleSubmit} />
      </Portal>
    </View>
  );
}
