import { Link } from "react-router-dom";

export function BarraNavegacao(){
    return(
        <nav className="barra">
            <ul>
                <Link to ='/cadUsuario'><li>Cadastro de Usuário</li></Link>
                <Link to ='/cadTarefa'><li>Cadastro de Tarefa</li></Link>
                <Link to ='/'><li>Gerenciamento de tarefas</li></Link>
            </ul>
        </nav>
    )

}