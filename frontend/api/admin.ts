import { Api } from "./api";

/**
 * EmailColonError - Emails **cannot** have `:`.
 *
 * @extends {Error}
 */
export class EmailColonError extends Error {
  /**
   * constructor.
   *
   * @param {string} reason
   */
  constructor(public reason: string) {
    super(reason);
  }
}

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
   */
  constructor(public name: string, public email: string) {
    if (email.indexOf(":") != -1) {
      throw new EmailColonError(`${email} has an unsupported character ':'`);
    }
  }

  /**
   * get an {@link Admin} data.
   *
   * @param {string} token
   * @param {string} email
   * @returns {Promise<string[]>}
   */
  static async get(email: string, token: string): Promise<string[]> {
    let json = Api.getAuth(`/admin/${email}`, token);
    return json;
  }

  /**
   * login an {@link Admin}.
   *
   * @param {string} email - email of Admin
   * @param {string} password - password of Admin
   * @returns {Promise<object>} JSON Web Token authenticating the admin
   */
  static async login(email: string, password: string): Promise<object> {
    const json = await Api.post("/login", { email: email, password: password });
    const token = json["token"];
    const user = await this.get(email, token);
    return { ...user, token };
  }

  /**
   * list all {@link Admin} by name.
   *
   * @param {string} token
   * @returns {Promise<string[]>}
   */
  static async list(token: string): Promise<string[]> {
    let json = Api.getAuth("/admin", token);
    return json["admins"];
  }

  /**
   * invite an {@link Admin}.
   *
   * @param {string} email - of future admin to invite
   * @param {string} token - JSON Web Token
   * @returns {Promise<void>}
   */
  static async invite(email: string, token: string): Promise<void> {
    Api.post("/admin/invite", { email: email }, token);
  }

  /**
   * update an {@link Admin}.
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
    Api.put(
      `/admin/${this.email}`,
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
   * @param {string} email - of Admin to delete
   * @param {string} token - JSON Web Token
   * @returns {Promise<void>}
   */
  static async delete(email: string, token: string): Promise<void> {
    Api.delete(`/admin/${email}`, token);
  }

  /**
   * create an {@link Admin}.
   *
   * @param {string} password - password validation
   * @param {string} passwordConfirmation - MUST match password
   * @param {string} token - JSON Web Token
   * @returns {Promise<string>}
   */
  async create(
    password: string,
    passwordConfirmation: string,
    token: string
  ): Promise<string> {
    let json = Api.post(
      "/register",
      {
        email: this.email,
        name: this.name,
        password: password,
        password_confirmation: passwordConfirmation,
      },
      token
    );

    return json["token"];
  }
}
