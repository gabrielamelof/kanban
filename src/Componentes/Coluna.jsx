import { Tarefa } from './Tarefa';
import { useDroppable } from '@dnd-kit/core';//Inserindo os locais de soltura
 
export function Coluna({ id, titulo, tarefas = [] }) {
  //fazendo o controle do ambiente de soltura
  const { setNodeRef } = useDroppable({ id })
 
  return (
    <section className="coluna" ref={setNodeRef}>
      <h2>{titulo}</h2>
      {tarefas.map(tarefa => {
        console.log("Renderizando:", tarefa);
        return <Tarefa key={tarefa.id} tarefa={tarefa} />;
      })}
    </section>
  );
}