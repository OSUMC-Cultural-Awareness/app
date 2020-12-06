/**
 * @jest-environment jsdom
 */
import React from "react";
import "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";

import Culture from ".";
import { USER_INITIAL_STATE, THEME_INITIAL_STATE } from "../../redux";
import { Routes } from "../../routes";

const CultureTest = () => {
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
        <Stack.Navigator initialRouteName="Culture">
          <Stack.Screen name="Culture" component={Culture} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

describe("Culture", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  test("Renders", () => {
    const rendered = renderer.create(<CultureTest />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
