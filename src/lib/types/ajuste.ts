import { z } from "zod";

export const listAjusteSchema = z.object({
  id: z.string(),
  alunoId: z.string(),
  descricao: z.string(),
  valor: z.number(),
  data: z.string(),
})

export type ListAjuste = z.infer<typeof listAjusteSchema>

export const createAjusteSchema = z.object({
  descricao: z.string(),
  valor: z.number(),
  data: z.string(),
  alunoId: z.string(),
})

export type CreateAjuste = z.infer<typeof createAjusteSchema>


export const updateAjusteSchema = z.object({
  id: z.string(),
  descricao: z.string(),
  valor: z.number(),
  data: z.date(),
})

export type UpdateAjuste = z.infer<typeof updateAjusteSchema>
