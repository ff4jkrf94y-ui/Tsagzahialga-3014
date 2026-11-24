import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export * from "./auth-schema";
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  service: integer("service").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  duration: integer("duration").notNull(),
  status: text("status").notNull().default("pending"),
  note: text("note").notNull().default(""),
});
export const locks = sqliteTable("slot_locks", {
  slot: text("slot").primaryKey(),
  booking: text("booking").notNull(),
});

export const settings = sqliteTable("salon_settings", {
  id: integer("id").primaryKey(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  open: text("open").notNull(),
  close: text("close").notNull(),
});
export const servicePrices = sqliteTable("service_prices", {
  id: integer("id").primaryKey(),
  price: integer("price").notNull(),
});
