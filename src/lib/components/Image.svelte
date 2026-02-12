<script lang="ts">
    import { onMount } from "svelte";

  export let src: string;
  export let alt: string = "";
  export let width: number | undefined;
  export let height: number | undefined;

  let loaded = false;
  let img: HTMLImageElement;

  onMount(() => {
    if (img?.complete) {
        loaded = true;
    }
  })
</script>

<div class="image-wrapper"   style:width={width ? `${width}px` : undefined}
  style:height={height ? `${height}px` : undefined}>
  {#if !loaded}
    <div class="skeleton"></div>
  {/if}

  <img
    bind:this={img}
    src={src}
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
    on:load={() => (loaded = true)}
    class:loaded={loaded}
  />
</div>

<style>
.image-wrapper {
  position: relative;
  overflow: hidden;
}

img {
  opacity: 0;
  transition: opacity 0.3s ease;
}

img.loaded {
  opacity: 1;
}

.skeleton {
  position: absolute;
  border-radius: 10px;
  inset: 0;
  animation: pulse-bg 0.7s infinite alternate;
}

@keyframes pulse-bg {
  0% {
    background-color: #eee; /* From color */
  }
  100% {
    background-color: #ddd; /* To color */
  }
}

</style>