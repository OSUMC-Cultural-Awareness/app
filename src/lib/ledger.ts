import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Pako from "pako";

import { Culture } from "./culture";
import Storage from "../storage";

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
export default class Ledger {
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
  static async update(): Promise<void> {
    const updatedCultures = await Culture.list();
    const cultures = await Ledger.list();

    updatedCultures.forEach(async (modified: number, name: string) => {
      if (cultures.has(name) && cultures.get(name) < modified) {
        Ledger.add(name);
      }
    });
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
  static async list(): Promise<Map<string, number>> {
    const data = await AsyncStorage.getItem(Storage.Ledger);
    if (!data) {
      return new Map();
    }

    const ledger = JSON.parse(data)["cultures"];
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
  static async read(culture: string): Promise<Culture> {
    const storedData = await AsyncStorage.getItem(culture);
    if (!storedData) {
      throw new Error(`${culture}: culture download not found`);
    }

    const data: string = Pako.inflate(storedData, { to: "string" });
    return JSON.parse(data);
  }

  /**
   * saveLedger save the ledger to storage
   *
   * @param {Map} cultures to save
   */
  private static saveLedger(cultures: Map<string, number>): Promise<void> {
    const ledger = { cultures: {} };
    cultures.forEach((val, key) => (ledger.cultures[key] = val));

    AsyncStorage.setItem(Storage.Ledger, JSON.stringify(ledger));
    return;
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
  static async add(culture: string): Promise<void> {
    const info = await Culture.get(culture);
    const compressed = Pako.deflate(JSON.stringify(info), { to: "string" });
    AsyncStorage.setItem(culture, compressed.toString());

    const cultures = await Ledger.list();
    cultures.set(culture, info.modified);
    Ledger.saveLedger(cultures);
  }

  /**
   * Remove a culture from {@link AsyncStorage}
   *
   * @remark
   * Only removes a culture if it exists in the Ledger
   *
   * @param {string} culture to remove
   */
  static async remove(culture: string): Promise<void> {
    const cultures = await Ledger.list();

    if (cultures.has(culture)) {
      AsyncStorage.removeItem(culture);
    }

    cultures.delete(culture);
    Ledger.saveLedger(cultures);
  }
}
