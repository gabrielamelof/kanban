import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadUsuario } from "../Paginas/CadUsuario";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";


vi.mock("axios"); //evita requisições reais

describe("CadUsuario", () => {

  beforeEach(() => {
    window.alert = vi.fn(); // Evita alertas bloqueando o teste
    vi.clearAllMocks(); // Limpa mocks entre os testes
  });

    it("deve renderizar todos os campos do formulário", () => {
      render(<CadUsuario />);

      const nomeInput = screen.getByLabelText(/Nome/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const botao = screen.getByRole("button", { name: /Cadastrar/i });

      expect(nomeInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(botao).toBeTruthy();
    });

    it("deve renderizar a tela de cadastro de usuário", () => {
    render(<CadUsuario />);

    //Para ver se o título da página é mostrado
    const titulo = screen.getByText(/Cadastro de Usuário/i);
    expect(titulo).toBeTruthy();

    // Verifica se o formulário está presente
    const formulario = screen.getByRole("form");
    expect(formulario).toBeTruthy();

    // Verifica se os campos Nome e Email estão presentes
    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/Email/i);
    expect(nomeInput).toBeTruthy();
    expect(emailInput).toBeTruthy();

    // Verifica se o botão Cadastrar está presente
    const botao = screen.getByRole("button", { name: /Cadastrar/i });
    expect(botao).toBeTruthy();
  });

  it("não deve permitir símbolos no campo Nome", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);

  // Tenta inserir caracteres inválidos
  fireEvent.input(nomeInput, { target: { value: "Maria@#123" } });

  // Espera o valor ser processado pelo handleNomeChange
  await waitFor(() => {
    // O valor deve conter apenas letras e espaços
    expect(nomeInput.value).toBe("Maria");
  });
  });

  it("não deve permitir que os campos ultrapassem o limite máximo de caracteres", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);

  // Tenta inserir mais de 30 caracteres no nome
  const nomeGrande = "Maria Silva Sobrenome Muito Longo Extra";
  fireEvent.input(nomeInput, { target: { value: nomeGrande } });

  // Tenta inserir mais de 50 caracteres no email
  const emailGrande = "exemploemailmuitolongoquedeveriaultrapassar@dominio.com";
  fireEvent.input(emailInput, { target: { value: emailGrande } });

  await waitFor(() => {
    // Nome deve ter no máximo 30 caracteres
    expect(nomeInput.value.length).toBeLessThanOrEqual(30);
    // Email deve ter no máximo 50 caracteres
    expect(emailInput.value.length).toBeLessThanOrEqual(50);
  });
});




  it("deve mostrar erros quando campos estiverem vazios", async () => {
    render(<CadUsuario />);

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
      expect(screen.getByText("Insira seu email")).toBeTruthy();
    });
  });

  it("deve mostrar erro quando o email tiver formato inválido", async () => {
    render(<CadUsuario />);

    // Nome válido completo para passar na validação de nome
    fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria Silva" } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: "emailinvalido" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
    });
  });

  it("deve resetar os campos após submissão", async () => {
    // Simula retorno bem-sucedido da API
    axios.post.mockResolvedValueOnce({ data: { message: "ok" } });

    render(<CadUsuario />);

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const botao = screen.getByRole("button", { name: /Cadastrar/i });

    // Nome completo válido
    fireEvent.input(nomeInput, { target: { value: "Maria Silva" } });
    fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

    fireEvent.click(botao);

    await waitFor(() => {
      expect(nomeInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });

  it("não deve permitir apenas espaços em branco nos campos", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });

  // Insere apenas espaços
  fireEvent.input(nomeInput, { target: { value: "   " } });
  fireEvent.input(emailInput, { target: { value: "   " } });

  // Submete o formulário
  fireEvent.click(botao);

  await waitFor(() => {
    // Verifica os erros que aparecem de fato
    expect(
      screen.getByText(/Digite nome completo \(nome e sobrenome\), sem números ou símbolos, sem espaços no início\/fim/i)
    ).toBeTruthy();
    expect(screen.getByText(/Insira seu email/i)).toBeTruthy();
  });
});

it("deve disparar a submissão ao clicar no botão", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });

  // Preenche os campos
  fireEvent.input(nomeInput, { target: { value: "Maria Silva" } });
  fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

  // Clica no botão
  fireEvent.click(botao);

  // Espera a submissão e a limpeza dos campos
  await waitFor(() => {
    expect(nomeInput.value).toBe("");
    expect(emailInput.value).toBe("");
  });
});

it("não deve permitir números no campo Nome", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);

  // Tenta inserir números
  fireEvent.input(nomeInput, { target: { value: "Maria123 Silva456" } });

  await waitFor(() => {
    // Verifica se os números foram removidos
    expect(nomeInput.value).toBe("Maria Silva");
  });
});

it("deve validar o limite mínimo de caracteres nos campos", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });

  // Limpa os campos ou insere valores vazios
  fireEvent.input(nomeInput, { target: { value: "" } });
  fireEvent.input(emailInput, { target: { value: "" } });

  fireEvent.click(botao);

  await waitFor(() => {
    // Verifica se os erros de mínimo aparecem
    expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy();
    expect(screen.getByText(/Insira seu email/i)).toBeTruthy();
  });
});

it("não deve permitir email com formato inválido", async () => {
  render(<CadUsuario />);

  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });

  // Digita um email inválido
  fireEvent.input(emailInput, { target: { value: "email-invalido" } });

  fireEvent.click(botao);

  await waitFor(() => {
    // Verifica se o erro do Zod é exibido
    const erroEmail = screen.queryByText(/Formato de email inválido/i);
    expect(erroEmail).to.exist;
  });
});





it("não deve permitir submissão se algum campo estiver vazio", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });

  // Cenário 1: nome vazio
  fireEvent.input(emailInput, { target: { value: "maria@email.com" } });
  fireEvent.click(botao);

  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy(); 
  });

  // Cenário 2: email vazio
  fireEvent.input(nomeInput, { target: { value: "Maria Silva" } });
  fireEvent.input(emailInput, { target: { value: "" } });
  fireEvent.click(botao);

  await waitFor(() => {
    expect(screen.getByText(/Insira seu email/i)).toBeTruthy(); 
  });

  // Cenário 3: todos preenchidos corretamente
  fireEvent.input(emailInput, { target: { value: "maria@email.com" } });
  fireEvent.click(botao);

  await waitFor(() => {
    // Mensagem de sucesso ou reset do formulário
    expect(nomeInput.value).toBe(""); 
    expect(emailInput.value).toBe("");
  });
});





});
