import { Coluna } from "./Coluna";
import React, {useState, useEffect} from "react";
import axios from 'axios';

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
    },[])

    // armazenando em variaveis o resultado d euma função callback que procura tarefas com um status escpecifico
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'a fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'fazendo');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'pronto');
    return(
        <main className="conteiner">
            <h1>Meu Quadro</h1>
            <Coluna titulo= "A fazer" tarefas={tarefasAfazer}/>
            <Coluna titulo= "Fazendo" tarefas={tarefasFazendo}/>
            <Coluna titulo= "feito" tarefas={tarefasFeito}/>
        </main>
    );


}