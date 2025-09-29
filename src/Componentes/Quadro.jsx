import { Coluna } from "./Coluna";
import axios from 'axios';
import { DndContext } from "@dnd-kit/core";

export function Quadro({ tarefas = [], setTarefas }) {
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || !active) return;

    const tarefaId = active.id;
    const novaColuna = over.id;

    // Atualiza estado local das tarefas
    setTarefas(prev =>
      prev.map(t => String(t.id) === String(tarefaId) ? { ...t, status: novaColuna } : t)
    );

    // Atualiza status da tarefa no backend
    axios.patch(`http://127.0.0.1:8000/aplicacao/tarefas/${tarefaId}/`, { status: novaColuna })
      .catch(err => console.error("Erro ao atualizar status:", err));
  }

  // Filtra tarefas por coluna
  const tarefasAfazer = tarefas.filter(t => t.status === 'a fazer');
  const tarefasFazendo = tarefas.filter(t => t.status === 'fazendo');
  const tarefasFeito = tarefas.filter(t => t.status === 'pronto');

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* Região principal do quadro, acessível */}
      <main className="conteiner" aria-label="Quadro de tarefas">
        <h1>Meu Quadro</h1>
        
        {/* Colunas do quadro com ARIA aplicadas no próprio componente Coluna */}
        <Coluna 
          id="a fazer" 
          titulo="A Fazer" 
          tarefas={tarefasAfazer} 
          setTarefas={setTarefas} 
        />
        <Coluna 
          id="fazendo" 
          titulo="Fazendo" 
          tarefas={tarefasFazendo} 
          setTarefas={setTarefas} 
        />
        <Coluna 
          id="pronto" 
          titulo="Feito" 
          tarefas={tarefasFeito} 
          setTarefas={setTarefas} 
        />
      </main>
    </DndContext>
  );
}
