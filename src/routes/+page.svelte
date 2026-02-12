<script lang="ts">
    import { login } from "$lib/utils/login";

    const handleSubmit = (event : any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email === "string" && typeof password === "string") {
      login(email, password);
    }
  };
</script>
<main>
    <img src="./icon.png" alt=""/>
    <div class="form">
        <h1>Admex</h1>
        <form on:submit={handleSubmit}>
            <input type="email" name="email" id="email" required placeholder="" />
            <label for="email">E-mail</label>
            <input
            type="password"
            name="password"
            id="password"
            minlength="6"
            required
            placeholder=""
            />
            <label for="password">Senha</label>
            <button type="submit">Enviar</button>
            <em>Não tem conta? Faça seu <a href="/cadastro" data-sveltekit-preload-data="tap">cadastro</a></em>
        </form>
    </div>
</main>
<style>
    
</style>
