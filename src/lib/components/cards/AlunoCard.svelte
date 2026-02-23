<script lang="ts">
    import { writable } from "svelte/store";

    type AlunoCardProps = {
        id: string;
        nome: string;
        turno: string;
        turma: string;
        dias?: boolean[] | null;
        ativo: boolean;
    }

let {id, nome, turno, turma, dias = [false, false, false, false, false], ativo} : AlunoCardProps = $props();

    let background = writable<string>('');

    if(turno === "MANHA") { 
        $background = '#00ffff';
    } else if(turno === 'TARDE') {
        $background = '#ffa500';
    } else {
        $background = 'gray';
    }

    if(ativo === false){
        $background = 'gray'
    }

</script>
<div class="card" style="background-color: {$background}">
        <div class="container">
            <span>
                <em class={dias![0] ? 'ativo' : 'inativo'}>S</em> 
                <em class={dias![1] ? 'ativo' : 'inativo'}>T</em> 
                <em class={dias![2] ? 'ativo' : 'inativo'}>Q</em> 
                <em class={dias![3] ? 'ativo' : 'inativo'}>Q</em> 
                <em class={dias![4] ? 'ativo' : 'inativo'}>S</em>
            </span>
            <div class=content>
                {nome}<br />
                <strong>{turma}</strong>
            </div>
        </div>
</div>
<style>
    .card {
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    text-align: center;
    transition: 0.2s ease-in-out;
}

.container {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 120px;
    width: 120px
}

.content {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: 120px;
    width: 120px
}

.card span {
    position: absolute;
    font-size: 12px;
    top: 5px;
    right: 5px;
}

.card em {
    padding-inline: 4px;
    border-radius: 2px;
}

.card .ativo {
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
}

.card .inativo {
    color: gray;
    background-color: rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: scale(1.25);
    box-shadow: 6px 6px 6px 6px hsl(0deg 0% 0% / 0.31);
}

</style>