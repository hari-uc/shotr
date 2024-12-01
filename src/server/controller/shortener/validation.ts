import z from "zod";

export const createLinkValidation = z.object({
    longUrl: z.string().url(),
    topic: z.string().optional(),
    customAlias: z.string().min(4).max(10).optional()
});
