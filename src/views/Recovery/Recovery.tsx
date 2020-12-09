import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useFormik } from "formik";
import {
  Title,
  Button,
  TextInput,
  Snackbar,
  HelperText,
} from "react-native-paper";

import { Routes } from "../../routes";
import { Admin } from "../../lib";
import Validation from "./validation";

type Props = {
  navigation: StackNavigationProp<Routes, "Recovery">;
  route: RouteProp<Routes, "Recovery">;
};

/**
 * Recovery screen fields for Formik.
 */
type RecoveryFields = {
  password: string;
  passwordConfirmation: string;
};

/**
 * Initial values for Recovery fields for Formik.
 */
const initialValues: RecoveryFields = {
  password: "",
  passwordConfirmation: "",
};

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: "space-evenly", overflow: "hidden" },

  input: { margin: 5, padding: 15 },

  title: { alignSelf: "center" },
});

/**
 * Recovery page for Admin account Recovery.
 *
 * @remark ONLY accessible from Email, navigating to this route normally should
 * never happen.
 *
 * @param {Props} props properties
 * @returns {React.ReactElement} React Component
 */
export default function Recovery(props: Props): React.ReactElement {
  const { route, navigation } = props;
  const email = route.params ? route.params.email : "";
  const token = route.params ? route.params.token : "";

  const [msg, setMsg] = useState("");
  const [obscurePass, SetObscurePass] = useState(true);
  const [obscurePassConf, SetObscurePassConf] = useState(true);

  // useRefs for Formik Validation
  const password = useRef();
  const passwordConfirmation = useRef();

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    validationSchema: Validation,
    initialValues: initialValues,
    onSubmit: (values) => updateAccount(values),
  });

  const updateAccount = async (values: RecoveryFields) => {
    try {
      await Admin.updatePassword(
        email,
        values.password,
        values.passwordConfirmation,
        token
      );
      navigation.navigate("Login");
    } catch (err) {
      setMsg(err.toString());
      console.error("Failed to update account: ", err);
    }
  };

  // focus the next input
  const nextInput = (ref: React.MutableRefObject<any>): void => {
    if (!ref) {
      return;
    }

    ref.current.focus();
  };

  return (
    <View style={styles.view}>
      <Title style={styles.title}>Let's create a new password!</Title>
      <View style={styles.input}>
        <TextInput
          mode="outlined"
          label="password"
          ref={password}
          left={<TextInput.Icon name="lock" />}
          secureTextEntry={obscurePass}
          textContentType="newPassword"
          onSubmitEditing={() => nextInput(passwordConfirmation)}
          returnKeyType="next"
          error={errors.password && touched.password}
          onBlur={handleBlur("password")}
          value={values.password}
          onChangeText={handleChange("password")}
          right={
            <TextInput.Icon
              name={obscurePass ? "eye" : "eye-off"}
              onPress={() => SetObscurePass(!obscurePass)}
            />
          }
        />
        {errors.password && touched.password && (
          <HelperText type="error">{errors.password}</HelperText>
        )}
      </View>
      <View style={styles.input}>
        <TextInput
          mode="outlined"
          label="password confirmation"
          textContentType="password"
          ref={passwordConfirmation}
          left={<TextInput.Icon name="shield-lock" />}
          secureTextEntry={obscurePassConf}
          error={errors.passwordConfirmation && touched.passwordConfirmation}
          onBlur={handleBlur("passwordConfirmation")}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          value={values.passwordConfirmation}
          onChangeText={handleChange("passwordConfirmation")}
          right={
            <TextInput.Icon
              name={obscurePassConf ? "eye" : "eye-off"}
              onPress={() => SetObscurePassConf(!obscurePassConf)}
            />
          }
        />
        {errors.passwordConfirmation && touched.passwordConfirmation && (
          <HelperText type="error">{errors.passwordConfirmation}</HelperText>
        )}
      </View>
      <Button mode="contained" onPress={handleSubmit}>
        Recover
      </Button>
      <Snackbar
        visible={msg !== ""}
        onDismiss={() => setMsg("")}
        action={{ label: "Ok", onPress: () => setMsg("") }}
      >
        {msg}
      </Snackbar>
    </View>
  );
}
