import { Link } from "react-router-dom";

// Barra de navegação com links para as páginas do site
export function BarraNavegacao(){
    return(
        <nav className="barra">
            <ul>
                <li>
                    <Link to ='/cadUsuario'>
                        Cadastro de Usuário
                    </Link>
                    
                </li>
                <li>
                    
                    <Link to ='/cadTarefa'>
                        Cadastro de Tarefa
                    </Link>
                </li>
                <li>
                    
                    <Link to ='/'>
                        Gerenciamento de tarefas
                    </Link>
                </li>
            </ul>
        </nav>
    )

}