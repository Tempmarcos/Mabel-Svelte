import type { CreateAtraso } from "$lib/types/atraso";
import { BASE_URL } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function createAtraso(atraso: CreateAtraso) {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      const data= JSON.stringify(atraso);
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "atrasos/", {
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