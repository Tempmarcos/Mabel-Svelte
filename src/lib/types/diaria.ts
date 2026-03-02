import { z } from "zod";

export const listDiariaSchema = z.object({
  id: z.string(),
  data: z.string(),
  turno: z.enum(['MANHA', 'TARDE', 'NOITE']),
  almoco: z.boolean(),
  alunoId: z.string(),
})

export type ListDiaria = z.infer<typeof listDiariaSchema>


export const createDiariaSchema = z.object({
  alunoId: z.string(),
  data: z.string(),
  almoco: z.boolean(),
  turno: z.enum(['MANHA', 'TARDE', 'NOITE']),
})

export type CreateDiaria = z.infer<typeof createDiariaSchema>