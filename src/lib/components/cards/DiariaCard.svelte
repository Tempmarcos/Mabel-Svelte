<script lang="ts">
    import { writable } from "svelte/store";

    type Props = {
        turno? : string;
        data : string;
        onClick : any;
        almoco? : boolean;
        valor? : number;
        descricao? : string;
    }
    let { turno, data, almoco, onClick, valor, descricao } : Props = $props();

    let cor = writable<string>('gray');

    if(turno === 'MANHA'){
        $cor = 'cyan';
    } else if(turno === 'TARDE') {
        $cor = 'orange';
    }
    function textoDoAlmoco(almoco : boolean){
        if(almoco === true){
            return '🍔'
        }else {
            return ''
        }
    }

    function textoValor(valor : number){
        if(valor) {
            return `R$ ${valor}`  
        } else {
            return ''
        }
    }
</script>
<div class="container">
    <div title={descricao} class="card" style="border: '3px solid', borderColor: {$cor}">
        <h1 style="background-color: {$cor}">●</h1>
        <h2>{data}</h2>
        {textoValor(valor!)}
        {textoDoAlmoco(almoco!)}
    </div>
    <a onclick={onClick} class="fechar">✖</a>
</div>
<style>
    .card{
    height: 50px;
    width: 120px;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;

    border-radius: 15px;
}

.fechar {
    display: none;
    position: relative;
    bottom: 55px;
    left: 108px;
    width: min-content;
    color: purple;
    font-size: 18px;
}

.container {
    height: 50px;
    width: 120px;
    margin: 5px;
}

.container:hover .fechar{
    display:flex;
}
</style>