import React, { useState, useRef, useLayoutEffect } from "react";
import { FlatList, Alert, View, Platform } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { connect } from "react-redux";
import {
  List,
  IconButton,
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  Snackbar,
} from "react-native-paper";
import { useFormik } from "formik";

import { Routes } from "../../routes";
import { Store } from "../../redux";
import { Admin } from "../../lib";

import Header from "../Header";
import styles from "./styles";
import { EmailNameValidation } from "./validation";

/**
 * Invite Email screen fields for Formik.
 */
type EditFields = {
  email: string;
  name: string;
};

/**
 * Initial values for email field for Formik.
 */
const initialValues: EditFields = {
  // This field could be updated with useEffect to enter the user's saved email address.
  email: "",
  name: "",
};

/**
 * Properties for {@link Admins}
 */
type AdminProps = {
  token: string;
  admins: Admin[];
  theme: string;
  user: Admin;
  onRefresh: () => void;
  navigation: StackNavigationProp<Routes, "Home">;
};

/**
 * Component that displays a list of components of {@link Admin}
 *
 * @param {AdminProps} props
 * @returns {React.ReactElement} React component
 */
function Admins(props: AdminProps): React.ReactElement {
  const { user, theme, token, admins, onRefresh, navigation } = props;

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [msg, setMsg] = useState<string>("");
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

  const name = useRef();

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    validationSchema: EmailNameValidation,
    initialValues: initialValues,
    onSubmit: (values) => onEdit(values),
  });

  const hideSnackbar = () => setMsg("");

  const onDelete = async () => {
    try {
      await Admin.delete(selectedItem.email, token);
    } catch {
      // show error message
    }
    onRefresh();
  };

  const onEdit = async (fields: EditFields) => {
    const { name, email } = fields;
    try {
      Admin.update(email, name, props.token);
      setEditModal(false);
      onRefresh();
    } catch {
      // TODO: show error message
    }
  };

  const superUserDeleteCheck = (item: any) => {
    if (!item.superUser && item.email != user.email)
      return (
        <IconButton
          icon="delete"
          onPress={() => {
            setDeleteModal(true);
            setSelectedItem(item);
          }}
        />
      );
  };

  const handleEditClick = (admin: Admin) => {
    setFieldValue("name", admin.name);
    setFieldValue("email", admin.email);
    setEditModal(true);
  };

  const searchResults = (): Admin[] => {
    return admins.filter((admin) => {
      if (!searchQuery) {
        return true;
      }

      const name = admin.email.toLowerCase();
      const query = searchQuery.toLowerCase();

      return name.includes(query);
    });
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={searchResults()}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <View>
            <List.Item
              title={item.email}
              right={() =>
                props.token !== "" && (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="pencil"
                      onPress={() => handleEditClick(item)}
                    />
                    {superUserDeleteCheck(item)}
                  </View>
                )
              }
            />
            <Portal>
              {deleteModal && (
                <Modal
                  visible={deleteModal}
                  contentContainerStyle={
                    theme === "Dark" ? styles.modalDark : styles.modalLight
                  }
                  onDismiss={() => setDeleteModal(false)}
                >
                  {/*TODO: update style for text */}
                  <Text>
                    Are you sure you want to delete {selectedItem.email}?
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => {
                      onDelete();
                      setDeleteModal(false);
                    }}
                    style={styles.deleteButton}
                  >
                    Delete
                  </Button>
                </Modal>
              )}
            </Portal>
            <Portal>
              {editModal && (
                <Modal
                  visible={editModal}
                  contentContainerStyle={
                    theme === "Dark" ? styles.modalDark : styles.modalLight
                  }
                  onDismiss={() => setEditModal(false)}
                >
                  {/*TODO: update style for text */}
                  <Text>Edit admin Account</Text>
                  <TextInput
                    mode="outlined"
                    left={<TextInput.Icon name="email" />}
                    label="email"
                    value={values.email}
                    disabled={true}
                  />
                  <TextInput
                    autoFocus={true}
                    textContentType="name"
                    mode="outlined"
                    left={<TextInput.Icon name="account-badge" />}
                    error={errors.name && touched.name}
                    label="name"
                    value={values.name}
                    ref={name}
                    onBlur={handleBlur("name")}
                    onChangeText={handleChange("name")}
                  />
                  <View style={styles.div} />
                  <Button mode="contained" onPress={handleSubmit}>
                    Save
                  </Button>
                </Modal>
              )}
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
      }}
    />
  );
}

export default connect(
  (state: Store) => ({
    user: state.user.user,
    theme: state.theme,
  }),
  null
)(Admins);
