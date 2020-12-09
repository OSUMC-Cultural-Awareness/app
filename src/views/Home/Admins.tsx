import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { connect } from "react-redux";
import {
  List,
  IconButton,
  Dialog,
  Portal,
  Button,
  useTheme,
} from "react-native-paper";

import { Store } from "../../redux";
import { Admin } from "../../lib";

import EditModal from "./EditModal";
import styles from "./styles";

/**
 * Properties for {@link Admins}
 */
type Props = {
  token: string;
  admins: Admin[];
  theme: string;
  user: Admin;
  onRefresh: () => void;
  searchQuery?: string;
  onMsg: (msg: string) => void;
};

/**
 * Component that displays a list of components of {@link Admin}
 *
 * @param {Props} props
 * @returns {React.ReactElement} React component
 */
function Admins(props: Props): React.ReactElement {
  const { user, token, admins, onRefresh, searchQuery, onMsg } = props;
  const theme = useTheme();

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const onDelete = async () => {
    try {
      await Admin.delete(selectedAdmin.email, token);
      onRefresh();
    } catch (err) {
      onMsg(err.toString());
    }
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
      style={styles.list}
      data={searchResults()}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <View>
            <List.Item
              title={item.email}
              right={() =>
                props.token !== "" && (
                  <View style={styles.ListActions}>
                    <IconButton
                      icon="pencil"
                      onPress={() => {
                        setEditModal(true);
                        setSelectedAdmin(item);
                      }}
                    />
                    {!item.superUser && item.email != user.email && (
                      <IconButton
                        icon="delete"
                        onPress={() => {
                          setDeleteModal(true);
                          setSelectedAdmin(item);
                        }}
                      />
                    )}
                  </View>
                )
              }
            />
            <Portal>
              <Dialog
                visible={deleteModal}
                onDismiss={() => setDeleteModal(false)}
                style={{ backgroundColor: theme.colors.surface }}
              >
                <Dialog.Title>
                  Are you sure you want to delete {selectedAdmin?.email}?
                </Dialog.Title>
                <Dialog.Actions>
                  <Button
                    style={styles.dialogButton}
                    onPress={() => setDeleteModal(false)}
                  >
                    Cancel
                  </Button>
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
                </Dialog.Actions>
              </Dialog>
              <EditModal
                show={editModal}
                token={token}
                admin={selectedAdmin}
                onDismiss={() => setEditModal(false)}
                onErr={onMsg}
                onRefresh={onRefresh}
              />
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
