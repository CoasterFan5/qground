import { placeables } from "#lib/gridItems/types.js";
import z from "zod";

export const projectZodObject = z.object({
  version: z.string(),
  items: z.array(z.object({
    type: z.enum(placeables),
    x: z.number(),
    y: z.number()
  }))
})
