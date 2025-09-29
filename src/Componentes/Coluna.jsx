import { Tarefa } from './Tarefa';
import { useDroppable } from '@dnd-kit/core';

export function Coluna({ id, titulo, tarefas = [], setTarefas }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    // Define a coluna como lista acessível, com label associando ao título
    <section
      className="coluna"
      ref={setNodeRef}
      aria-labelledby={`${id}-titulo`}
    >
      <h2 id={`${id}-titulo`}>{titulo}</h2>

      {tarefas.map(tarefa => (
        <Tarefa
          key={tarefa.id}
          tarefa={tarefa}
          setTarefas={setTarefas} // essencial para atualizar o estado
        />
      ))}
    </section>
  );
}
