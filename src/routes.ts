import { Culture } from "./lib";

/**
 * React Navigation Routes, for Mobile.
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
  Culture: { cultureName: string; prevName?: string; dirty?: boolean };

  /**
   * Displays an interface to edit a {@link Culture} {@link GeneralInsight}
   * and {@link SpecializedInsight}
   *
   * Admin **ONLY** route
   */
  EditInsight: { culture: Culture; index: number | [string, number] };

  /**
   * Displays Cultures allowing for downloads and seeing information
   * about that culture and Admins.
   *
   * To see Admins must be logged in, to see others you need to
   * be a superUser.
   *
   * Cultures can be deleted and edited.
   */
  Home: undefined;

  /**
   * Allows creation of a new admin account.
   *
   * @remark Route sent via email.
   */
  Register: { token: string };

  /**
   * Allows admin Login, Account recovery, and remembering the user's
   * email between logins.
   */
  Login: undefined;

  /**
   * Allows Admin account recovery, requires the token and updates the Admin
   * in the Api in order to update their password.
   */
  Recovery: { token: string; email: string };

  /**
   * Settings page displays downloaded cultures, dark theme, and disclaimer
   * for application.
   */
  Settings: undefined;
};

/**
 * React Navigation links {@link Routes} to Web URLs.
 */
export const Linking = {
  prefixes: ["/"],
  config: {
    screens: {
      Home: "/",
      Login: "login",
      Register: "register/:token",
      Recovery: "recovery/:email/:token",
      Culture: {
        path: "culture/:cultureName",
        parse: {
          cultureName: (cultureName: string): string => decodeURI(cultureName),
        },
        screens: {
          general: "general",
          specialized: "specialized",
        },
      },
      EditInsight: "culture/edit/:culture/:index",
      Settings: "settings",
    },
  },
};
