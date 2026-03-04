<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    showModal: boolean;
    onClose?: () => void;
    children?: import('svelte').Snippet;
    maxWidth?: string;
    maxHeight?: string;
  }

  let { 
    showModal, 
    onClose, 
    children,
    maxWidth = '90vw',
    maxHeight = '85vh'
  }: Props = $props();

  let modalElement: HTMLDivElement;

  function closeModal() {
    onClose?.();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showModal) {
      closeModal();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  // Prevenir scroll do body quando modal está aberto
  $effect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div 
    class="modal-backdrop" 
    onclick={handleBackdropClick}
    role="button"
    tabindex="0"
  >
    <div 
      class="modal-container" 
      bind:this={modalElement}
      style="--modal-max-width: {maxWidth}; --modal-max-height: {maxHeight};"
    >
      <button 
        class="modal-close" 
        onclick={closeModal}
        aria-label="Fechar modal"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="modal-content">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }

  .modal-container {
    position: relative;
    background: white;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: var(--modal-max-width);
    max-height: var(--modal-max-height);
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
    overflow: hidden;
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.05);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .modal-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
    transform: rotate(90deg);
  }

  .modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    padding-top: 3rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Scrollbar estilizada */
  .modal-content::-webkit-scrollbar {
    width: 8px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  .modal-content::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }

  @media (max-width: 640px) {
    .modal-backdrop {
      padding: 0.5rem;
    }
    
    .modal-content {
      padding: 1.5rem;
      padding-top: 2.5rem;
    }
  }
</style>