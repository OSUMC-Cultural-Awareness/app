import { Api } from "./api";

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
   * @returns {Promise<string>} JSON Web Token authenticating the admin
   */
  static async login(email: string, password: string): Promise<string> {
    const json = await Api.post("/login", { email: email, password: password });
    return json["token"];
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
   * @param {string} password - validate password
   * @param {string} passwordConfirmation - MUST match passwordConfirmation
   * @param {string} token - JSON Web Token
   * @returns {Promise<void>}
   */
  async update(
    password: string,
    passwordConfirmation: string,
    token: string
  ): Promise<void> {
    await Api.put(
      `/admins/${this.email}`,
      {
        email: this.email,
        name: this.name,
        password: password,
        password_confirmation: passwordConfirmation,
      },
      token
    );
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
   * @returns {Promise<void>}
   */
  static async create(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    token: string
  ): Promise<void> {
    await Api.post(
      "/register",
      {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      },
      token
    );
  }
}
