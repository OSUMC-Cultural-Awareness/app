import { Api } from "./api";

/**
 * Represents a GeneralInsight used by {@link Culture}.
 *
 * fields:
 *   source: string
 *   text: string
 */
export type GeneralInsight = {
  summary: string;
  information: string;
  source: { data: string; type: string };
};

/**
 * Represents a SpecializedInsight used by {@link Culture}.
 * A Map<string, GeneralInsight>.
 */
export type SpecializedInsight = Map<string, GeneralInsight[]>;

/**
 * specializedToArray convert a Map<string, GeneralInsight> to an Array.
 *
 * @param {SpecializedInsight} Map of Specialized Insights
 *
 * @returns {{text: string; insights: GeneralInsight[]}[]} where `text` is the title.
 */
export function specializedToArray(
  insights: SpecializedInsight
): { text: string; insights: GeneralInsight[] }[] {
  let ret = [];
  for (let key in insights) {
    ret.push({ text: key, insights: insights[key] });
  }
  return ret;
}

/**
 * A Wrapper around {@link Api} for Culture.
 */
export class Culture {
  /**
   * constructor for {@link Culture}.
   *
   * @param {string} name
   * @param {GeneralInsight[]} generalInsights
   * @param {SpecializedInsight} specializedInsights
   */
  constructor(
    public name: string,
    public generalInsights: GeneralInsight[],
    public specializedInsights: SpecializedInsight
  ) {}

  /**
   * Get information about a {@link Culture}.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
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
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
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
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async create(token: string): Promise<void> {
    await Api.post(
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
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async delete(token: string): Promise<void> {
    await Api.delete(`/culture/${this.name}`, token);
  }

  /**
   * Update a {@link Culture}
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} token
   * @returns {Promise<void>}
   */
  async update(token: string): Promise<void> {
    const data = {
      general_insights: this.generalInsights,
      specialized_insights: this.specializedInsights,
      name: this.name,
    };

    await Api.put(`/culture/${this.name}`, data, token);
  }
}
