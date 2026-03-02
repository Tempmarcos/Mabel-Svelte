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
    handleGetDesativados();
    $mostrarAtivo = false;
  }

  function handleAtivos(){
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

  function handleLegendas() {
    if(displayLegenda == 'block'){
      displayLegenda = 'none';
      textoLegenda = 'Legendas ↓'
    } else {
      displayLegenda= 'block'
      textoLegenda = 'Legendas ↑'
    }
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
    <div class="legendas">
      <a onclick={handleLegendas} style="display: block; cursor: pointer; width: 150px">
        <h2>{textoLegenda}</h2>
      </a>
      <div style="display: {displayLegenda}">
          <h3>Manhã:</h3> <input type="color" id="inputColorManha" value='#00ffff' />
          <h3>Tarde:</h3> <input type="color" id="inputColorTarde" value='#ffa500' />
      </div>
      <h2>Alunos: {$alunosFiltro.length}</h2>
    </div>
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
    <Modal showModal={$showModal} onClose={handleFecharModal}>
    {#if $alunoAtual}
    <div class="modal">
        <a onclick={irParaEdicao} class="linkEditar">Ver/Editar informações do aluno</a>
        <h1 class="nome">{$alunoAtual.nome}</h1>
        <div class="div">
            <h1>Diárias</h1>
            <button onclick={() => !displayCriarDiaria}>+</button>
            {#if displayCriarDiaria}
              <div>
                  <form onsubmit={() => handleCreateDiaria()}>
                      <div>
                      <label for="turno">Turno:</label>
                      <select id="turno" bind:value={$novaDiaria.turno}>
                          <option value="MANHA">Manhã</option>
                          <option value="TARDE">Tarde</option>
                      </select>
                      </div>
                      <div>
                      <label for="almoco">Almoço:</label>
                      <input type="checkbox" id="almoco" bind:checked={$novaDiaria.almoco}/>
                      </div>
                      <div>
                      <label for="data">Data:</label>
                      <input type="date" id="data" bind:value={$novaDiaria.data}/>
                      </div>
                      <button type="submit" disabled={$creatingDiaria}>Registrar diária</button>
                  </form>
              </div>
            {/if}
        </div>
        <div class="div">
            {#if $diariasAtuais.length === 0}
              <h4>{$alunoAtual.nome} não possui diárias</h4>
            {/if}
            {#each $diariasAtuais as diaria}
              <DiariaCard almoco={diaria.almoco} turno={diaria.turno} data={diaria.data} onClick={() => handleDeleteDiaria(diaria.id, diaria.alunoId)}/>
            {/each}
        </div>
        <div class="div">
            <h1>Atrasos</h1>
            <button onclick={() => !displayCriarAtraso}>+</button>
            {#if displayCriarAtraso}
              <div>
                <form onsubmit={() => handleCreateAtraso()}>
                    <div>
                    <label for="data">Data:</label>
                    <input type="date" id="data" bind:value={$novoAtraso.data}/>
                    </div>
                    <button type="submit" disabled={$creatingAtraso}>Registrar atraso</button>
                </form>
              </div>
            {/if}
        </div>
        <div class="div">
            {#if $atrasosAtuais.length === 0}
              <h4>{$alunoAtual.nome} não possui atrasos</h4>
            {/if}
            {#each $atrasosAtuais as atraso}
              <DiariaCard data={atraso.data} onClick={() => handleDeleteAtraso(atraso.id, atraso.alunoId)}/>
            {/each}
        </div>
        <div class="div">
            <h1>Ajuste</h1>
            <button onclick={() => !displayCriarAjuste}>+</button>
            {#if displayCriarAjuste}
              <div>
                  <form onsubmit={() => handleCreateAjuste()}>
                      <div>
                      <label for="valor">Valor:</label>
                      <input type="number" id="valor" bind:value={$novoAjuste.valor}/>
                      </div>
                      <div>
                      <label for="descricao">Descrição:</label>
                      <input type="text" id="descricao" bind:value={$novoAjuste.descricao}/>
                      </div>
                      <div>
                      <label for="data">Data:</label>
                      <input type="date" id="data" bind:value={$novoAjuste.data}/>
                      </div>
                      <button type="submit" disabled={$creatingAjuste}>Registrar ajuste</button>
                  </form>
              </div>
            {/if}
        </div>
        <div class="div">
            {#if $ajustesAtuais.length === 0}
              <h4>{$alunoAtual.nome} não possui ajustes</h4>
            {/if}
            {#each $ajustesAtuais as ajuste}
              <DiariaCard data={ajuste.data} onClick={() => handleDeleteAjuste(ajuste.id, ajuste.alunoId)}/>
            {/each}
        </div>
    </div>
    {/if}
    </Modal>
    <ButtonAdicionar onClick={()=> goto('/alunos/criar')} title='Adicionar aluno'/>
</main>
<style>
.main {
  min-height: 100vh;
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

.modal {
    width: 90vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.modal a, .modal h1{
    height: min-content;
}

.modal .linkEditar {
  position: absolute;
  top: 5px;
  left: 5px;
}

.modal .nome {
  position: absolute;
  top: 5px;
}

.modal .div {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  align-items: center;
  margin: 10px
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

@media(max-width: 700px){
    .modal .nome {
      top: 15px;
    }
}
</style>