/**
 * React Navigation Routes
 *
 * Add type definitions and parameters for routes in {@link StackNavigator}
 */
export type Routes = {
  /**
   * Displays information about a culture, looking up information about that
   * culture by provided prop {@link cultureName}.
   *
   * For admins it allows editing and adding information about a particular culture.
   */
  Culture: { cultureName: string };
  Home: undefined;
  Register: { token: string };
  Login: undefined;
  Dashboard: undefined;
};
