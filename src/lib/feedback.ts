import { Api } from "./api";

export namespace Feedback {
  /**
   * send feedback to owner.
   *
   * @throws {@link ApiError}
   * @throws {@link OfflineError}
   *
   * @param {string} feedback - to send
   * @returns {Promise<void>}
   */
  export async function send(feedback: string): Promise<void> {
    await Api.post("/feedback", { feedback: feedback });
  }
}
