import axios from 'axios';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

//schema de validação de edição de tarefas 
const schemaEditarTarefas = z.object({
    prioridade: z.enum(["baixa", "media", "alta"], {
        errorMap: ()=>({message: "Escolha uma prioridade"})
    }), 
    status: z.enum(["a fazer", "fazendo", "pronto"], {
        errorMap: ()=>({message:"Escolha o estado da tarefa"}),
    })
})

export function EditarTarefa(){
    const { id } = useParams(); //pega o id passado na rota
    const [tarefa, setTarefa] = useState(null)

    const{
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({resolver: zodResolver(schemaEditarTarefas)});

    useEffect(()=>{
        axios
            .get(`http://127.0.0.1:8000/aplicacao/tarefas/${id}/`)
            .then((res)=>{
            
                console.log(res)
                setTarefa(res.data);
                reset({

                })
            })
            .catch((err) => console.error("Erro ao buscar tarefa", err))
    }, [id, reset]);

    async function salvarEdicao(data){
        try{
            await axios.patch(`http://127.0.0.1:8000/aplicacao/tarefas/${id}/`, data);
            console.log("Os dados foram: ", data)
            alert("Tarefa editada com sucesso")
        }catch(err){
            console.error("Deu ruim", err)
            alert("Houve um erro ao editar a tarefa")
        }
    }
return(
    <section>
        <h2>Editar Tarefa</h2>
        <form onSubmit={handleSubmit(salvarEdicao)}>
            <label>Descrição</label>
            <textarea value= {tarefa.descricao} readOnly/>
            <label>Setor</label>
            <input type="text" value={tarefa.setor} readOnly/>

            <label>Prioridade:</label>
            <select {...register('prioridade')}>
                <option value="">Selecione</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
            </select>
            {errors.prioridade && <p>{errors.prioridade.message}</p>}

            <label>Status:</label>
            <select {...register('status')}>
                <option value="a fazer">A fazer</option>
                <option value="fazendo">Fazendo</option>
                <option value="pronto">Feito</option>
            </select>
            {errors.status && <p>{errors.status.message}</p>}

            <button type='submit'>Editar</button>
            
        </form>
    </section>
)

}