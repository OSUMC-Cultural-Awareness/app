/**
 * @jest-environment jsdom
 */
import React from "react";
import "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import AsyncStorageMock from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import renderer from "react-test-renderer";
import waitForExpect from "wait-for-expect";

import Login from ".";
import { USER_INITIAL_STATE, THEME_INITIAL_STATE } from "../../redux";
import Storage from "../../storage";
import { Routes } from "../../routes";
import { Admin } from "../../lib";

const LoginTest = () => {
  const Stack = createStackNavigator<Routes>();

  const mockStore = configureStore([]);

  return (
    <Provider
      store={mockStore({
        user: USER_INITIAL_STATE,
        theme: THEME_INITIAL_STATE,
      })}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

describe("Login", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  test("Renders", () => {
    const rendered = renderer.create(<LoginTest />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  test("Remember Me Default to Unchecked", () => {
    const page = renderer.create(<LoginTest />);

    const checkbox = page.root.findByProps({ status: "unchecked" });
    expect(checkbox.props.status).toBe("unchecked");
  });

  test("Remember Me Checked When Email Set in AsyncStorage", () => {
    AsyncStorageMock.getItem = jest.fn().mockReturnValue("test@gmail.com");
    const page = renderer.create(<LoginTest />);

    setImmediate(() => {
      const checkbox = page.root.findByProps({ status: "checked" });
      expect(AsyncStorage.getItem).toBeCalledWith(Storage.RememberedEmail);
      expect(checkbox.props.status).toBe("checked");
    });
  });

  test("Login Action Success", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            token:
              "tjk0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDcyODg1MjQsIm5iZiI6MTYwNzI4ODUyNCwianRpIjoiNDFhYjA1ODEtNzliNC00YmY1LWFlZmMtOTk4NzM2NTE5NDVkIiwiZXhwIjoxNjA3Mzc0OTI0LCJpZGVudGl0eSI6InNuaWNraGFja21hbkBnbWFpbC5jb20iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.0HmtFJ3yzOm-a96d9oiXnmmEF4wVTzh5ZMDM1Z0zbeF",
            user: {
              _id: "123456789000000000000001",
              email: "example@test.com",
              name: "Test",
              superUser: false,
            },
          }),
      })
    );

    const page = renderer.create(<LoginTest />);

    const email = page.root.findByProps({ label: "email" });
    renderer.act(() => email.props.onChangeText("example@test.com"));
    expect(email.props.value).toBe("example@test.com");

    const password = page.root.findByProps({ label: "password" });
    renderer.act(() => password.props.onChangeText("Password123!"));
    expect(password.props.value).toBe("Password123!");

    const button = page.root.findByProps({ mode: "contained" });
    renderer.act(() => button.props.onPress());

    const loginOP = jest.spyOn(Admin, "login");
    await waitForExpect(() => {
      expect(loginOP).toHaveBeenCalledWith(
        email.props.value,
        password.props.value
      );
    });
  });

  test("Login Action Failure -- invalid credentials", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ msg: "Invalid email or password" }),
      })
    );

    const page = renderer.create(<LoginTest />);

    const email = page.root.findByProps({ label: "email" });
    renderer.act(() => email.props.onChangeText("example@test.com"));
    expect(email.props.value).toBe("example@test.com");

    const password = page.root.findByProps({ label: "password" });
    renderer.act(() => password.props.onChangeText("password"));
    expect(password.props.value).toBe("password");

    const button = page.root.findByProps({ mode: "contained" });
    renderer.act(() => button.props.onPress());

    await waitForExpect(() => {
      expect(
        page.root.findByProps({
          visible: true,
          children: "Error: Invalid email or password",
        })
      ).toBeTruthy();
    });
  });
});
