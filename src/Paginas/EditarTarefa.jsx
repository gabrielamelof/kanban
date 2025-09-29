import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Schema de validação incluindo descrição, setor, prioridade e status
const schemaEditarTarefas = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  nome_setor: z.string().min(1, "Setor é obrigatório"),
  prioridade: z.enum(["baixa", "media", "alta"], {
    errorMap: () => ({ message: "Escolha uma prioridade" })
  }),
  status: z.enum(["a fazer", "fazendo", "pronto"], {
    errorMap: () => ({ message: "Escolha o estado da tarefa" }),
  })
});

export function EditarTarefa({ tarefas, setTarefas }) {
  const { id } = useParams();
  const [tarefa, setTarefa] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schemaEditarTarefas)
  });

  // Carrega a tarefa ao montar
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/aplicacao/tarefas/${id}/`)
      .then(res => {
        setTarefa(res.data);

        // Preenche o formulário com os dados do backend
        reset({
          descricao: res.data.descricao,
          nome_setor: res.data.nome_setor, // nome correto do campo
          prioridade: res.data.prioridade,
          status: res.data.status
        });
      })
      .catch(err => console.error("Erro ao buscar tarefa:", err));
  }, [id, reset]);

  // Salva edição
  async function salvarEdicao(data) {
    try {
      await axios.patch(`http://127.0.0.1:8000/aplicacao/tarefas/${id}/`, data);

      // Atualiza estado local da lista de tarefas
      setTarefas(prev =>
        prev.map(t => (t.id === Number(id) ? { ...t, ...data } : t))
      );

      alert("Tarefa editada com sucesso!");
      navigate("/"); // Volta para o quadro
    } catch (err) {
      console.error("Erro ao editar tarefa:", err);
      alert("Houve um erro ao editar a tarefa");
    }
  }

  if (!tarefa) return <p>Carregando tarefa...</p>;

  return (
    <section className="formulario" role="region" aria-label="Formulário de edição de tarefa">
      <h2>Editar Tarefa</h2>
      <form onSubmit={handleSubmit(salvarEdicao)}>

        {/* Campo Descrição */}
        <label htmlFor="descricao">Descrição (Apenas Leitura)</label>
        <textarea
          className='descricao-txt'
          readOnly
          id="descricao"
          {...register("descricao")}
          aria-invalid={errors.descricao ? "true" : "false"}
          aria-describedby={errors.descricao ? "erro-descricao" : undefined}
        />
        {errors.descricao && <p id="erro-descricao">{errors.descricao.message}</p>}

        {/* Campo Setor */}
        <label htmlFor="nome_setor">Setor: (Apenas Leitura)</label>
        <input
          className='setor_input'
          readOnly
          id="nome_setor"
          type="text"
          {...register("nome_setor")}
          aria-invalid={errors.nome_setor ? "true" : "false"}
          aria-describedby={errors.nome_setor ? "erro-setor" : undefined}
        />
        {errors.nome_setor && <p id="erro-setor">{errors.nome_setor.message}</p>}

        {/* Campo Prioridade */}
        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          {...register("prioridade")}
          aria-invalid={errors.prioridade ? "true" : "false"}
          aria-describedby={errors.prioridade ? "erro-prioridade" : undefined}
        >
          <option value="">Selecione</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.prioridade && <p id="erro-prioridade">{errors.prioridade.message}</p>}

        {/* Campo Status */}
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          {...register("status")}
          aria-invalid={errors.status ? "true" : "false"}
          aria-describedby={errors.status ? "erro-status" : undefined}
        >
          <option value="a fazer">A fazer</option>
          <option value="fazendo">Fazendo</option>
          <option value="pronto">Feito</option>
        </select>
        {errors.status && <p id="erro-status">{errors.status.message}</p>}

        <button type="submit">Editar</button>
      </form>
    </section>
  );
}
