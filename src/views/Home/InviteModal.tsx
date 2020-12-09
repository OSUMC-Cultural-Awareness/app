import React, { useRef } from "react";
import { useFormik } from "formik";
import { Dialog, TextInput, Button } from "react-native-paper";
import { useTheme } from "react-native-paper";

import { Admin } from "../../lib";

import { EmailValidation } from "./validation";
import styles from "./styles";

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

type Props = {
  token: string;
  show: boolean;
  onDismiss: () => void;
  onErr: (err: string) => void;
};

export default function InviteModal(props: Props): React.ReactElement {
  const { token, show, onDismiss, onErr } = props;
  const theme = useTheme();

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

  const invite = async (field: EmailField) => {
    const { email } = field;
    await validateField("email");

    try {
      await Admin.invite(email, token);
      onDismiss();
    } catch (err) {
      onErr(err.toString());
    }
  };

  return (
    <Dialog
      visible={show}
      onDismiss={onDismiss}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <Dialog.Title>Invite a new Admin</Dialog.Title>
      <Dialog.Content>
        <TextInput
          textContentType="emailAddress"
          autoFocus={true}
          mode="outlined"
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          left={<TextInput.Icon name="email" />}
          error={errors.email && touched.email}
          label="email"
          value={values.email}
          ref={email}
          onBlur={handleBlur("email")}
          onChangeText={handleChange("email")}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button style={styles.dialogButton} onPress={onDismiss}>
          Cancel
        </Button>
        <Button
          mode="contained"
          style={styles.dialogButton}
          onPress={handleSubmit}
        >
          Invite
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
