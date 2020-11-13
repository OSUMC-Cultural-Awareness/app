import * as React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, View, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";
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
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

  const handleLogin = async () => {
    Admin.login(email, password)
      .then((response) => {
        updateUser(response);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "Home" }],
          })
        );
      })
      .catch((error) => {
        console.error("Unsuccessful Login", error);
        Alert.alert(
          "Unsuccessful Login",
          "Incorrect username or password",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: true }
        );
      });
  };

  const handleRegistration = async () => {
    const token =
      route.params !== undefined && route.params.token !== undefined
        ? route.params.token
        : "";

    if (token) {
      Admin.create(name, email, password, passwordConfirmation, token)
        .then((response: any) => {
          response.user = JSON.parse(response.user);
          updateUser(response);
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.error("Unsuccessful Registration", error);
          Alert.alert(
            "Unsuccessful Registration",
            "helpful error message",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: true }
          );
        });
    }
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
          {route.name == "Register" ? (
            <TextInput
              style={styles.container}
              mode="outlined"
              label="name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          ) : null}
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
          ) : null}
          <Button
            icon="login"
            mode="contained"
            onPress={() =>
              route.name === "Login" ? handleLogin() : handleRegistration()
            }
          >
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
