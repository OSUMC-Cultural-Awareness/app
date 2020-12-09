import React, { useState, useRef } from "react";

import { View, StyleSheet, Linking } from "react-native";
import {
  Button,
  TextInput,
  HelperText,
  Snackbar,
  Text,
} from "react-native-paper";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { useFormik } from "formik";

import { Admin, AuthPayload } from "../../lib";
import { updateUser, Store } from "../../redux";
import { Routes } from "../../routes";
import { TermsOfServiceURL } from "../../constants";

import RegisterHelpText from "./explanationText";
import Validation from "./validation";

type Props = {
  navigation: StackNavigationProp<Routes, "Register">;
  route: RouteProp<Routes, "Register">;
  updateUser: (user: Store["user"]) => void;
};

/**
 * Register screen fields for Formik.
 */
type RegisterFields = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

/**
 * Initial values for Register fields for Formik.
 */
const initialValues: RegisterFields = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "space-evenly",
    margin: 15,
    overflow: "hidden",
  },
  link: {
    color: "blue",
    fontWeight: "bold",
  },
});

type Focusable = "name" | "email" | "password" | "passwordConfirmation" | null;

/**
 * Screen for registering an Admin
 *
 * @param {Props} props - properties for Register screen
 *
 * @returns {React.ReactElement} React Component
 */
function Register(props: Props): React.ReactElement {
  const token = props.route.params ? props.route.params.token : "";

  const [obscurePass, SetObscurePass] = useState(true);
  const [obscurePassConf, SetObscurePassConf] = useState(true);
  const [msg, setMsg] = useState("");
  const [focused, setFocused] = useState<Focusable>("email");

  const name = useRef();
  const email = useRef();
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
    onSubmit: (values) => register(values),
  });

  /**
   * Registers an Admin
   *
   * @param {RegisterFields} fields - input fields
   */
  const register = async (fields: RegisterFields) => {
    const { name, email, password, passwordConfirmation } = fields;
    const { navigation, updateUser } = props;

    let res: AuthPayload;
    try {
      res = await Admin.create(
        name,
        email,
        password,
        passwordConfirmation,
        token
      );
    } catch (err) {
      setMsg(err.toString());
      return;
    }

    updateUser(res);

    navigation.dispatch(
      CommonActions.reset({ index: 1, routes: [{ name: "Home" }] })
    );
  };

  /**
   * Helper Text displays for {@link TextInput} if the field
   * has an error then the error is showed. If it is focused without error information about the field is shown.
   *
   * @param {{fieldName: Focusable}} props - name of field
   *
   * @returns {React.ReactElement} React Component
   */
  const DisplayErrOrHelp = (props: {
    fieldName: Focusable;
  }): React.ReactElement => {
    const { fieldName } = props;

    if (focused !== fieldName && (!errors[fieldName] || !touched[fieldName])) {
      return null;
    }

    if (errors[fieldName] && touched[fieldName]) {
      return <HelperText type="error">{errors[fieldName]}</HelperText>;
    } else {
      return <HelperText type="info">{RegisterHelpText[fieldName]}</HelperText>;
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
      <View>
        <TextInput
          autoFocus={true}
          textContentType="emailAddress"
          onFocus={() => setFocused("email")}
          onSubmitEditing={() => nextInput(name)}
          returnKeyType="next"
          mode="outlined"
          keyboardType="email-address"
          error={errors.email && touched.email}
          left={<TextInput.Icon name="email" />}
          label="email"
          ref={email}
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
        />
        <DisplayErrOrHelp fieldName="email" />
      </View>
      <View>
        <TextInput
          textContentType="name"
          onFocus={() => setFocused("name")}
          onSubmitEditing={() => nextInput(password)}
          returnKeyType="next"
          mode="outlined"
          error={errors.name && touched.name}
          left={<TextInput.Icon name="account" />}
          label="name"
          ref={name}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
        />
        <DisplayErrOrHelp fieldName="name" />
      </View>
      <View>
        <TextInput
          mode="outlined"
          label="password"
          onFocus={() => setFocused("password")}
          onSubmitEditing={() => nextInput(passwordConfirmation)}
          returnKeyType="next"
          textContentType="newPassword"
          keyboardType="visible-password"
          ref={password}
          left={<TextInput.Icon name="lock" />}
          secureTextEntry={obscurePass}
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
        <DisplayErrOrHelp fieldName="password" />
      </View>
      <View>
        <TextInput
          mode="outlined"
          label="password confirmation"
          onFocus={() => setFocused("passwordConfirmation")}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          textContentType="password"
          keyboardType="visible-password"
          ref={passwordConfirmation}
          left={<TextInput.Icon name="shield-lock" />}
          secureTextEntry={obscurePassConf}
          error={errors.passwordConfirmation && touched.passwordConfirmation}
          onBlur={handleBlur("passwordConfirmation")}
          value={values.passwordConfirmation}
          onChangeText={handleChange("passwordConfirmation")}
          right={
            <TextInput.Icon
              name={obscurePassConf ? "eye" : "eye-off"}
              onPress={() => SetObscurePassConf(!obscurePassConf)}
            />
          }
        />
        <DisplayErrOrHelp fieldName="passwordConfirmation" />
      </View>
      <View>
        <Text>
          By clicking Register, you are indicating that you have read and
          acknowledged the
          <Text
            onPress={() => Linking.openURL(TermsOfServiceURL)}
            style={styles.link}
          >
            {" "}
            Terms of Service
          </Text>
          .
        </Text>
      </View>
      <Button mode="contained" onPress={handleSubmit}>
        Register
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

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateUser,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Register);
