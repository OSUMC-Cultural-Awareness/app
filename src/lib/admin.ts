import { Api } from "./api";

/**
 * Payload returned by {@link Admin.login} and {@link Admin.create}
 */
export type AuthPayload = {
  user: Admin;
  token: string;
};

/**
 * Administrator wrapper around fetch for interacting with API.
 */
export class Admin {
  /**
   * constructor for {@link Admin}.
   *
   * @throws EmailColonError - Email cannot contain a `:`
   *
   * @param {string} name
   * @param {string} email
   * @param {boolean} superUser
   */
  constructor(
    public name: string,
    public email: string,
    public superUser: boolean = false
  ) {}

  /**
   * get an {@link Admin} data.
   *
   * @param {string} token
   * @param {string} email
   * @returns {Promise<string[]>}
   */
  static async get(email: string, token: string): Promise<Admin> {
    let json = await Api.getAuth(`/admins/${email}`, token);
    return json;
  }

  /**
   * login an {@link Admin}.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} email - email of Admin
   * @param {string} password - password of Admin
   * @returns {Promise<AuthPayload>} JWT token and Admin user information
   */
  static async login(email: string, password: string): Promise<AuthPayload> {
    const json = await Api.post("/login", { email: email, password: password });
    return json;
  }

  /**
   * list all {@link Admin} by name.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} token
   * @returns {Promise<string[]>}
   */
  static async list(token: string): Promise<string[]> {
    let json = await Api.getAuth("/admins", token);
    return json["admins"];
  }

  /**
   * invite an {@link Admin}.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} email - of future admin to invite
   * @param {string} token - JSON Web Token
   * @returns {Promise<void>}
   */
  static async invite(email: string, token: string): Promise<void> {
    await Api.post("/admins/invite", { email: email }, token);
  }

  /**
   * update an {@link Admin}.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} email - email of admin account
   * @param {string} name - updated name
   * @param {string} token - JSON Web Token
   * @returns {Promise<void>}
   */
  static async update(
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    await Api.put(`/admins/${email}`, { name }, token);
  }

  /**
   * update an {@link Admin} only allowing them to update
   * their password.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} email - email of admin
   * @param {string} password - validate password
   * @param {string} passwordConfirmation - MUST match passwordConfirmation
   * @param {string} token - JSON Web Token
   * @returns {Promise<void>}
   */
  static async updatePassword(
    email: string,
    password: string,
    passwordConfirmation: string,
    token: string
  ): Promise<void> {
    await Api.put(
      `/admins/${email}`,
      {
        password: password,
        password_confirmation: passwordConfirmation,
      },
      token
    );
  }

  /**
   * recover an {@link Admin} with their email.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} email - email of admin to recover
   *
   * @returns {Promise<string>} server response
   */
  static async recover(email: string): Promise<string> {
    const res = await Api.post("/admins/recover", { email: email });
    return res["msg"];
  }

  /**
   * delete an {@link Admin}.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} email - of Admin to delete
   * @param {string} token - JSON Web Token
   * @returns {Promise<void>}
   */
  static async delete(email: string, token: string): Promise<void> {
    await Api.delete(`/admins/${email}`, token);
  }

  /**
   * create an {@link Admin}.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} password - password validation
   * @param {string} passwordConfirmation - MUST match password
   * @param {string} token - JSON Web Token
   * @returns {Promise<AuthPayload>} contains JSON Web Token and user information
   */
  static async create(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    token: string
  ): Promise<AuthPayload> {
    const json = await Api.post(
      "/register",
      {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      },
      token
    );

    return json;
  }
}
