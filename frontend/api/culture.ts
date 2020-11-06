import { Api } from "./api";

/**
 * Represents a GeneralInsight used by {@link Culture}.
 *
 * fields:
 *   source: string
 *   text: string
 */
export type GeneralInsight = {
  source: string;
  text: string;
};

/**
 * Represents a SpecializedInsight used by {@link Culture}.
 * A Map<string, GeneralInsight>.
 */
export type SpecializedInsight = Map<string, GeneralInsight[]>;

/**
 * A Wrapper around {@link Api} for Culture.
 */
export class Culture {
  /**
   * constructor for {@link Culture}.
   *
   * @param {string} name
   * @param {string[]} generalInsights
   * @param {string[]} specializedInsights
   */
  constructor(
    public name: string,
    public generalInsights: GeneralInsight[] = [],
    public specializedInsights: SpecializedInsight = new Map()
  ) {}

  /**
   * Detailed information about a {@link Culture}.
   *
   * @param {string} name
   * @returns {Promise<Culture>}
   */
  static async detailed(name: string): Promise<Culture> {
    let json = await Api.get(`/culture/${escape(name)}/all`);

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
  static async snapshot(name: string): Promise<Culture> {
    let json = await Api.get(`/culture/${escape(name)}`);

    return new this(json["name"], json["general_insights"]);
  }

  /**
   * List all cultures by name.
   *
   * @returns {Promise<string[]>}
   */
  static async List(): Promise<string[]> {
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
        specialized_insights: this.specializedInsights,
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
  async delete(token: string): Promise<void> {
    Api.delete(`/culture/${escape(this.name)}`, token);
  }

  /**
   * Update a {@link Culture}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async update(token: string): Promise<void> {
    Api.put(`/culture/${escape(this.name)}`, this, token);
  }
}
