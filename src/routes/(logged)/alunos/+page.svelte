<script lang='ts'>
  import { goto } from "$app/navigation";
    import ButtonAdicionar from "$lib/components/buttons/ButtonAdicionar.svelte";
  import DropdownButton from "$lib/components/buttons/DropdownButton.svelte";
  import AlunoCard from "$lib/components/cards/AlunoCard.svelte";
    import DiariaCard from "$lib/components/cards/DiariaCard.svelte";
  import Header from "$lib/components/Header.svelte";
    import Modal from "$lib/components/Modal.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { type CreateAjuste, type ListAjuste } from "$lib/types/ajuste";
  import type { ListAluno } from "$lib/types/aluno";
  import { type CreateAtraso, type ListAtraso } from "$lib/types/atraso";
  import { type CreateDiaria, type ListDiaria } from "$lib/types/diaria";
  import type { ListTurma } from "$lib/types/turma";
    import { createAjuste } from "$lib/utils/ajuste/createAjuste";
    import { deleteAjuste } from "$lib/utils/ajuste/deleteAjuste";
    import { getAjustes } from "$lib/utils/ajuste/getAjustes";
  import { getAlunos } from "$lib/utils/aluno/getAlunos";
    import { getDesativados } from "$lib/utils/aluno/getDesativados";
    import { createAtraso } from "$lib/utils/atraso/createAtraso";
    import { deleteAtraso } from "$lib/utils/atraso/deleteAtraso";
    import { getAtrasos } from "$lib/utils/atraso/getAtrasos";
    import { createDiaria } from "$lib/utils/diaria/createDiaria";
    import { deleteDiaria } from "$lib/utils/diaria/deleteDiaria";
    import { getDiarias } from "$lib/utils/diaria/getDiarias";
  import { getTurmas } from "$lib/utils/turma/getTurmas";
    import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let displayLegenda = "none";
  let textoLegenda = 'Legendas ↓';

  let loadingAlunos = writable<boolean>(false);
  let loadingTurmas = writable<boolean>(false);
  let loadingDiarias = writable<boolean>(false);
  let loadingAjustes = writable<boolean>(false);
  let loadingAtrasos = writable<boolean>(false);
  let loadingDesativados = writable<boolean>(false);

  let mostrarAtivo = writable<boolean>(true)
  let showModal = writable<boolean>(false);

  let displayCriarDiaria = writable<boolean>(false);
  let displayCriarAtraso = writable<boolean>(false);
  let displayCriarAjuste = writable<boolean>(false);
  
  let ajustesAtuais = writable<ListAjuste[]>([]);
  let diariasAtuais = writable<ListDiaria[]>([]);
  let atrasosAtuais = writable<ListAtraso[]>([]);

  let creatingDiaria = writable<boolean>(false);
  let creatingAjuste = writable<boolean>(false);
  let creatingAtraso = writable<boolean>(false);

  let novaDiaria = writable<CreateDiaria>({alunoId: '', almoco: false, data: '', turno: 'MANHA'})
  let novoAtraso = writable<CreateAtraso>({alunoId: '', data: ''})
  let novoAjuste = writable<CreateAjuste>({alunoId: '', descricao: '', valor: 0, data: ''})
  
  let erroDiaria = writable<boolean>(false)
  let erroAtraso = writable<boolean>(false)
  let erroAjuste = writable<boolean>(false)

  let erroCreateDiaria = writable<boolean>(false)
  let erroCreateAtraso = writable<boolean>(false)
  let erroCreateAjuste = writable<boolean>(false)
  
  let alunos = writable<ListAluno[]>([])
  let alunoAtual = writable<ListAluno | null>(null)
  let alunosFiltro = writable<ListAluno[]>([])
  let turmas = writable<ListTurma[]>([]);
  let desativados = writable<ListAluno[]>([])

  async function handleGetDesativados(){
    $loadingDesativados = true;
    try{
      $desativados = await getDesativados();
    }catch(err){
      console.log(err)
    }finally{
      $loadingDesativados = false
    }
  }

  //fazer handleGetAluno com tratamento de erros

onMount(async() => {
    $loadingAlunos = true;
    $loadingTurmas = true;
    $alunos = await getAlunos();
    $alunosFiltro = $alunos;
    $loadingAlunos = false
    $turmas = await getTurmas();
    $loadingTurmas = false
  })

  function handleGetAluno(aluno : ListAluno) {
    $alunoAtual = aluno;
    $showModal = true;
    handleGetDiarias(aluno.id);
    handleGetAtrasos(aluno.id);
    handleGetAjustes(aluno.id);
  }

  function irParaEdicao() {
    if (!$alunoAtual) return;
    goto(`/alunos/editar/${$alunoAtual.id}`);
  }

  function handleDesativados(){
    if($desativados.length === 0){
      handleGetDesativados();
    }
    $alunosFiltro = $desativados
    $mostrarAtivo = false;
  }

  function handleAtivos(){
    $alunosFiltro = $alunos;
    $mostrarAtivo = true;
  }

  async function handleGetDiarias(id : string){
    $loadingDiarias= true
    try{
      $diariasAtuais = await getDiarias(id);
      $diariasAtuais.forEach(diaria => {
        diaria.data = dayjs(diaria.data).locale('pt-br').add(3, 'hour').format('DD/MM');
      })
    }catch(err){
      $erroDiaria = true;
      console.log(err)
    }finally{
      $loadingDiarias= false
    }
  }

  async function handleDeleteDiaria(id : string, alunoId : string){
    try{
      await deleteDiaria(id)
    }catch(err){
      console.log(err)
    }finally{
      handleGetDiarias(alunoId);
    }
  }

  async function handleGetAtrasos(id : string){
    $loadingAtrasos= true
    try{
      $atrasosAtuais = await getAtrasos(id);
      $atrasosAtuais.forEach(atraso => {
        atraso.data = dayjs(atraso.data).locale('pt-br').add(3, 'hour').format('DD/MM');
      })
    }catch(err){
      $erroAtraso = true;
      console.log(err)
    }finally{
      $loadingAtrasos= false
    }
  }

  async function handleDeleteAtraso(id : string, alunoId : string){
    try{
      await deleteAtraso(id);
    }catch(err){
      console.log(err)
    }finally{
      handleGetAtrasos(alunoId)
    }
  }

  async function handleGetAjustes(id : string){
    $loadingAjustes= true
    try{
      $ajustesAtuais = await getAjustes(id);
      $ajustesAtuais.forEach(ajuste => {
        ajuste.data = dayjs(ajuste.data).locale('pt-br').add(3, 'hour').format('DD/MM');
      })
    }catch(err){
      $erroAjuste = true;
      console.log(err)
    }finally{
      $loadingAjustes= false
    }
  }

  async function handleDeleteAjuste(id : string, alunoId : string){
    try{
      await deleteAjuste(id)
    }catch(err){
      console.log(err)
    }finally{
      handleGetAjustes(alunoId);
    }
  }

  function handleFecharModal() {
    $showModal = false;
    $displayCriarDiaria= false;
    $displayCriarAtraso= false;
    $displayCriarAjuste= false;
    $alunoAtual= null;
    $diariasAtuais = [];
    $atrasosAtuais = []
    $ajustesAtuais = []
  }

  //Função para a filtragem do turno e da turma
  function handleFiltro(atributo : string){
    if(atributo == '') $alunosFiltro = $alunos; 
    else $alunosFiltro= $alunos.filter(aluno => aluno.turma.turno === atributo || aluno.turma.nome === atributo);
  }

  function filtroDiaDaSemana(index : number | string){
    if(typeof index === "string") $alunosFiltro = $alunos;
    else $alunosFiltro= $alunos.filter(aluno => aluno.diasDaSemana![index] == true)
  }

//Função para pesquisar o nome dos alunos
  function SearchFilter(event: { target: { value: any; }; }){
    $alunosFiltro= $alunos.filter(aluno => aluno.nome.toLowerCase().includes(event.target.value));
  }

  async function handleCreateDiaria(){
    $creatingDiaria = true;
    try{
      await createDiaria($novaDiaria)
    }catch(err){
      $erroCreateDiaria = true;
      console.log(err)
    }finally {
      handleGetDiarias($alunoAtual!.id);
      $displayCriarDiaria = false;
      novaDiaria.update(valorAtual => ({
        alunoId: valorAtual.alunoId,
        data: '',
        turno: 'MANHA',
        almoco: false
      }));
      $creatingDiaria = false;
    }
  }

  async function handleCreateAtraso(){
    $creatingAtraso = true;
    try{
      await createAtraso($novoAtraso)
    }catch(err){
      $erroCreateAtraso = true;
      console.log(err)
    }finally {
      handleGetAtrasos($alunoAtual!.id);
      $displayCriarAtraso = false;
      novoAtraso.update(valorAtual => ({
        alunoId: valorAtual.alunoId,
        data: '',
      }));
      $creatingAtraso = false;
    }
  }

   async function handleCreateAjuste(){
    $creatingAjuste = true;
    try{
      await createAjuste($novoAjuste)
    }catch(err){
      $erroCreateAjuste = true;
      console.log(err)
    }finally {
      handleGetAjustes($alunoAtual!.id);
      $displayCriarAjuste = false;
      novoAjuste.update(valorAtual => ({
        alunoId: valorAtual.alunoId,
        data: '',
        valor: 0,
        descricao: ''
      }));
      $creatingAjuste = false;
    }
  }
</script>
<main class="main">
    <Sidebar corElemento={'orange'} corTexto={'white'}/>
    <Header>
      <DropdownButton text="Turno">
          <div>
            <a onclick={() => handleFiltro('')} role='button' tabindex='0'>Turno</a>
            <a onclick={() => handleFiltro('MANHA')}>Manhã</a>
            <a onclick={() => handleFiltro('TARDE')}>Tarde</a>
          </div>
      </DropdownButton> 
      <DropdownButton text="Turma">
          <div>
          <a onclick={() => handleFiltro('')}>Turma</a>
          {#each $turmas as turma}
            <a onclick={() => handleFiltro(turma.nome)}> {turma.nome} </a>
          {/each}
          </div>
      </DropdownButton>
      <DropdownButton text="Dia">
      <div>
          <a onclick={() => filtroDiaDaSemana('')}>Dia</a>
          <a onclick={() => filtroDiaDaSemana(0)}>Segunda</a>
          <a onclick={() => filtroDiaDaSemana(1)}>Terça</a>
          <a onclick={() => filtroDiaDaSemana(2)}>Quarta</a>
          <a onclick={() => filtroDiaDaSemana(3)}>Quinta</a>
          <a onclick={() => filtroDiaDaSemana(4)}>Sexta</a>
          </div>
      </DropdownButton>
      <DropdownButton text="⮟">
          {#if $mostrarAtivo}
            <a onclick={handleDesativados}>Desativados</a>
          {:else}
            <a onclick={handleAtivos}>Ativos</a>
          {/if}
      </DropdownButton>
      <input type="text" placeholder="Pesquisar..." id="searchBar" onchange={()=> SearchFilter} />
    </Header>
    <h2>Alunos: {$alunosFiltro.length}</h2>
    <div class="listaAlunos">
    {#if $loadingAlunos}
      <p>Carregando...</p>
    {/if}
    {#if !$loadingAlunos && $alunosFiltro.length === 0 && $alunos.length !== 0}
      <p>Nenhum aluno possui esse filtro</p>
    {/if}
    {#if !$loadingAlunos && $alunos.length === 0}
      <p>Para criar um aluno, clique no botão ali embaixo!</p>
    {/if}
    {#each $alunosFiltro as aluno}
      <a class="linkAlunos" onclick={() => handleGetAluno(aluno)}>
        <AlunoCard id={aluno.id} nome={aluno.nome} turma={aluno.turma.nome} turno={aluno.turma.turno} dias={aluno.diasDaSemana} ativo={$mostrarAtivo}/>
      </a>
    {/each}
    </div>
    <Modal showModal={$showModal} onClose={handleFecharModal} maxWidth="800px" maxHeight="90vh">
    {#if $alunoAtual}
    <div class="aluno-modal-content">
      <!-- Header -->
      <header class="modal-header">
        <h1 class="nome">{$alunoAtual.nome}</h1>
        <a onclick={irParaEdicao} class="link-editar" href="#">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Ver/Editar informações
        </a>
      </header>

      <!-- Seção Diárias -->
      <section class="secao">
        <div class="secao-header">
          <h2>Diárias</h2>
          <button class="btn-add" onclick={()=> $displayCriarDiaria = !$displayCriarDiaria} aria-label="Adicionar diária">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        {#if displayCriarDiaria}
          <form class="form-inline" onsubmit={handleCreateDiaria}>
            <div class="form-group">
              <label for="turno">Turno:</label>
              <select id="turno" bind:value={$novaDiaria.turno}>
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
              </select>
            </div>
            
            <label class="checkbox-label">
              <input type="checkbox" bind:checked={$novaDiaria.almoco}/>
              <span>Almoço</span>
            </label>
            
            <div class="form-group">
              <label for="data-diaria">Data:</label>
              <input type="date" id="data-diaria" bind:value={$novaDiaria.data}/>
            </div>
            
            <button type="submit" class="btn-primary" disabled={$creatingDiaria}>
              {$creatingDiaria ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        {/if}

        <div class="lista-cards">
          {#if $diariasAtuais.length === 0}
            <p class="empty-state">Nenhuma diária registrada</p>
          {:else}
            {#each $diariasAtuais as diaria}
              <DiariaCard 
                almoco={diaria.almoco} 
                turno={diaria.turno} 
                data={diaria.data} 
                onClick={() => handleDeleteDiaria(diaria.id, diaria.alunoId)}
              />
            {/each}
          {/if}
        </div>
      </section>

      <!-- Seção Atrasos -->
      <section class="secao">
        <div class="secao-header">
          <h2>Atrasos</h2>
          <button class="btn-add" onclick={()=> $displayCriarAtraso = !$displayCriarAtraso} aria-label="Adicionar atraso">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        {#if displayCriarAtraso}
          <form class="form-inline" onsubmit={handleCreateAtraso}>
            <div class="form-group">
              <label for="data-atraso">Data:</label>
              <input type="date" id="data-atraso" bind:value={$novoAtraso.data}/>
            </div>
            <button type="submit" class="btn-primary" disabled={$creatingAtraso}>
              {$creatingAtraso ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        {/if}

        <div class="lista-cards">
          {#if $atrasosAtuais.length === 0}
            <p class="empty-state">Nenhum atraso registrado</p>
          {:else}
            {#each $atrasosAtuais as atraso}
              <DiariaCard 
                data={atraso.data} 
                onClick={() => handleDeleteAtraso(atraso.id, atraso.alunoId)}
              />
            {/each}
          {/if}
        </div>
      </section>

      <!-- Seção Ajustes -->
      <section class="secao">
        <div class="secao-header">
          <h2>Ajustes</h2>
          <button class="btn-add" onclick={()=> $displayCriarAjuste = !$displayCriarAjuste} aria-label="Adicionar ajuste">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        {#if displayCriarAjuste}
          <form class="form-stack" onsubmit={handleCreateAjuste}>
            <div class="form-row">
              <div class="form-group">
                <label for="valor">Valor (R$):</label>
                <input type="number" id="valor" bind:value={$novoAjuste.valor} step="0.01"/>
              </div>
              <div class="form-group">
                <label for="data-ajuste">Data:</label>
                <input type="date" id="data-ajuste" bind:value={$novoAjuste.data}/>
              </div>
            </div>
            <div class="form-group">
              <label for="descricao">Descrição:</label>
              <input type="text" id="descricao" bind:value={$novoAjuste.descricao} placeholder="Motivo do ajuste..."/>
            </div>
            <button type="submit" class="btn-primary" disabled={$creatingAjuste}>
              {$creatingAjuste ? 'Registrando...' : 'Registrar Ajuste'}
            </button>
          </form>
        {/if}

        <div class="lista-cards">
          {#if $ajustesAtuais.length === 0}
            <p class="empty-state">Nenhum ajuste registrado</p>
          {:else}
            {#each $ajustesAtuais as ajuste}
              <DiariaCard 
                data={ajuste.data} 
                onClick={() => handleDeleteAjuste(ajuste.id, ajuste.alunoId)}
              />
            {/each}
          {/if}
        </div>
      </section>
    </div>
  {/if}
    </Modal>
    <ButtonAdicionar onClick={()=> goto('/alunos/criar')} title='Adicionar aluno'/>
</main>
<style>
.main {
  min-height: 100vh;
  background-color: white;
}

.listaAlunos {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding-block: 30px;
  overflow-x: hidden;
}

.linkAlunos {
  cursor: pointer;
  margin: 8px 0 0 8px
}

/* Container principal do conteúdo */
  .aluno-modal-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Header do modal */
  .modal-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .nome {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .link-editar {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #2563eb;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    width: fit-content;
    transition: color 0.2s;
  }

  .link-editar:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }

  /* Seções */
  .secao {
    background: #f9fafb;
    border-radius: 12px;
    padding: 1rem;
  }

  .secao-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .secao h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  /* Botões */
  .btn-add {
    background: #2563eb;
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .btn-add:hover {
    background: #1d4ed8;
    transform: scale(1.05);
  }

  .btn-primary {
    background: #10b981;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    background: #059669;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Formulários */
  .form-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: end;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
  }

  .form-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
  }

  .form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  .form-group input,
  .form-group select {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    min-width: 120px;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #2563eb;
    ring: 2px solid #bfdbfe;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .checkbox-label:hover {
    background: #f3f4f6;
  }

  .checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #2563eb;
  }

  /* Lista de cards */
  .lista-cards {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    min-height: 80px;
  }

  .empty-state {
    color: #9ca3af;
    font-style: italic;
    text-align: center;
    width: 100%;
    padding: 1rem;
  }

  /* Scrollbar horizontal */
  .lista-cards::-webkit-scrollbar {
    height: 6px;
  }

  .lista-cards::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 3px;
  }

  .lista-cards::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 3px;
  }

form button:disabled{
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

@media (max-width: 640px) {
    .form-inline {
      flex-direction: column;
      align-items: stretch;
    }

    .form-row {
      flex-direction: column;
    }

    .lista-cards {
      flex-direction: column;
      overflow-x: visible;
    }
  }
</style>