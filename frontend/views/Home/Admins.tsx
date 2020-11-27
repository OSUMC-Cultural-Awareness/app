import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, Alert } from "react-native";

import {
  ActivityIndicator,
  List,
  IconButton,
  FAB,
  Portal,
  Modal,
  Text,
} from "react-native-paper";

import { Admin } from "../../lib";

import styles from "./styles";

/**
 * Properties for {@link Admins}
 */
type AdminProps = {
  token: string;
  user: Admin;
};

/**
 * Component that displays a list of components of {@link Admin}
 *
 * @param {AdminProps} props
 * @returns {React.ReactElement} React component
 */
export default function Admins(props: AdminProps): React.ReactElement {
  const [users, setUsers] = useState(null);
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    let users;
    if (props.user.superUser) {
      users = await Admin.list(props.token);
    } else {
      users = [props.user];
    }
    setUsers(users);
  };

  const onDelete = async (email: string) => {
    try {
      await Admin.delete(email, props.token);
    } catch {
      // show error message
    }
    fetchAdminData();
  };

  const onEdit = (user: {
    email: string;
    name: string;
    superUser: boolean;
  }) => {
    //TODO: update Admin.update() params
    try {
      //Admin.update(email, props.token)
      fetchAdminData();
    } catch {
      // show error message
    }
  };

  const onInvite = async (email: string) => {
    try {
      await Admin.invite(email, props.token);
    } catch (err) {
      // show error message
    }
  };

  if (!users) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        data={users}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.email}
              onPress={() => {
                Alert.alert("user pressed", item.name, [
                  { text: "OK", onPress: () => console.log("OK Pressed") },
                ]);
              }}
              right={() =>
                props.token !== "" && (
                    <IconButton icon="pencil" onPress={() => onEdit(item)} />
                    <IconButton
                      icon="delete"
                      onPress={() => onDelete(item.email)}
                    />
              }
            />
          );
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(!visible)}
      />
      <Portal>
        <Modal visible={visible} contentContainerStyle={styles.inviteModal}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}
