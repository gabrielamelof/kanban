import axios from 'axios'; // é o hookque faz a comunicação com a internet (HTTP). são hooks que permitem a validação de interação com o usuário
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';// permite a validação de formulários
 
//validação de formulário - usando as regras do zod , que podem ser encontradas na web
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1,'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres')
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
        "Digite nome completo (nome e sobrenome), sem números ou símbolos, sem espaços no início/fim"
    ),

    email: z.string()
        .min(1, 'Insira seu email')
        .max(30, 'Insira um endereço de email com até 30 carateres')
        .email("Formato de email invalido")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Formato de email inválido"),
})
 
 
export function CadUsuario(){

    const {
        register, // registra o que o usuário faz
        handleSubmit, // assim que ele der um submit no formulário
        setValue, // se der erro no formulário, guarda os erros na variável errors
        reset, // limpo o formulário depois do cadastro
        formState: { errors, isSubmitting},
    }=useForm({
        resolver: zodResolver(schemaCadUsuario), 
        mode: "onChange",
    });

    // Tratamento para o campo nome (apenas para prevenir entrada inválida antes do submit)
  const handleNomeChange = (e) => {
    let valor = e.target.value;
    valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, ""); // só letras e espaço
    valor = valor.replace(/\s{2,}/g, " "); // evita espaços duplos
    if (valor.length > 30) valor = valor.slice(0, 30); // máximo 30 chars
    setValue("name", valor);
  };
   // Tratamento para o campo email
  const handleEmailChange = (e) => {
    let valor = e.target.value.trim();
    if (valor.length > 50) valor = valor.slice(0, 50); // máximo 50 chars
    setValue("email", valor);
  };




    async function obterdados(data){
        console.log('dados inofrmados pelo usuário: ',data)
         //Para grande parte das interações com outra plataforma é necessário usar o try
         try{
            await axios.post("http://127.0.0.1:8000/aplicacao/usuario/", data);
            alert("Usuário cadastrado com sucesso");
        }catch(error){
            alert("Cadastro não concluído!!");
            console.log("Erros: ", error)
        }
    }
   
       
    return(
        <form className="formularios" onSubmit={handleSubmit(obterdados)}>
            <h2>Cadastro do Usuário</h2>
 
            <label>Nome:</label>
            <input type='text' placeholder='Jose da Silva' {...register("nome")} onChange={handleNomeChange}/>
            {/* para ver a variável errors no campo nome e exibo a mensagem para o usuário */}
            {errors.nome && <p>{errors.nome.message}</p>}
 
            <label>E-mail</label>
            <input type='email' placeholder='email@email.com' {...register("email")} onChange={handleEmailChange}/>
             {errors.email && <p>{errors.email.message}</p>}               
 
            <button type='submit' >Cadastrar</button>
 
        </form>
    )
}