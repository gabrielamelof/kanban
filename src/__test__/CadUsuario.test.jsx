import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadUsuario } from "../Paginas/CadUsuario";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";


vi.mock("axios"); 

describe("CadUsuario", () => {

  beforeEach(() => {
    window.alert = vi.fn(); 
    vi.clearAllMocks(); 
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

    const titulo = screen.getByText(/Cadastro de Usuário/i);
    expect(titulo).toBeTruthy();

    const formulario = screen.getByRole("form");
    expect(formulario).toBeTruthy();


    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/Email/i);
    expect(nomeInput).toBeTruthy();
    expect(emailInput).toBeTruthy();

    const botao = screen.getByRole("button", { name: /Cadastrar/i });
    expect(botao).toBeTruthy();
  });

  it("não deve permitir símbolos no campo Nome", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);

  fireEvent.input(nomeInput, { target: { value: "Maria@#123" } });

  await waitFor(() => {
    expect(nomeInput.value).toBe("Maria");
  });
  });

  it("não deve permitir que os campos ultrapassem o limite máximo de caracteres", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);

  const nomeGrande = "Maria Silva Sobrenome Muito Longo Extra";
  fireEvent.input(nomeInput, { target: { value: nomeGrande } });


  const emailGrande = "exemploemailmuitolongoquedeveriaultrapassar@dominio.com";
  fireEvent.input(emailInput, { target: { value: emailGrande } });

  await waitFor(() => {
    expect(nomeInput.value.length).toBeLessThanOrEqual(30);
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

    fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria Silva" } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: "emailinvalido" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
    });
  });

  it("deve resetar os campos após submissão", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "ok" } });

    render(<CadUsuario />);

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const botao = screen.getByRole("button", { name: /Cadastrar/i });

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


  fireEvent.input(nomeInput, { target: { value: "   " } });
  fireEvent.input(emailInput, { target: { value: "   " } });

  fireEvent.click(botao);

  await waitFor(() => {
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


  fireEvent.input(nomeInput, { target: { value: "Maria Silva" } });
  fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

  fireEvent.click(botao);

  await waitFor(() => {
    expect(nomeInput.value).toBe("");
    expect(emailInput.value).toBe("");
  });
});

it("não deve permitir números no campo Nome", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);

  fireEvent.input(nomeInput, { target: { value: "Maria123 Silva456" } });

  await waitFor(() => {
    expect(nomeInput.value).toBe("Maria Silva");
  });
});

it("deve validar o limite mínimo de caracteres nos campos", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });

  fireEvent.input(nomeInput, { target: { value: "" } });
  fireEvent.input(emailInput, { target: { value: "" } });

  fireEvent.click(botao);

  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy();
    expect(screen.getByText(/Insira seu email/i)).toBeTruthy();
  });
});

it("não deve permitir email com formato inválido", async () => {
  render(<CadUsuario />);

  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });


  fireEvent.input(emailInput, { target: { value: "email-invalido" } });

  fireEvent.click(botao);

  await waitFor(() => {
    const erroEmail = screen.queryByText(/Formato de email inválido/i);
    expect(erroEmail).to.exist;
  });
});





it("não deve permitir submissão se algum campo estiver vazio", async () => {
  render(<CadUsuario />);

  const nomeInput = screen.getByLabelText(/Nome/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const botao = screen.getByRole("button", { name: /Cadastrar/i });


  fireEvent.input(emailInput, { target: { value: "maria@email.com" } });
  fireEvent.click(botao);

  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy(); 
  });


  fireEvent.input(nomeInput, { target: { value: "Maria Silva" } });
  fireEvent.input(emailInput, { target: { value: "" } });
  fireEvent.click(botao);

  await waitFor(() => {
    expect(screen.getByText(/Insira seu email/i)).toBeTruthy(); 
  });

  fireEvent.input(emailInput, { target: { value: "maria@email.com" } });
  fireEvent.click(botao);

  await waitFor(() => {
    expect(nomeInput.value).toBe(""); 
    expect(emailInput.value).toBe("");
  });
});

});
