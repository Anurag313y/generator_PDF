import { z } from "zod";

export const eventInputSchema = z.object({
  eventName: z.string().min(2).max(160).trim(),
  eventDate: z
    .string()
    .min(1)
    .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid event date"),
  eventCategory: z.string().min(2).max(60).trim(),
  description: z.string().min(1).max(4000).trim(),
  name: z.string().min(2).max(120).trim(),
  email: z.string().email().trim(),
  phoneNumber: z.string().min(7).max(20).trim()
});

export const eventIdParamSchema = z.object({
  id: z.string().min(1)
});

export const eventsListQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

