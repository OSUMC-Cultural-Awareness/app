import { Culture } from "./api";

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

  /**
   * Displays an interface to edit a {@link Culture} {@link GeneralInsight}
   * and {@link SpecializedInsight}
   *
   * Admin **ONLY** route
   */
  EditInsight: { culture: Culture; index: number | [string, number] };
  Home: undefined;
  Register: { token: string };

  /**
   * Allows admin Login, Account recovery, and remembering the user's
   * email between logins.
   */
  Login: undefined;
};
