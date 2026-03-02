<script lang="ts">
    let { children } = $props();
</script>

<header>
    {@render children?.()}
</header>

<style>
    header{
        background-color: 'orange'; 
        color: 'black'; 
        box-shadow: '0px 1px 10px black' 
    }
</style>