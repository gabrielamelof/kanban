import { Coluna } from "./Coluna";
import React, {useState, useEffect} from "react";
import axios from 'axios';
import { DndContext } from "@dnd-kit/core"; // uso da biblioteca de clicar e arrastar

export function Quadro(){
    const [tarefas, setTarefas] = useState([]);

    // hook que permite a renderização de alguma coisa na tela. effect é composto de parametros. script (algoritmos) e depois as dependencias
    useEffect(() =>{

        const apiURL = 'http://127.0.0.1:8000/aplicacao/tarefas/';

        axios.get(apiURL)
            .then(response => { setTarefas(response.data)
            })
            .catch(error => {
                console.error("Deu ruim", error)
            });
    },[]);

    function handleDragEnd(event){
        const { active, over } =event;

        if(over && active){
            const tarefaId = active.id; //quero pegar o id da tarefa que tá sofrendo o evento
            const novaColuna =over.id; //quero pegar a coluna da tarefa
            setTarefas(prev =>
                prev.map(tarefa =>
                    tarefa.id === tarefaId
                        ? { ...tarefa, status: novaColuna }
                        : tarefa
                )
            );
            //Atualiza o status do card (muda a situação do card {a fazer/ fazendo /pronto})
            axios.patch(`http://127.0.0.1:8000//tarefa/${tarefaId}/`, {
                status: novaColuna
            })
            .catch(err => console.error("Erro ao atualizar status: ", err))
        }
    }

    // armazenando em variaveis o resultado d euma função callback que procura tarefas com um status escpecifico
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'a-fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'fazendo');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'pronto');
    return(
        <DndContext onDragEnd={handleDragEnd}>
            <main className="conteiner">
                <h1>Meu Quadro</h1>

                <Coluna id="a-fazer" titulo="A Fazer" tarefas={tarefasAfazer}/>
                <Coluna id="fazendo" titulo="Fazendo" tarefas={tarefasFazendo}/>
                <Coluna id="pronto" titulo="Feito" tarefas={tarefasFeito}/>
            </main>
        </DndContext>
    );


}