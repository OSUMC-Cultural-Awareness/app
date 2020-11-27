import React, { useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FAB } from "react-native-paper";

import Styles from "./style";

/**
 * Properties for {@link ToolsFAB}
 */
type ToolsFABProps = {
  // onSave function called when hitting the "save" button. This button should
  // toggle the whether this FAB is being displayed.
  onSave: () => void;
  // onAdd function called when hitting the "add" button.
  onAdd: () => void;
};

/**
 * ToolsFAB displays a {@link FAB.Group} that has two sub {@link FAB} one for editing and one for saving.
 *
 * @param {ToolsFABProps} props
 * @returns {React.ReactElement} React component
 */
export default function ToolsFAB(props: ToolsFABProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const window = useWindowDimensions();
  const safeArea = useSafeAreaInsets();

  // HACK: In order to get the FAB to be positioned properly on both Web and Mobile.
  //
  // Web: use position: fixed.
  // Mobile: useWindowDimensions hook, this doesn't work on Web.
  let styles = {
    ...Styles.fab,
    position: Platform.OS === "web" ? "fixed" : "relative",
  };

  if (Platform.OS !== "web") {
    styles["top"] = window.height - safeArea.bottom;
  }

  return (
    <FAB.Group
      visible={true}
      style={styles as any}
      open={open}
      icon={open ? "close" : "wrench"}
      actions={[
        { icon: "plus", onPress: () => props.onAdd() },
        { icon: "content-save", onPress: () => props.onSave() },
      ]}
      onStateChange={() => setOpen(!open)}
    />
  );
}
