import { Api } from "./api";

export default class Feedback {
  /**
   * send feedback to owner.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} feedback - to send
   * @returns {Promise<void>}
   */
  static async send(feedback: string): Promise<void> {
    await Api.post("/feedback", { feedback: feedback });
  }
}
