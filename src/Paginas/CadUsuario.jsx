import axios from 'axios'; // comunicação HTTP
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'; // validação de formulário

// Validação do formulário com Zod
const schemaCadUsuario = z.object({
  nome: z.string()
    .min(1, 'Insira ao menos 1 caractere')
    .max(30, 'Insira até 30 caracteres')
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
      'Digite nome completo (nome e sobrenome), sem números ou símbolos, sem espaços no início/fim'
    ),
  email: z.string()
    .min(1, 'Insira seu email')
    .max(30, 'Insira um endereço de email com até 30 caracteres')
    .email('Formato de email inválido')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Formato de email inválido'),
});

export function CadUsuario() {

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaCadUsuario),
    mode: 'onSubmit',
  });

  // Tratamento de campo nome
  const handleNomeChange = (e) => {
    let valor = e.target.value;
    valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, ''); // só letras e espaço
    valor = valor.replace(/\s{2,}/g, ' '); // evita espaços duplos
    if (valor.length > 30) valor = valor.slice(0, 30);
    // 👇 força revalidação
    setValue('nome', valor, { shouldValidate: true });
  };

  // Tratamento de campo email
  const handleEmailChange = (e) => {
    let valor = e.target.value.trim();
    if (valor.length > 50) valor = valor.slice(0, 50);
    // 👇 força revalidação
    setValue('email', valor, { shouldValidate: true });
  };

  async function obterdados(data) {
    console.log('Dados informados pelo usuário: ', data);
    try {
      await axios.post('http://127.0.0.1:8000/aplicacao/usuario/', data);
      alert('Usuário cadastrado com sucesso');
      reset({ nome: '', email: '' }); // limpa o formulário após cadastro
    } catch (error) {
      alert('Cadastro não concluído!');
      console.log('Erros: ', error);
    }
  }

  return (
    <section
      className="formulario"
      role="region"
      aria-label="Formulário de cadastro de usuário"
    >
      <h2>Cadastro de Usuário</h2>
      <form role="form" onSubmit={handleSubmit(obterdados)}>

        {/* Campo Nome */}
        <label htmlFor="nome">Nome:</label>
        <input
          id="nome"
          type="text"
          placeholder="Nome Sobrenome"
          {...register('nome')}
          onChange={handleNomeChange}
          aria-invalid={errors.nome ? 'true' : 'false'}
          aria-describedby={errors.nome ? 'erro-nome' : undefined}
        />
        {errors.nome && <p id="erro-nome">{errors.nome.message}</p>}

        {/* Campo Email */}
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="email@dominio.com"
          {...register('email')}
          onChange={handleEmailChange}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'erro-email' : undefined}
        />
        {errors.email && <p id="erro-email">{errors.email.message}</p>}

        <div className="containerBtn">
          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </div>

      </form>
    </section>
  );
}
