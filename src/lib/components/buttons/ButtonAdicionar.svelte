<script lang="ts">
    type Data = {
        title: string;
        onClick: any;
    }
    let { title, onClick} : Data = $props();
</script>
<button onclick={onClick} class="button" title={title}>+</button>
<style>
    .button {
    color: black;
    background-color: #04AA6D;
    border-radius: 50%;
    cursor: pointer;

    width: 75px;
    height: 75px;
    font-size: 45px;

    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 5px;
    left: 5px;
    z-index: 3;
    transition: 0.2s ease-in-out;
    outline: 1px solid black;
}

.button:hover {
    transform: scale(1.25);
    bottom: 11px;
    left: 11px;
    box-shadow: 6px 6px 6px 6px hsl(0deg 0% 0% / 0.31);
}
</style>