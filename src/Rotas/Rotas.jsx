import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Inicial } from '../Paginas/Inicial';
import { Quadro } from '../Componentes/Quadro';
import { CadUsuario } from '../Paginas/CadUsuario';
import { CadTarefa } from '../Paginas/CadTarefa';
import { EditarTarefa } from '../Paginas/EditarTarefa';

// Função para que as tarefas sejam atualizadas e apareçam no qudro sem erros
export function Rotas() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function fetchTarefas() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/aplicacao/tarefas/");
        setTarefas(res.data);
      } catch (err) {
        console.error("Erro ao buscar tarefas:", err);
      }
    }
    fetchTarefas();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Inicial tarefas={tarefas} setTarefas={setTarefas} />}>
        <Route index element={<Quadro tarefas={tarefas} setTarefas={setTarefas} />} />
        <Route path='cadUsuario' element={<CadUsuario />} />
        <Route path='cadTarefa' element={<CadTarefa setTarefas={setTarefas} />} />
        <Route path='editarTarefa/:id' element={<EditarTarefa tarefas={tarefas} setTarefas={setTarefas} />} />
      </Route>
    </Routes>
  );
}
