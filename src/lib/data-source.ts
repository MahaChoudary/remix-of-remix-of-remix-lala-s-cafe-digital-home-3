/**
 * SUBMISSION LAYER
 *
 * Reads come from `publicContentQuery` (see `src/lib/content.ts`), which loads
 * everything from the cafe's database. Writes go through validated server
 * functions so nothing sensitive is ever exposed to the browser.
 */

import {
  submitContactMessage,
  submitPrivateEventInquiry,
  submitReservation,
} from "./public-content.functions";
import type {
  ContactMessage,
  PrivateEventInquiry,
  Reservation,
  SubmissionResult,
} from "./types";

export const dataSource = {
  async submitReservation(input: Reservation): Promise<SubmissionResult> {
    try {
      return await submitReservation({ data: input });
    } catch (error) {
      console.error(error);
      return { ok: false, error: "SAVE_FAILED" };
    }
  },
  async submitContactMessage(input: ContactMessage): Promise<SubmissionResult> {
    try {
      return await submitContactMessage({ data: input });
    } catch (error) {
      console.error(error);
      return { ok: false, error: "SAVE_FAILED" };
    }
  },
  async submitPrivateEventInquiry(input: PrivateEventInquiry): Promise<SubmissionResult> {
    try {
      return await submitPrivateEventInquiry({ data: input });
    } catch (error) {
      console.error(error);
      return { ok: false, error: "SAVE_FAILED" };
    }
  },
};
