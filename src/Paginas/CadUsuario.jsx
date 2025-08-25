import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4-mini';
import { zodResolver } from '@hookform/resolvers/zod';

//Validação de formulário
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres'),
    email:s.string()
        .min(1, 'Insira seu e-mail')
        .max(30, 'Insira um endereço de e-mail com até 30 caracteres')
        .email("Formato de e-mail inválido"),

    

})

export function CadUsuario(){
    return(
       <form action="">
            <h2>Cadastro do Usuário</h2>

            <label>Nome:</label>
            <input type="text" placeholder='Nome do usuário' required/>

            <label>E-mail:</label>
            <input type="text" placeholder='email@email.com' required/>

            <button type='submit'>Cadastrar</button>
       </form>
    )
}