import React from "react";
import { FlatList, Alert, View } from "react-native";

import { List, IconButton } from "react-native-paper";

import { Admin } from "../../lib";

/**
 * Properties for {@link Admins}
 */
type AdminProps = {
  token: string;
  admins: Admin[];
  // Refresh admins
  onRefresh: () => void;
};

/**
 * Component that displays a list of components of {@link Admin}
 *
 * @param {AdminProps} props
 * @returns {React.ReactElement} React component
 */
export default function Admins(props: AdminProps): React.ReactElement {
  const { token, admins, onRefresh } = props;

  const onDelete = async (email: string) => {
    try {
      await Admin.delete(email, token);
    } catch {
      // show error message
    }
    onRefresh();
  };

  const onEdit = (user: {
    email: string;
    name: string;
    superUser: boolean;
  }) => {
    //TODO: update Admin.update() params
    try {
      //Admin.update(email, token)
      onRefresh();
    } catch {
      // show error message
    }
  };

  return (
    <View>
      <FlatList
        style={{ flex: 1 }}
        data={admins}
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
                  <View style={{ flexDirection: "row" }}>
                    <IconButton icon="pencil" onPress={() => onEdit(item)} />
                    <IconButton
                      icon="delete"
                      onPress={() => onDelete(item.email)}
                    />
                  </View>
                )
              }
            />
          );
        }}
      />
    </View>
  );
}
