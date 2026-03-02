import type { CreateDiaria } from "$lib/types/diaria";
import { BASE_URL } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function createDiaria(diaria: CreateDiaria) {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      const data= JSON.stringify(diaria);
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "diarias/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
        body: data
      });
      if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
      }
      const dados = await response.json();
      console.log(dados)
      return await dados;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }