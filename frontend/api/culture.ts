import { Api, Token } from "./api";

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
   * Detailed information about a {@link Culture}.
   *
   * @param {string} name
   * @returns {Promise<Culture>}
   */
  static async Detailed(name: string): Promise<Culture> {
    let json = Api.get(`culture/${name}/all`);

    return new this(
      json["name"],
      json["general_insights"],
      json["specialized_insights"]
    );
  }

  /**
   * Snapshot information about a {@link Culture}.
   *
   * @param {string} name
   * @returns {Promise<Culture>}
   */
  static async Snapshot(name: string): Promise<Culture> {
    let json = Api.get(`culture/${name}`);

    return new this(json["name"], json["general_insights"], []);
  }

  /**
   * List all cultures by name.
   *
   * @returns {Promise<string[]>}
   */
  static async List(): Promise<string[]> {
    let json = Api.get("culture");

    return json["cultures"];
  }

  /**
   * Create a {@link Culture}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async Create(token: string): Promise<void> {
    Api.post("culture", this, new Token(token));
  }

  /**
   * Delete a {@link Culture}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async Delete(token: string): Promise<void> {
    Api.delete(`culture/${this.name}`, token);
  }

  /**
   * Update a {@link Culture}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async Update(token: string): Promise<void> {
    Api.put(`culture/${this.name}`, this, token);
  }
}
