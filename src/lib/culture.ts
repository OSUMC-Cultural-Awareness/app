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
 * A Wrapper around {@link Api} for Culture.
 */
export class Culture {
  /**
   * constructor for {@link Culture}.
   *
   * @param {string} name
   * @param {GeneralInsight[]} generalInsights
   * @param {SpecializedInsight} specializedInsights
   * @param {number} modified Epoch timestamp
   */
  constructor(
    public name: string,
    public generalInsights: GeneralInsight[],
    public specializedInsights: SpecializedInsight,
    public modified: number
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
  static async get(culture: string): Promise<Culture> {
    let json = await Api.get(`/cultures/${culture}`);

    const { name, general_insights, specialized_insights, modified } = json;

    return new this(
      name,
      general_insights,
      new Map(Object.entries(specialized_insights)),
      modified
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
    let json = await Api.get("/cultures");

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
  static async delete(name: string, token: string): Promise<void> {
    await Api.delete(`/cultures/${name}`, token);
  }

  /**
   * Update a {@link Culture}
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} token
   * @param {string} previousName - the previous name of the Culture
   * @returns {Promise<void>}
   */
  async update(token: string, previousName?: string): Promise<void> {
    let specializedInsightsObj = {};
    this.specializedInsights.forEach(
      (val, key) => (specializedInsightsObj[key] = val)
    );

    const data = {
      general_insights: this.generalInsights,
      specialized_insights: specializedInsightsObj,
      name: this.name,
    };

    await Api.put(
      `/cultures/${previousName ? previousName : this.name}`,
      data,
      token
    );
  }
}
