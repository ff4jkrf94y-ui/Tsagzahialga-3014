import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import { bookings, locks, servicePrices } from "../database/schema";
import { getSettings } from "./settings";
import { auth } from "../auth";
export const services = [
  {
    id: 0,
    name: "Цэвэрлэгээ · классик маникюр",
    price: 15000,
    duration: 120,
    description: "Хэлбэр засалт, кутикул цэвэрлэгээ, арчилгаа",
  },
  {
    id: 1,
    name: "Гель будалт",
    price: 35000,
    duration: 120,
    description: "Цэвэрлэгээ, нэг өнгийн гель будалт",
  },
  {
    id: 2,
    name: "Гоёлын будалт",
    price: 45000,
    duration: 120,
    description: "Гель будалт, 2 хурууны энгийн дизайн",
  },
  {
    id: 3,
    name: "Смарт хумс · энгийн будалт",
    price: 55000,
    duration: 240,
    description: "Уртасгалт, хэлбэр засалт, нэг өнгийн будалт",
  },
  {
    id: 4,
    name: "Смарт хумс · гоёлын будалт",
    price: 65000,
    duration: 240,
    description: "Уртасгалт, хэлбэр засалт, гоёлын будалт",
  },
];
const day = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar" }).format(
    new Date(),
  );
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (d) =>
      d >= day() &&
      d <= new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    "Дараагийн 90 хоногоос сонгоно уу",
  );
const fmt = (n: number) =>
  `${Math.floor(n / 60)
    .toString()
    .padStart(2, "0")}:${(n % 60).toString().padStart(2, "0")}`;
const mins = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
async function slots(d: string, s: number) {
  const busy = await db.select().from(locks);
  const result: string[] = [];
  const hours = await getSettings();
  for (
    let t = mins(hours.open);
    t + services[s]!.duration <= mins(hours.close);
    t += 30
  ) {
    if (new Date(`${d}T${fmt(t)}:00+08:00`).getTime() <= Date.now()) continue;
    let free = true;
    for (let n = t; n < t + services[s]!.duration; n += 15)
      if (busy.some((b) => b.slot === `${d}/${fmt(n)}`)) free = false;
    if (free) result.push(fmt(t));
  }
  return result;
}
const admin = base.use(async ({ context, next }) => {
  const s = await auth.api.getSession({ headers: context.headers });
  if (
    !s ||
    s.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()
  )
    throw new ORPCError("UNAUTHORIZED");
  return next();
});
export const salon = {
  services: base.handler(async () => {
    const prices = await db.select().from(servicePrices);
    return services.map((s) => ({
      ...s,
      price: prices.find((p) => p.id === s.id)?.price ?? s.price,
    }));
  }),
  savePrices: admin
    .input(
      z.object({
        prices: z
          .array(
            z.object({
              id: z.number().int().min(0).max(4),
              price: z.number().int().min(0).max(10000000),
            }),
          )
          .length(5)
          .refine(
            (rows) => new Set(rows.map((r) => r.id)).size === 5,
            "Үйлчилгээ бүрийн үнийг оруулна уу",
          ),
      }),
    )
    .handler(async ({ input }) => {
      await db.transaction(async (tx) => {
        for (const row of input.prices)
          await tx
            .insert(servicePrices)
            .values(row)
            .onConflictDoUpdate({
              target: servicePrices.id,
              set: { price: row.price },
            });
      });
      return { ok: true };
    }),
  slots: base
    .input(z.object({ date, service: z.number().int().min(0).max(4) }))
    .handler(({ input }) => slots(input.date, input.service)),
  book: base
    .input(
      z.object({
        name: z.string().trim().min(2).max(80),
        phone: z.string().regex(/^\d{8}$/),
        service: z.number().int().min(0).max(4),
        date,
        time: z.string().regex(/^\d{2}:\d{2}$/),
        note: z.string().max(500).default(""),
      }),
    )
    .handler(async ({ input }) => {
      if (!(await slots(input.date, input.service)).includes(input.time))
        throw new ORPCError("CONFLICT", {
          message: "Энэ цаг захиалагдсан байна. Өөр цаг сонгоно уу.",
        });
      const id = crypto.randomUUID();
      try {
        await db.transaction(async (tx) => {
          await tx.insert(bookings).values({
            ...input,
            id,
            duration: services[input.service]!.duration,
          });
          for (
            let t = mins(input.time);
            t < mins(input.time) + services[input.service]!.duration;
            t += 15
          )
            await tx
              .insert(locks)
              .values({ slot: `${input.date}/${fmt(t)}`, booking: id });
        });
      } catch {
        throw new ORPCError("CONFLICT", {
          message: "Цаг давхардлаа. Өөр цаг сонгоно уу.",
        });
      }
      return { id };
    }),
  list: admin.handler(() =>
    db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.date), desc(bookings.time)),
  ),
  status: admin
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["confirmed", "completed", "cancelled"]),
      }),
    )
    .handler(async ({ input }) => {
      await db.transaction(async (tx) => {
        await tx
          .update(bookings)
          .set({ status: input.status })
          .where(eq(bookings.id, input.id));
        if (input.status === "cancelled")
          await tx.delete(locks).where(eq(locks.booking, input.id));
      });
      return { ok: true };
    }),
};
