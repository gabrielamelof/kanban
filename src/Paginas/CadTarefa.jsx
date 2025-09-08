import axios from 'axios'; // é o hookque faz a comunicação com a internet (HTTP). são hooks que permitem a validação de interação com o usuário
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';// permite a validação de formulários
import { useState, useEffect } from 'react';


const ESCOLHA_PRIORIDADE = ['baixa', 'media', 'alta'];
const ESCOLHA_STATUS = ['a fazer', 'fazendo', 'feito'];

//validação de formulário - usando as regras do zod , que podem ser encontradas na web
const schemaCadTarefa = z.object({
    descricao: z.string()
        .min(10,'Insira ao menos 10 caractere')
        .max(300, 'Insira até 30 caracteres'),

    nome_setor: z.string()
        .min(10,'Insira ao menos 10 caractere')
        .max(300, 'Insira até 30 caracteres')
        .regex(/^[^\d]*$/, 'Números não são permitidos nesse campo'),

    prioridade: z.enum(ESCOLHA_PRIORIDADE, {
       errorMap: () => ({message: 'Selecione uma das opções disponíveis'}),
    }),


    status: z.enum(ESCOLHA_STATUS, {
       errorMap: () => ({message: 'Selecione uma das opções disponíveis'}),
    }),
    usuario: z.number({
        invalid_type_error: 'Selecione uma das escolhas'
                            }).min(1, 'Selecione uma das escolhas'),
    



})

 
 
export function CadTarefa(){

    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/aplicacao/usuario/");
        console.log("Usuários recebidos:", response.data);
        setUsuarios(response.data); // ajuste se sua API retornar em outra estrutura
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchUsuarios();
  }, []);

    const {
        register, // registra o que o usuário faz
        handleSubmit, // assim que ele der um submit no formulário
        setValue, // se der erro no formulário, guarda os erros na variável errors
        reset, // limpo o formulário depois do cadastro
        formState: { errors, isSubmitting},
    }=useForm({
        resolver: zodResolver(schemaCadTarefa), 
        mode: "onChange",
    });



    async function obterdados(data){
        console.log('dados inofrmados pelo usuário: ',data)
         //Para grande parte das interações com outra plataforma é necessário usar o try
         try{
            await axios.post("http://127.0.0.1:8000/aplicacao/tarefas/", data);
            alert("Tarefa cadastrada com sucesso");
        }catch(error){
    alert("Cadastro não concluído!!");
    if (error.response) {
        console.log("Erro no backend:", error.response.data); // mostra a resposta JSON do Django
    } else {
        console.log("Erro desconhecido:", error);
    }
}
    }
   
       
    return(
        <form className="formularios" onSubmit={handleSubmit(obterdados)}>
            <h2>Cadastro de Tarefa</h2>
 
            <label>Descrição:</label>
            <input type='text' placeholder='Descrição do curso' {...register("descricao")}/>
            {/* para ver a variável errors no campo nome e exibo a mensagem para o usuário */}
            {errors.descricao && <p>{errors.descricao.message}</p>}
 
            <label>Nome do Setor:</label>
            <input type='text' placeholder='nome do setor' {...register("nome_setor")}/>
             {errors.nome_setor && <p>{errors.nome_setor.message}</p>}   
  

            <label>Prioridade:</label>
            <select type='text'  {...register("prioridade")}>
                <option value="">Selecione uma das opções</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
            </select>
            {/* para ver a variável errors no campo nome e exibo a mensagem para o usuário */}
            {errors.prioridade && <p>{errors.prioridade.message}</p>}

            <input type="hidden" value="a fazer" {...register("status")}/>
            {errors.status && <p>{errors.status.message}</p>}

            <label>Usuário:</label>
            <select {...register('usuario', { valueAsNumber: true })}>
            <option value="">selecione um usuário</option>
            {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
          ))}
        </select>
            {errors.usuario && <p>{errors.usuario.message}</p>}


           
 
            <button type='submit' >Cadastrar</button>
 
        </form>
    )
}