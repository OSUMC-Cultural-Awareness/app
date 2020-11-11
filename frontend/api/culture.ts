import { Api } from "./api";

/**
 * A Wrapper around {@link Api} for Culture.
 */
export class Culture {
  /**
   * constructor for {@link Culture}.
   *
   * @param {string} name
   * @param {string[]} generalInsights
   * @param {string[]} specializeInsights
   */
  constructor(
    public name: string,
    public generalInsights: string[],
    public specializeInsights: string[] = []
  ) {}

  /**
   * Get information about a {@link Culture}.
   *
   * @param {string} name
   * @returns {Promise<Culture>}
   */
  static async get(name: string): Promise<Culture> {
    let json = await Api.get(`/culture/${name}`);

    return new this(
      json["name"],
      json["general_insights"],
      json["specialized_insights"]
    );
  }

  /**
<<<<<<< HEAD
   * Snapshot information about a {@link Culture}.
   *
   * @param {string} name
   * @returns {Promise<Culture>}
   */
  static async snapshot(name: string): Promise<Culture> {
    let json = Api.get(`/culture/${name}`);

    return new this(json["name"], json["general_insights"]);
  }

  /**
   * List all cultures by name.
   *
   * @returns {Promise<{ name: string; modified: number }[]>}
   */
<<<<<<< HEAD
  static async List(): Promise<string[]> {
=======
  static async list(): Promise<{ name: string; modified: number }[]> {
>>>>>>> 102cc226380c014172fc6b9ac1ab1468905f6d35
    let json = await Api.get("/culture");

    return json["cultures"];
  }

  /**
   * Create a {@link Culture}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async create(token: string): Promise<void> {
    Api.post(
      "/culture",
      {
        name: this.name,
        general_insights: this.generalInsights,
        specialized_insights: this.specializeInsights,
      },
      token
    );
  }

  /**
   * Delete a {@link Culture}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
<<<<<<< HEAD
  static async Delete(name: string, token: string): Promise<void> {
    Api.delete(`/culture/${name}`, token);
=======
  async delete(token: string): Promise<void> {
    Api.delete(`/culture/${this.name}`, token);
>>>>>>> 102cc226380c014172fc6b9ac1ab1468905f6d35
  }

  /**
   * Update a {@link Culture}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async update(token: string): Promise<void> {
    Api.put(`/culture/${this.name}`, this, token);
  }
}
