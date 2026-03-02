import { z } from "zod";

export const listAtrasoSchema = z.object({
  id: z.string(),
  data: z.string(),
  alunoId: z.string(),
})

export type ListAtraso = z.infer<typeof listAtrasoSchema>

export const createAtrasoSchema = z.object({
  alunoId: z.string(),
  data: z.string(),
})

export type CreateAtraso = z.infer<typeof createAtrasoSchema>