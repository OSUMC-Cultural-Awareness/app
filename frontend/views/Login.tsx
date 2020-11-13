import * as React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, View, StyleSheet } from "react-native";
import { StackActions } from "@react-navigation/native";
import { Button, Card, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Admin } from "../api/admin";
import { updateUser } from "../redux/UserAction";

const styles = StyleSheet.create({
  card: {
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
  },
  container: {
    padding: 10,
    fontSize: 18,
  },
});

function Login({ route, navigation, updateUser, user }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

  const handleLogin = async () => {
    Admin.login(email, password)
      .then((response) => {
        updateUser(response);
        navigation.dispatch(StackActions.popToTop());
      })
      .catch((error) => {
        console.error("Unsuccessful Login", error);
        Alert.alert(
          "Unsuccessful Login",
          "Incorrect username or password",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      });
  };

  return (
    <View
      style={{
        height: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LinearGradient
        colors={["#454545", "#f0f4ef"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      >
        <Card style={styles.card}>
          <TextInput
            style={styles.container}
            mode="outlined"
            label="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.container}
            mode="outlined"
            label="password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {route.name == "Register" ? (
            <TextInput
              style={styles.container}
              mode="outlined"
              label="password confirmation"
              secureTextEntry={true}
              value={passwordConfirmation}
              onChangeText={(text) => setPasswordConfirmation(text)}
            />
          ) : (
            <></>
          )}
          <Button icon="login" mode="contained" onPress={() => handleLogin()}>
            submit
          </Button>
        </Card>
      </LinearGradient>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
