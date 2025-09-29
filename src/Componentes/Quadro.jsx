import { Coluna } from "./Coluna";
import axios from 'axios';
import { DndContext, DragOverlay } from "@dnd-kit/core"; // para o drag and drop
import { useState } from "react";
import { Tarefa } from "./Tarefa";

export function Quadro({ tarefas = [], setTarefas }) {
  const [activeId, setActiveId] = useState(null);

  function handleDragStart(event) {
    setActiveId(event.active.id); // guarda id da tarefa arrastada
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null); // limpa o overlay

    if (!over || !active) return;

    const tarefaId = active.id;
    const novaColuna = over.id;

    // Atualiza estado local
    setTarefas(prev =>
      prev.map(t => String(t.id) === String(tarefaId) ? { ...t, status: novaColuna } : t)
    );

    // Atualiza no backend
    axios
      .patch(`http://127.0.0.1:8000/aplicacao/tarefas/${tarefaId}/`, { status: novaColuna })
      .catch(err => console.error("Erro ao atualizar status:", err));
  }

  // Filtra tarefas por coluna
  const tarefasAfazer = tarefas.filter(t => t.status === "a fazer");
  const tarefasFazendo = tarefas.filter(t => t.status === "fazendo");
  const tarefasFeito = tarefas.filter(t => t.status === "pronto");

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="conteiner" aria-label="Quadro de tarefas">
        <h1>Meu Quadro</h1>

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

      {/* Para mostrar o item sendo arrastado de uma coluna para a outra */}
      <DragOverlay>
        {activeId ? (
          <Tarefa
            tarefa={tarefas.find(t => String(t.id) === String(activeId))}
            setTarefas={setTarefas}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
