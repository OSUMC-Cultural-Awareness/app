import React, { useRef, useEffect } from "react";
import { View } from "react-native";

import { useFormik } from "formik";
import {
  Dialog,
  TextInput,
  Button,
  useTheme,
  HelperText,
} from "react-native-paper";

import { Admin } from "../../lib";

import { EmailNameValidation } from "./validation";
import styles from "./styles";

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

type Props = {
  token: string;
  show: boolean;
  admin: Admin;
  onDismiss: () => void;
  onErr: (err: string) => void;
  onRefresh: () => void;
};

export default function EditModal(props: Props): React.ReactElement {
  const { admin, token, show, onDismiss, onErr, onRefresh } = props;
  const name = useRef();
  const theme = useTheme();

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    setErrors,
    validateForm,
    setFieldValue,
  } = useFormik({
    validationSchema: EmailNameValidation,
    initialValues: initialValues,
    onSubmit: (values) => update(values),
  });

  useEffect(() => {
    setFieldValue("email", admin?.email);
    setFieldValue("name", admin?.name);
  }, [admin]);

  const update = async (fields: EditFields) => {
    const { name, email } = fields;

    await validateForm();

    if (name === admin.name) {
      setErrors({ ...errors, name: "That's your current name" });
      return;
    }

    try {
      await Admin.update(email, name, token);
      onDismiss();
      onRefresh();
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
      <Dialog.Title>Edit {admin?.name}</Dialog.Title>
      <Dialog.Content>
        <TextInput
          mode="outlined"
          style={styles.editModalInput}
          left={<TextInput.Icon name="email" />}
          label="email"
          value={values.email}
          disabled={true}
        />
        <View>
          <TextInput
            autoFocus={true}
            textContentType="name"
            mode="outlined"
            left={<TextInput.Icon name="account" />}
            error={errors.name && touched.name}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            label="name"
            value={values.name}
            ref={name}
            onBlur={handleBlur("name")}
            onChangeText={handleChange("name")}
          />
          {errors.name && touched.name && (
            <HelperText type="error">{errors.name}</HelperText>
          )}
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button style={styles.dialogButton} onPress={onDismiss}>
          Cancel
        </Button>
        <Button
          style={styles.dialogButton}
          mode="contained"
          onPress={handleSubmit}
        >
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
