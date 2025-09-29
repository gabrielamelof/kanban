import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

const ESCOLHA_PRIORIDADE = ['baixa', 'media', 'alta'];
const ESCOLHA_STATUS = ['a fazer', 'fazendo', 'feito'];

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

  return (
    <form className="formulario" onSubmit={handleSubmit(obterdados)}>
      <h2>Cadastro de Tarefa</h2>

      <label>Descrição:</label>
      <input type='text' placeholder='Descrição da tarefa' {...register("descricao")} />
      {errors.descricao && <p>{errors.descricao.message}</p>}

      <label>Nome do Setor:</label>
      <input type='text' placeholder='Nome do setor' {...register("nome_setor")} />
      {errors.nome_setor && <p>{errors.nome_setor.message}</p>}

      <label>Prioridade:</label>
      <select {...register("prioridade")}>
        <option value="">Selecione uma das opções</option>
        {ESCOLHA_PRIORIDADE.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {errors.prioridade && <p>{errors.prioridade.message}</p>}

      <input type="hidden" value="a fazer" {...register("status")} />
      {errors.status && <p>{errors.status.message}</p>}

      <label>Usuário:</label>
      <select {...register('usuario', { valueAsNumber: true })}>
        <option value="">Selecione um usuário</option>
        {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
      </select>
      {errors.usuario && <p>{errors.usuario.message}</p>}

      <button type='submit'>Cadastrar</button>
    </form>
  );
}
