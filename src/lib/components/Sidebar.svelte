<script lang="ts">
  import { page } from "$app/state";
  import { writable } from "svelte/store";

  interface Props {
    corElemento?: string;
    corTexto?: string;
  }

  let { corElemento = "#363636", corTexto = "#ffffff" }: Props = $props();

  let sidebarOpen = writable(false);
  let sidebarElement: HTMLElement;
  
  // Estado do submenu Financeiro
  let financeiroAberto = $state(false);

  // Toggle do sidebar
  function toggleSidebar(event: Event) {
    event.stopPropagation();
    sidebarOpen.update((value) => !value);
  }

  // Toggle do submenu Financeiro
  function toggleFinanceiro(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    financeiroAberto = !financeiroAberto;
  }

  // Fechar sidebar ao clicar fora
  function handleClickOutside(event: MouseEvent) {
    if ($sidebarOpen && sidebarElement && !sidebarElement.contains(event.target as Node)) {
      sidebarOpen.set(false);
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<!-- Botão toggle do sidebar -->
<button 
  class="sidebar-toggle" 
  onclick={toggleSidebar}
  aria-label="Toggle sidebar"
  style="background: {corElemento}; color: {corTexto};"
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
</button>

<!-- Overlay para dispositivos móveis -->
{#if $sidebarOpen}
  <div class="sidebar-overlay" onclick={() => $sidebarOpen = false}></div>
{/if}

<!-- Sidebar -->
<div 
  class="sidebar" 
  class:open={$sidebarOpen}
  bind:this={sidebarElement}
  style="--sidebar-bg: {corElemento}; --sidebar-text: {corTexto};"
>
  <nav>
    <div class="sidebar-header">
      <div class="logo" style="background: {corTexto}; opacity: 0.2;"></div>
      
      <!-- Botão de fechar no mobile -->
      <button 
        class="close-button mobile-only" 
        onclick={() => $sidebarOpen = false}
        aria-label="Fechar sidebar"
        style="color: {corTexto};"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <ul class="nav-menu">
      <!-- Alunos -->
      <li aria-current={page.url.pathname === "/alunos" ? "page" : undefined}>
        <a href="/alunos" data-sveltekit-preload-data="tap">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Alunos
        </a>
      </li>

      <!-- Turmas -->
      <li aria-current={page.url.pathname === "/turmas" ? "page" : undefined}>
        <a href="/turmas" data-sveltekit-preload-data="tap">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Turmas
        </a>
      </li>

      <!-- Financeiro (com submenu) -->
      <li class="has-submenu" class:open={financeiroAberto}>
        <a href="#" onclick={toggleFinanceiro} class="submenu-toggle">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Financeiro
          <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        
        {#if financeiroAberto}
          <ul class="submenu">
            <li aria-current={page.url.pathname === "/financeiro/fechamento" ? "page" : undefined}>
              <a href="/financeiro/fechamento" data-sveltekit-preload-data="tap">
                Fechamento
              </a>
            </li>
            <li aria-current={page.url.pathname === "/financeiro/planos" ? "page" : undefined}>
              <a href="/financeiro/planos" data-sveltekit-preload-data="tap">
                Planos
              </a>
            </li>
            <li aria-current={page.url.pathname === "/financeiro/taxas" ? "page" : undefined}>
              <a href="/financeiro/taxas" data-sveltekit-preload-data="tap">
                Taxas
              </a>
            </li>
          </ul>
        {/if}
      </li>

      <!-- Administração -->
      <li aria-current={page.url.pathname === "/equipe" ? "page" : undefined}>
        <a href="/admin" data-sveltekit-preload-data="tap">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Equipe
        </a>
      </li>
    </ul>

    <div class="sidebar-footer">
      <ul>
        <!-- Configurações -->
        <li aria-current={page.url.pathname === "/perfil" ? "page" : undefined}>
          <a href="/config" data-sveltekit-preload-data="tap">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Configurações
          </a>
        </li>

        <!-- Sair -->
        <li>
          <a href="../" style="cursor: pointer;">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Sair
          </a>
        </li>
      </ul>
    </div>
  </nav>
</div>

<style>
  :root {
    --sidebar-width: 280px;
  }

  /* Botão toggle */
  .sidebar-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    border: none;
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .sidebar-toggle:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }

  /* Overlay para mobile */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  /* Sidebar */
  .sidebar {
    position: fixed !important;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--sidebar-bg, #363636);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    color: var(--sidebar-text, #ffffff);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  /* Header do sidebar */
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    display: none;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Navegação */
  nav {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .nav-menu {
    flex: 1;
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    overflow-y: auto;
  }

  .nav-menu li {
    margin: 0;
  }

  .nav-menu a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: var(--sidebar-text);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-menu a:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-menu li[aria-current="page"] > a {
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-menu li[aria-current="page"] > a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--sidebar-text);
  }

  .nav-icon {
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  /* Submenu Financeiro */
  .has-submenu {
    position: relative;
  }

  .submenu-toggle {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .arrow-icon {
    margin-left: auto;
    transition: transform 0.2s ease;
  }

  .has-submenu.open .arrow-icon {
    transform: rotate(180deg);
  }

  .submenu {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .submenu li {
    margin: 0;
  }

  .submenu a {
    padding: 0.5rem 1rem 0.5rem 3rem;
    font-size: 0.9rem;
    font-weight: 400;
  }

  .submenu li[aria-current="page"] a {
    background: rgba(255, 255, 255, 0.15);
  }

  /* Footer do sidebar */
  .sidebar-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
  }

  .sidebar-footer ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-footer a {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    color: var(--sidebar-text);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    opacity: 0.8;
  }

  .sidebar-footer a:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }

  .sidebar-footer li[aria-current="page"] a {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }

  /* Responsivo */
  @media (min-width: 768px) {
    .sidebar {
      transform: translateX(0);
      position: relative;
      width: var(--sidebar-width);
    }

    .sidebar-toggle {
      display: none;
    }

    .sidebar-overlay {
      display: none;
    }
  }

  @media (max-width: 767px) {
    .mobile-only {
      display: block !important;
    }
    
    .sidebar {
      width: 100%;
      max-width: 300px;
    }
  }

  /* Scrollbar customizada */
  .nav-menu::-webkit-scrollbar {
    width: 4px;
  }

  .nav-menu::-webkit-scrollbar-track {
    background: transparent;
  }

  .nav-menu::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  .nav-menu::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>