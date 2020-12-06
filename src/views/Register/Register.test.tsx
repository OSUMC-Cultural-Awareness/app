/**
 * @jest-environment jsdom
 */
import React from "react";
import "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { shallow } from "enzyme";

import Register from ".";
import { USER_INITIAL_STATE, THEME_INITIAL_STATE } from "../../redux";
import { Routes } from "../../routes";

jest.useFakeTimers();

const RegisterTest = () => {
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
        <Stack.Navigator initialRouteName="Register">
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

describe("Register", () => {
  test("Renders", () => {
    expect(shallow(<RegisterTest />)).toMatchSnapshot();
  });
});