import { z } from "zod";
import { base } from "../__core/app";
import { auth } from "../auth";
import { db } from "../database";
import { settings as settingsTable } from "../database/schema";
import { ORPCError } from "@orpc/server";
export const defaults = {
  address: "2.10-р байр",
  phone: "90110429",
  open: "10:00",
  close: "19:00",
};
export async function getSettings() {
  const rows = await db.select().from(settingsTable);
  return rows[0] ?? defaults;
}
const time = z
  .string()
  .regex(
    /^(?:[01]\d|2[0-3]):(?:00|30)$/,
    "Цагийг 30 минутын алхамтай оруулна уу",
  );
export const settings = {
  get: base.handler(getSettings),
  save: base
    .input(
      z
        .object({
          address: z.string().trim().min(2).max(300),
          phone: z.string().regex(/^\d{8}$/, "Утас 8 оронтой байна"),
          open: time,
          close: time,
        })
        .refine((s) => s.open < s.close, "Хаах цаг нь нээх цагаас хойш байна"),
    )
    .handler(async ({ context, input }) => {
      const session = await auth.api.getSession({ headers: context.headers });
      if (
        !session ||
        session.user.email.toLowerCase() !==
          process.env.ADMIN_EMAIL?.toLowerCase()
      )
        throw new ORPCError("UNAUTHORIZED");
      await db
        .insert(settingsTable)
        .values({ id: 1, ...input })
        .onConflictDoUpdate({ target: settingsTable.id, set: input });
      return input;
    }),
};
