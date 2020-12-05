import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { View } from "react-native";

import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  Portal,
  Modal,
  Text,
  ActivityIndicator,
  TextInput,
  Button,
  FAB,
  Snackbar,
} from "react-native-paper";
import { useFormik } from "formik";

import { Store } from "../../redux";
import { Admin, Culture, OfflineError, Ledger } from "../../lib";
import { Routes } from "../../routes";

import Cultures from "./Cultures";
import Admins from "./Admins";
import styles from "./styles";
import Header from "../Header";
import { EmailValidation } from "./validation";

type Props = {
  navigation: StackNavigationProp<Routes, "Home">;
  route: RouteProp<Routes, "Home">;
  user: Admin;
  token: string;
  theme: string;
};

type TabProps = {
  Cultures: { cultures: Culture[] };
  Admins: { admins: Admin[] };
};

/**
 * Invite Email screen fields for Formik.
 */
type EmailField = {
  email: string;
};

/**
 * Initial values for email field for Formik.
 */
const initialValues: EmailField = {
  // This field could be updated with useEffect to enter the user's saved email address.
  email: "",
};

const Tab = createMaterialTopTabNavigator<TabProps>();

function Home(props: Props): React.ReactElement {
  const { token, route, navigation, user, theme } = props;

  const [cultures, setCultures] = useState<Map<string, number>>(null);
  const [admins, setAdmins] = useState(null);
  const [inviteModal, setInviteModal] = React.useState(false);
  const [msg, setMsg] = useState<string>("");
  const [offline, setOffline] = useState(false);

  const [searchQuery, setSearchQuery] = useState(undefined);
  const [showSearch, setShowSearch] = useState(false);

  useLayoutEffect(() => {
    const header = Header({
      title: "Cultural Awareness",
      searchQuery: searchQuery,
      showSearch: showSearch,
      onSearchChange: (text: string) => setSearchQuery(text),
      onSearchStart: () => setShowSearch(true),
      onCancel: () => setShowSearch(false),
    });

    navigation.setOptions(header({ navigation }));
  }, [navigation, showSearch, searchQuery]);

  const email = useRef();

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    validateField,
  } = useFormik({
    validationSchema: EmailValidation,
    initialValues: initialValues,
    onSubmit: (values) => invite(values),
  });

  const fetchCultures = async () => {
    try {
      const cultures = await Culture.list();
      setCultures(cultures);
    } catch (err) {
      if (err instanceof OfflineError) {
        try {
          const cultures = await Ledger.list();
          setCultures(cultures);
          setOffline(true);
        } catch (err) {
          setMsg(err.toString());
        }
      } else {
        setMsg(err.toString());
      }
    }
  };

  useEffect(() => {
    fetchCultures();
  }, []);

  const fetchAdmins = async () => {
    if (!props.token) {
      return;
    }

    try {
      const admins = user.superUser ? await Admin.list(token) : [user];
      setAdmins(admins);
    } catch (err) {
      setMsg(err.toString());
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (!token) {
    return (
      <Cultures
        navigation={props.navigation}
        token={""}
        cultures={cultures?.entries()}
        onRefresh={() => fetchCultures()}
        searchQuery={searchQuery}
        offline={offline}
      />
    );
  }

  const onAdd = () => {
    switch (getFocusedRouteNameFromRoute(route) ?? "Cultures") {
      case "Cultures":
        setCultures(
          new Map([...cultures.entries(), ["New Culture", Date.now()]])
        );
        break;
      case "Admins":
        setInviteModal(true);
    }
  };

  const invite = async (field: EmailField) => {
    const { email } = field;
    await validateField("email");
    try {
      await Admin.invite(email, token);
      setInviteModal(false);
    } catch (err) {
      setMsg(err.toString());
    }
  };

  const hideSnackbar = () => setMsg("");

  if (!admins) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  return (
    <View style={styles.view}>
      <Tab.Navigator initialRouteName="Cultures">
        <Tab.Screen name="Cultures">
          {() => (
            <Cultures
              navigation={navigation}
              token={token}
              searchQuery={searchQuery}
              cultures={cultures?.entries()}
              onRefresh={() => fetchCultures()}
              offline={offline}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Admins">
          {() => (
            <Admins
              token={token}
              admins={admins}
              onRefresh={() => fetchAdmins()}
              searchQuery={searchQuery}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <FAB style={styles.fab} icon="plus" onPress={onAdd} />
      <Portal>
        <Snackbar
          visible={msg != ""}
          onDismiss={() => setMsg("")}
          action={{
            label: "Undo",
            onPress: () => setMsg(""),
          }}
        >
          {msg}
        </Snackbar>
        <Modal
          visible={inviteModal}
          contentContainerStyle={
            theme === "Dark" ? styles.modalDark : styles.modalLight
          }
          onDismiss={() => setInviteModal(false)}
        >
          <Text>Invite a new admin</Text>
          <TextInput
            autoFocus={true}
            textContentType="emailAddress"
            mode="outlined"
            left={<TextInput.Icon name="email" />}
            error={errors.email && touched.email}
            label="email"
            value={values.email}
            ref={email}
            onBlur={handleBlur("email")}
            onChangeText={handleChange("email")}
          />
          <View style={styles.div} />
          <Button mode="contained" onPress={handleSubmit}>
            Send Invite
          </Button>
        </Modal>
      </Portal>
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

export default connect(
  (
    state: Store,
    ownProps: {
      navigation: StackNavigationProp<Routes, "Home">;
      route: RouteProp<Routes, "Home">;
    }
  ) => ({
    navigation: ownProps.navigation,
    route: ownProps.route,
    user: state.user.user,
    token: state.user.token,
    theme: state.theme,
  }),
  null
)(Home);
