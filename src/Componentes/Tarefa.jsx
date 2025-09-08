import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Tarefa({ tarefa }){
    const [status, setStatus] = useState(tarefa.status || "");
    const navigate = useNavigate();

    async function alterarStatus() {
        try{
            await axios.patch(`http://127.0.0.1:8000/aplicacao/tarefas/${tarefa.id}/`, {
                status: status,
            });
            alert("Tarefa alterada com sucesso!!")
            window.location.reload(); // atualiza a página
        }catch(error){
            console.error("erro ao alterar status da tarefa", error);
            alert("Houve um erro na alteração de status");
        }
    }

    //fazendo a exclusão de uma tarefa
    // async é pq eu não sei o tempo exato de resposta
    // as funções devem ter nomes que remetam a sua funcionalidade
    async function excluitTarefa(id) {
        if(confirm("Tem certeza de que quer excluir essa tarefa?")){
            try{
                await axios.delete(`http://127.0.0.1:8000/aplicacao/tarefas/${id}/`);
                alert("Tarefa excluída com sucesso");
                window.location.reload(); //refresh
            }catch(error){
                console.error("Erro ao excluir a tarefa", error);
                alert("Erro ao excluir");

            }
        }
    }
    return(
        <section className="container">
            <article className="caixa">
                <h3 id={`tarefa: ${tarefa.id}`}>{tarefa.descricao}</h3>
                <dl>
                    <dt>Setor:</dt>
                    <dd>{tarefa.nome_setor}</dd>

                    <dt>Prioridade:</dt>
                    <dd>{tarefa.prioridade}</dd>
                </dl>
                <button onClick={()=>navigate(`/editarTarefa/${tarefa.id}`)}>Editar</button>
                <button onClick={() => excluitTarefa(tarefa.id)}>Excluir</button>
                <form>
                    <label>Status:</label>
                        <select name="status" id={tarefa.id} value= {status}
                        onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="a fazer">A Fazer</option>
                        <option value="fazendo">Fazendo</option>
                        <option value="pronto">Feito</option>
                    </select>
                    <button onClick={alterarStatus}>Alterar Status</button>
                </form>
            </article>
        </section>
        
    )
}