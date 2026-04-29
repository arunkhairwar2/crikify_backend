import { z } from "zod";
// const dayInMilliSeconds = 24 * 60 * 60 * 1000;

export const createTournamentSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tournament name is required")
      .trim()
      .max(100, "Tournament name must be less than 100 characters"),

    ground: z
      .string()
      .min(1, "Ground is required")
      .trim()
      .max(100, "Ground name must be less than 100 characters"),
    registrationFee: z
      .string()
      .transform((val) => (val ? parseInt(val, 10) : 0))
      .refine((val) => val >= 0 && val <= 50000, {
        message: "Registration fee must be between 0 and 50,000",
      }),

    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location must be less than 100 characters"),

    ballType: z.enum(["LEATHER", "TENNIS"]).nullable().optional(),

    oversLimit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .refine((val) => val >= 1 && val <= 50, {
        message: "Overs limit must be between 1 and 50",
      }),

    maxWickets: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val >= 1 && val <= 11, {
        message: "Max wickets must be between 1 and 11",
      }),

    startAt: z
      .preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date({ message: "Start date & time is required" }),
      )
      .refine((date) => date.getTime() > Date.now(), {
        message: "Start date & time must be in the future",
      }),

    endAt: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ message: "End date & time is required" }),
    ),
  })
  .refine((data) => data.endAt.getTime() > data.startAt.getTime(), {
    message: "End date & time must be after start date & time",
    path: ["endAt"],
  });

export type CreateTournamentSchemaType = z.infer<typeof createTournamentSchema>;
