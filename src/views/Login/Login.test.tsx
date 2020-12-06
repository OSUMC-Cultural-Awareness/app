/**
 * @jest-environment jsdom
 */
import React from "react";
import "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { shallow, mount } from "enzyme";
import AsyncStorageMock from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from ".";
import { USER_INITIAL_STATE, THEME_INITIAL_STATE } from "../../redux";
import { Storage } from "../../storage";
import { Routes } from "../../routes";

jest.useFakeTimers();

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
  test("Renders", () => {
    expect(shallow(<LoginTest />)).toMatchSnapshot();
  });

  test("Remember Me Default to Unchecked", () => {
    const page = mount(<LoginTest />);
    const checkbox = page.find("Checkbox").first();
    expect(checkbox.props().status).toBe("unchecked");
  });

  test("Remember Me Checked When Email Set in AsyncStorage", async () => {
    AsyncStorageMock.getItem = jest.fn().mockReturnValue("test@gmail.com");
    const page = mount(<LoginTest />);

    setImmediate(() => {
      page.update();

      const checkbox = page.find("Checkbox").first();
      expect(AsyncStorage.getItem).toBeCalledWith(Storage.RememberedEmail);
      expect(checkbox.props().status).toBe("checked");
    });
  });
});
