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
    public generalInsights: GeneralInsight[],
    public specializedInsights: SpecializedInsight
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
   * List all cultures by name.
   *
   * @returns {Promise<{ name: string; modified: number }[]>}
   */
  static async list(): Promise<{ name: string; modified: number }[]> {
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
    Api.delete(`/culture/${this.name}`, token);
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
