<script lang="ts">
    import { login } from "$lib/utils/login";
    import icon from '$lib/assets/icon.png'
    import Image from "$lib/components/Image.svelte";
    import { writable } from "svelte/store";
    
    const email = writable<string>('');
    const password = writable<string>('');
    const erro = writable<string>('');
    const isSubmitting = writable<boolean>(false);

    async function handleSubmit(){
        if ($isSubmitting) return;
        if (typeof $email === "string" && typeof $password === "string") {
          $isSubmitting= true;
          try{
              await login($email, $password);
              $isSubmitting= false;
          }catch (err){
              console.log(err)
              $erro= 'Erro ao fazer login'
              $isSubmitting= false;
          }finally{
            $isSubmitting = false;
          }
        }
    };
</script>

<svelte:head>
  <title>Gestão Mabel - Login</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<main>
    <Image src={icon} alt="Logo da Mabel" width={300} height={200} draggable={false}></Image>
    <div class="form">
        <form on:submit|preventDefault={handleSubmit}>
            <input bind:value={$email} type="email" name="email" 
            autocomplete="email" required placeholder=" " />
            <label for="email">E-mail</label>
            <input
            type="password"
            name="password"
            autocomplete="current-password"
            minlength="6"
            required
            placeholder=" "
            />
            <label for="password">Senha</label>
            {#if $erro}
                <p>{$erro}</p>
            {/if}
            <button disabled={$isSubmitting} type="submit">Enviar</button>
        </form>
    </div>
</main>
<style>
    main{
        background-color: white;
        width: 100%;
        max-width: 400px;
        display: flex;
        justify-content: space-around;
        flex-flow: column wrap;
        height: 80vh;
        border-radius: 15px;
        box-shadow: 3px 3px 5px;
        align-items: center;
    }

    @media (max-width: 410px) {
        main{
            box-shadow: 1px 3px 5px;
        }
    }
    @media (max-width: 400px) {
        main{
            box-shadow: none;
            border-radius: 0;
        }
    }
  .form {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .form form {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  form input {
    margin-block: 5px;
  }

  form label {
    transform: translate(-75px, -25px);
    /* transform: translateX(-80px); */
    pointer-events: none;
    transition: 1s;
  }

  form input:focus + label,
  form input:valid + label,
  form input:not(:placeholder-shown) + label {
    transform: translate(-80px, -40px);
    color: black;
  }
  form input:focus,
  form input:valid,
  form input:not(:placeholder-shown) {
    border-bottom: 1px solid transparent;
  }

  form input {
    border: none;
    border-bottom: 1px solid black;
    padding: 2px;
    width: 200px;
    outline: none;
  }

  form button {
    color: black;
    padding: 7px;
    padding-inline: 55px;
    border: none;
    background: #00b006;
    background: linear-gradient(329deg,rgba(0, 176, 6, 1) 0%, rgba(255, 229, 0, 1) 100%);
    border-radius: 10px;
    transition: 0.3s ease-in-out;
  }

  form button:hover {
    filter:grayscale(0.7);
    color: white;
    transform: scale(1.1);
    cursor: pointer;
  }
  form button:disabled {
    filter:grayscale(0.9);
    color: white;
    cursor: wait;
    transform: none;
  }
  form p {
    color: red;
  }
</style>
