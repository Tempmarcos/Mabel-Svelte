export type ListAluno = {
  id: string;
  nome: string;
  turma: {
      id: string;
      nome: string;
      turno: "MANHA" | "TARDE" | "NOITE";
      faixa: "KIDS" | "TEENS";
  };
   diasDaSemana?: boolean[] | null | undefined;
}