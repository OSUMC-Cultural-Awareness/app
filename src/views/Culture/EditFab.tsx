import React from "react";
import { Platform } from "react-native";

import { FAB } from "react-native-paper";

/**
 * Properties for {@link EditFAB}
 */
type EditFABProps = {
  // onPress handles when the FAB is pressed.
  onPress: () => void;
};

/**
 * EditFAB displays a {@link FAB} that is labeled "edit" and has a pencil icon.
 *
 * @param {EditFABProps} props
 * @returns {React.ReactElement} React component
 */
export default function EditFAB(props: EditFABProps): React.ReactElement {
  return (
    <FAB.Group
      icon="pencil"
      style={Platform.OS === "web" ? ({ position: "fixed" } as any) : undefined}
      open={false}
      onPress={() => props.onPress()}
      visible={true}
      actions={[]}
      onStateChange={() => props.onPress()}
    />
  );
}
