import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Pako from "pako";

import { Culture } from "./culture";

/**
 * Ledger - a JavaScript Object that stores all downloaded cultures and
 * the times they were last modified.
 *
 * The Ledger has many methods to modify, update, and remove culture's information
 * from storage.
 *
 * @remark
 * All methods will throw errors of many different types and should all be
 * reported to the User.
 *
 * {@link add} Add a Culture
 * {@link remove} Remove a Culture
 * {@link update} Update all Cultures
 * {@link list} List all Cultures in a Map<string, number>
 * {@link read} Read a {@link Culture} from storage
 */
export namespace Ledger {
  const LOCATION: string = "@ledger";

  /**
   * Updates all stored culture's information if they're out of date.
   *
   * @remarks
   * This operation is really expensive.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @throws network errors from {@link fetch}
   * @throws zlib errors from {@link Pako}
   * @throws storage failures from {@link AsyncStorage}
   * @throws JSON errors from {@link JSON}
   */
  export async function update() {
    const updatedCultures = await Culture.list();
    let cultures = await list();

    updatedCultures.forEach(
      async (culture: { name: string; modified: number }) => {
        const { name, modified } = culture;
        if (cultures.has(name) && cultures.get(name) < modified) {
          add(name);
        }
      }
    );

    const data = JSON.stringify({ cultures: cultures });
    await AsyncStorage.setItem(LOCATION, data);
  }

  /**
   * List all downloaded cultures (keys) and their modified times (values)
   * as a Map<string, number>.
   *
   * @throws storage failures from {@link AsyncStorage}
   * @throws JSON errors from {@link JSON}
   *
   * @returns {Promise<Map<string, number>>}
   */
  export async function list(): Promise<Map<string, number>> {
    const data = await AsyncStorage.getItem(LOCATION);
    if (!data) {
      return new Map();
    }

    let ledger = JSON.parse(data)["cultures"];
    return new Map(Object.entries(ledger));
  }

  /**
   * Read a culture from {@link AsyncStorage}.
   *
   * @param {string} culture
   *
   * @throws JSON errors from {@link JSON}
   * @throws storage failures from {@link AsyncStorage}
   * @throw pako errors from {@link Pako}
   *
   * @returns {Promise<Culture>} culture read
   */
  export async function read(culture: string): Promise<Culture> {
    const storedData = await AsyncStorage.getItem(culture);
    const data: string = Pako.inflate(storedData, { to: "string" });
    return JSON.parse(data);
  }

  /**
   * saveLedger save the ledger to storage
   *
   * @param {Map} cultures to save
   */
  function saveLedger(cultures: Map<string, number>) {
    let ledger = { cultures: {} };
    cultures.forEach((val, key) => (ledger.cultures[key] = val));

    AsyncStorage.setItem(LOCATION, JSON.stringify(ledger));
  }

  /**
   * Add a culture to {@link AsyncStorage}
   *
   * @param {string} culture
   *
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   * @throws JSON errors from {@link JSON}
   * @throws storage failures from {@link AsyncStorage}
   * @throw pako errors from {@link Pako}
   */
  export async function add(culture: string) {
    const info = await Culture.get(culture);
    const compressed = Pako.deflate(JSON.stringify(info), { to: "string" });
    AsyncStorage.setItem(culture, compressed.toString());

    let cultures = await list();
    cultures.set(culture, info.modified);
    saveLedger(cultures);
  }

  /**
   * Remove a culture from {@link AsyncStorage}
   *
   * @remark
   * Only removes a culture if it exists in the Ledger
   *
   * @param {string} culture to remove
   */
  export async function remove(culture: string) {
    let cultures = await list();

    if (cultures.has(culture)) {
      AsyncStorage.removeItem(culture);
    }

    cultures.delete(culture);
    saveLedger(cultures);
  }
}
