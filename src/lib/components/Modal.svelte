<script lang="ts">
    let { children, showModal, onClose } = $props();

    function closeModal(){
        onClose?.();
  }
</script>
{#if showModal}
    <div class="modal-backdrop" on:click={() => closeModal()}></div>
    <div class="modal">
        {@render children?.()}
    </div>
{/if}
<style>
    .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal {
    position: fixed;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 10;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>