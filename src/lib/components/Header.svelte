<script lang="ts">
    let { children } = $props();
</script>

<header>
    {@render children?.()}
</header>

<style>
    header{
        background: #00b006;
        background: linear-gradient(329deg,rgba(0, 176, 6, 1) 0%, rgba(255, 229, 0, 1) 100%);
        color: black;
        box-shadow: 0px 1px 10px black;
    }
</style>