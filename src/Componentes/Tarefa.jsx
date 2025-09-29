import { useDraggable } from '@dnd-kit/core'; // drag and drop
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Tarefa({ tarefa, setTarefas }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(tarefa.status || "");

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tarefa.id.toString(),
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  // Atualiza o status via select
  async function alterarStatus() {
    if (!status) return alert("Selecione um status válido");

    try {
      await axios.patch(`http://127.0.0.1:8000/aplicacao/tarefas/${tarefa.id}/`, { status });

      setTarefas(prev =>
        prev.map(t => (t.id === tarefa.id ? { ...t, status } : t))
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Houve um erro na alteração de status");
    }
  }

  // Excluir tarefa
  async function excluirTarefa() {
    if (!confirm("Tem certeza que deseja excluir essa tarefa?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/aplicacao/tarefas/${tarefa.id}/`);
      setTarefas(prev => prev.filter(t => t.id !== tarefa.id));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Houve um erro ao excluir a tarefa");
    }
  }

  return (
    <div className="container">
      {/* Para que cada tarefa seja um item seprado */}
      <article
        className="caixa"
        ref={setNodeRef}
        style={style}
        aria-grabbed={isDragging}
        aria-label={`Tarefa: ${tarefa.descricao}, setor: ${tarefa.nome_setor}, prioridade: ${tarefa.prioridade}, status: ${status}`}
      >
        {/* Cabeçalho arrastável */}
        <header {...listeners} {...attributes} tabIndex={0}
        role='banner'>
          <h3>{tarefa.descricao}</h3>
        </header>

        <dl>
          <dt id={`setor-${tarefa.id}`}>Setor:</dt>
          <dd aria-labelledby={`setor-${tarefa.id}`}>{tarefa.nome_setor}</dd>

          <dt id={`prioridade-${tarefa.id}`}>Prioridade:</dt>
          <dd aria-labelledby={`prioridade-${tarefa.id}`}>{tarefa.prioridade}</dd>

          <dt id={`usuario-${tarefa.id}`}>Vinculado a:</dt>
          <dd aria-labelledby={`usuario-${tarefa.id}`}>{tarefa.usuario_nome}</dd>
        </dl>

        <section className="botoes">
          <button
            type="button"
            onClick={() => navigate(`/editarTarefa/${tarefa.id}`)}
            onPointerDown={e => e.stopPropagation()}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={excluirTarefa}
            onPointerDown={e => e.stopPropagation()}
          >
            Excluir
          </button>
        </section>

        <section className="status">
          <label htmlFor={`status-${tarefa.id}`}>Status:</label>
          <select
            id={`status-${tarefa.id}`}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="a fazer">A Fazer</option>
            <option value="fazendo">Fazendo</option>
            <option value="pronto">Feito</option>
          </select>
          <button type="button" onClick={alterarStatus}>
            Alterar Status
          </button>
        </section>
      </article>
    </div>
  );
}
