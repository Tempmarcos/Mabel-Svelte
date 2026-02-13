<script lang="ts">
	import '../app.css'
  import icon from '$lib/assets/icon.png'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={icon} />
</svelte:head>

<div class="app">
  <main>
    {@render children()}
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
	  margin: 0;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #00b006;
    background: linear-gradient(329deg,rgba(0, 176, 6, 1) 0%, rgba(255, 229, 0, 1) 100%);
    justify-content: center;
    align-items: center;
  }
</style>

