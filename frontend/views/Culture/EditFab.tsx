import React from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FAB } from "react-native-paper";

import Styles from "./style";

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
  const window = useWindowDimensions();
  const safeArea = useSafeAreaInsets();

  // HACK: In order to get the FAB to be positioned properly on both Web and Mobile.
  //
  // Web: use position: fixed.
  // Mobile: useWindowDimensions hook, this doesn't work on Web.
  const styles = {
    ...Styles.fab,
    position: Platform.OS === "web" ? "fixed" : "relative",
  };

  if (Platform.OS !== "web") {
    styles["top"] = window.height - safeArea.bottom;
  }

  return (
    <FAB.Group
      style={styles as any}
      icon="pencil"
      open={false}
      onPress={() => props.onPress()}
      visible={true}
      actions={[]}
      onStateChange={() => props.onPress()}
    />
  );
}
