import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

// Constantes que serão usadas nas escolhas mais tarde
const ESCOLHA_PRIORIDADE = ['baixa', 'media', 'alta'];
const ESCOLHA_STATUS = ['a fazer', 'fazendo', 'feito'];

// Validações e prevenções a erros 
const schemaCadTarefa = z.object({
  descricao: z.string()
    .min(10, 'Insira ao menos 10 caracteres')
    .max(300, 'Insira até 300 caracteres'),
  nome_setor: z.string()
    .min(10, 'Insira ao menos 10 caracteres')
    .max(300, 'Insira até 300 caracteres')
    .regex(/^[^\d]*$/, 'Números não são permitidos nesse campo'),
  prioridade: z.enum(ESCOLHA_PRIORIDADE, {
    errorMap: () => ({ message: 'Selecione uma das opções disponíveis' }),
  }),
  status: z.enum(ESCOLHA_STATUS),
  usuario: z.number().min(1, 'Selecione um usuário'),
});

export function CadTarefa({ setTarefas }) {
  const [usuarios, setUsuarios] = useState([]);

  // Busca os usuários do backend ao montar o componente
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/aplicacao/usuario/");
        setUsuarios(res.data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    }
    fetchUsuarios();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schemaCadTarefa),
    mode: "onChange",
  });

  async function obterdados(data) {
    try {
      // Cadastra a tarefa
      const resPost = await axios.post("http://127.0.0.1:8000/aplicacao/tarefas/", data);
      alert("Tarefa cadastrada com sucesso!");

      // Atualiza o estado centralizado do quadro
      setTarefas(prev => [...prev, resPost.data]);

      // Limpa o formulário
      reset();
    } catch (err) {
      alert("Cadastro não concluído!");
      console.error("Erro no backend:", err.response || err);
    }
  }

  // Render do formulário
  return (
    <form className="formulario" onSubmit={handleSubmit(obterdados)} aria-labelledby="cadastro-tarefa-title">
      <h2 id="cadastro-tarefa-title">Cadastro de Tarefa</h2>

      <label htmlFor='descricao'>Descrição:</label>
      <textarea
        id="descricao"
        type='text'
        placeholder='Descrição da tarefa'
        {...register("descricao")}
        aria-invalid={errors.descricao ? "true" : "false"}
        aria-describedby={errors.descricao ? "descricao-error" : undefined}
      />
      {errors.descricao && <p id="descricao-error">{errors.descricao.message}</p>}

      <label htmlFor='nome_setor'>Nome do Setor:</label>
      <input
        id="nome_setor"
        type='text'
        placeholder='Nome do setor'
        {...register("nome_setor")}
        aria-invalid={errors.nome_setor ? "true" : "false"}
        aria-describedby={errors.nome_setor ? "nome_setor-error" : undefined}
      />
      {errors.nome_setor && <p id="nome_setor-error">{errors.nome_setor.message}</p>}

      <label htmlFor='prioridade'>Prioridade:</label>
      <select
        id="prioridade"
        {...register("prioridade")}
        aria-invalid={errors.prioridade ? "true" : "false"}
        aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
      >
        <option value="">Selecione uma das opções</option>
        {ESCOLHA_PRIORIDADE.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {errors.prioridade && <p id="prioridade-error">{errors.prioridade.message}</p>}

      <input
        type="hidden"
        value="a fazer"
        {...register("status")}
        aria-invalid={errors.status ? "true" : "false"}
      />
      {errors.status && <p>{errors.status.message}</p>}

      <label htmlFor='usuario'>Usuário:</label>
      <select
        id='usuario'
        {...register('usuario', { valueAsNumber: true })}
        aria-invalid={errors.usuario ? "true" : "false"}
        aria-describedby={errors.usuario ? "usuario-error" : undefined}
      >
        <option value="">Selecione um usuário</option>
        {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
      </select>
      {errors.usuario && <p id="usuario-error">{errors.usuario.message}</p>}

      <button type='submit'>Cadastrar</button>
    </form>
  );
}
