import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from "vitest"; 
import { CadTarefa } from "../Paginas/CadTarefa";
import axios from "axios";

vi.mock("axios"); 

describe("CadTarefa", () => {
  it("deve renderizar o formulário corretamente", () => {
    render(<CadTarefa setTarefas={vi.fn()} />);

    expect(screen.getByLabelText(/Descrição/i)).not.toBeNull();
    expect(screen.getByLabelText(/Nome do Setor/i)).not.toBeNull();
    expect(screen.getByLabelText(/Prioridade/i)).not.toBeNull();
    expect(screen.getByLabelText(/Usuário/i)).not.toBeNull();

    const botao = screen.getByRole("button", { name: /Cadastrar/i });
    expect(botao).not.toBeNull();
  });

   it("deve exibir erro quando a descrição tem menos de 10 caracteres", async () => {
    render(<CadTarefa setTarefas={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "curta" }, 
    });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Insira ao menos 10 caracteres")).toBeInTheDocument();
    });
  });

  

  it("deve exibir erro quando o nome do setor contém números", async () => {
    render(<CadTarefa setTarefas={vi.fn()} />);

    const selectUsuario = screen.getByLabelText(/Usuário/i);
    const option = document.createElement("option");
    option.value = "1";
    option.textContent = "Usuário Teste";
    selectUsuario.appendChild(option);

    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
      target: { value: "Setor12345" }, 
    });
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "Descrição válida com mais de 10 caracteres" },
    });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), {
      target: { value: "baixa" },
    });
    fireEvent.change(screen.getByLabelText(/Usuário/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Números não são permitidos nesse campo")).toBeInTheDocument();
    });
  });

 it("deve exibir erro quando a descrição ultrapassa 300 caracteres", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  const descricaoInput = screen.getByLabelText(/Descrição/i);

  const textoLongo = "a".repeat(301);

  fireEvent.change(descricaoInput, { target: { value: textoLongo } });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText("Insira no máximo 300 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando o campo 'Nome do Setor' estiver vazio", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });


  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText("Insira ao menos 10 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando o campo 'Descrição' estiver vazio", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });



  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText("Insira no mínimo 10 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando o nome do setor ultrapassa 300 caracteres", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  const textoLongo = "a".repeat(301);

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: textoLongo },
  });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText("Insira até 300 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando nenhum usuário for selecionado", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: "" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText("Selecione um usuário")).toBeInTheDocument();
  });
});

it("não deve enviar o formulário se algum dado obrigatório estiver vazio", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  axios.post.mockClear();

  render(<CadTarefa setTarefas={mockSetTarefas} />);

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "" }, 
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 10 caracteres/i)).toBeInTheDocument();
  });

  expect(axios.post).not.toHaveBeenCalled();

  expect(mockSetTarefas).not.toHaveBeenCalled();
});

it("exibe erro ao enviar formulário com prioridade inválida", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  render(<CadTarefa setTarefas={mockSetTarefas} />);

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "muito alta" },
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/Selecione uma das opções/i)).toBeInTheDocument();
  });

  expect(axios.post).not.toHaveBeenCalled();
  expect(mockSetTarefas).not.toHaveBeenCalled();
});

it("não envia o formulário com status inválido", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  const { container } = render(<CadTarefa setTarefas={mockSetTarefas} />);

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: "1" },
  });


  const statusInput = container.querySelector('input[name="status"]');
  fireEvent.change(statusInput, { target: { value: "invalido" } });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(axios.post).not.toHaveBeenCalled();
    expect(mockSetTarefas).not.toHaveBeenCalled();
  });
});

it("exibe alerta de erro ao falhar no cadastro (POST)", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  axios.post.mockRejectedValueOnce(new Error("Erro no servidor"));

  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<CadTarefa setTarefas={mockSetTarefas} />);

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith("Cadastro não concluído!");
    expect(mockSetTarefas).not.toHaveBeenCalled();
  });

  alertMock.mockRestore();
});


it("atualiza aria-invalid e aria-describedby no campo descrição", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  const descricao = screen.getByLabelText(/Descrição/i);

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  const erroDescricao = await screen.findByText((content, element) =>
    element.tagName.toLowerCase() === 'p' &&
    content.includes('Insira no mínimo 10 caracteres')
  );

  expect(descricao).toHaveAttribute("aria-invalid", "true");
  expect(descricao).toHaveAttribute("aria-describedby", "descricao-error");

  fireEvent.change(descricao, { target: { value: "Descrição válida com mais de 10 caracteres" } });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.queryByText((content, element) =>
      element.tagName.toLowerCase() === 'p' &&
      content.includes('Insira no mínimo 10 caracteres')
    )).not.toBeInTheDocument();
  });

  expect(descricao).toHaveAttribute("aria-invalid", "false");
  expect(descricao).not.toHaveAttribute("aria-describedby");
});

it("deve exibir erro quando a prioridade não for selecionada", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/Selecione uma das opções/i)).toBeInTheDocument();
  });

  const prioridadeInput = screen.getByLabelText(/Prioridade/i);
  expect(prioridadeInput).toHaveAttribute("aria-invalid", "true");
  expect(prioridadeInput).toHaveAttribute("aria-describedby", "prioridade-error");
});


it("deve exibir erro quando a descrição contém apenas espaços", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "     " }, 
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/Insira no mínimo 10 caracteres/i)).toBeInTheDocument();
  });

  const descricaoInput = screen.getByLabelText(/Descrição/i);
  expect(descricaoInput).toHaveAttribute("aria-invalid", "true");
  expect(descricaoInput).toHaveAttribute("aria-describedby", "descricao-error");
});

it("deve exibir erro quando o nome do setor contém apenas espaços", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "     " }, // apenas espaços
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 10 caracteres/i)).toBeInTheDocument();
  });

  const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
  expect(nomeSetorInput).toHaveAttribute("aria-invalid", "true");
  expect(nomeSetorInput).toHaveAttribute("aria-describedby", "nome_setor-error");
});

it("deve exibir erro quando o usuário selecionado não está listado ou é inválido", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const optionValido = document.createElement("option");
  optionValido.value = "1";
  optionValido.textContent = "Usuário Teste";
  selectUsuario.appendChild(optionValido);

  fireEvent.change(selectUsuario, { target: { value: "999" } });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/Selecione um usuário/i)).toBeInTheDocument();
  });

  expect(selectUsuario).toHaveAttribute("aria-invalid", "true");
  expect(selectUsuario).toHaveAttribute("aria-describedby", "usuario-error");
});


it("deve enviar o formulário corretamente quando todos os campos são válidos", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  axios.post.mockResolvedValueOnce({
    data: {
      id: 123,
      descricao: "Descrição válida com mais de 10 caracteres",
      nome_setor: "Setor válido",
      prioridade: "baixa",
      usuario: 1,
      status: "a fazer",
    },
  });

  render(<CadTarefa setTarefas={mockSetTarefas} />);

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: 1 }, 
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/aplicacao/tarefas/", 
      expect.objectContaining({
        descricao: "Descrição válida com mais de 10 caracteres",
        nome_setor: "Setor válido",
        prioridade: "baixa",
        usuario: 1, // número
        status: "a fazer",
      })
    );
    
    expect(mockSetTarefas).toHaveBeenCalled();
  });

  expect(screen.getByLabelText(/Descrição/i).value).toBe("");
  expect(screen.getByLabelText(/Nome do Setor/i).value).toBe("");
  expect(screen.getByLabelText(/Prioridade/i).value).toBe("");
  expect(screen.getByLabelText(/Usuário/i).value).toBe("");
});

it("deve limpar todos os campos após envio bem-sucedido", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  axios.post.mockResolvedValueOnce({
    data: {
      id: 123,
      descricao: "Descrição válida com mais de 10 caracteres",
      nome_setor: "Setor válido",
      prioridade: "baixa",
      usuario: 1,
      status: "a fazer",
    },
  });

  render(<CadTarefa setTarefas={mockSetTarefas} />);
  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: 1 },
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
    expect(mockSetTarefas).toHaveBeenCalled();
  });

  expect(screen.getByLabelText(/Descrição/i).value).toBe("");
  expect(screen.getByLabelText(/Nome do Setor/i).value).toBe("");
  expect(screen.getByLabelText(/Prioridade/i).value).toBe("");
  expect(screen.getByLabelText(/Usuário/i).value).toBe("");
});


it("deve atualizar aria-invalid e aria-describedby para todos os campos inválidos além da descrição", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  const erroDescricao = await screen.findByText(/Insira no mínimo 10 caracteres/i);
  const erroNomeSetor = await screen.findByText(/Insira ao menos 10 caracteres/i);
  const erroPrioridade = await screen.findByText(/Invalid option: expected one of/i);
  const erroUsuario = await screen.findByText(/Invalid input: expected number/i);

  const descricaoInput = screen.getByLabelText(/Descrição/i);
  expect(descricaoInput).toHaveAttribute("aria-invalid", "true");
  expect(descricaoInput).toHaveAttribute("aria-describedby", "descricao-error");

  const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
  expect(nomeSetorInput).toHaveAttribute("aria-invalid", "true");
  expect(nomeSetorInput).toHaveAttribute("aria-describedby", "nome_setor-error");

  const prioridadeSelect = screen.getByLabelText(/Prioridade/i);
  expect(prioridadeSelect).toHaveAttribute("aria-invalid", "true");
  expect(prioridadeSelect).toHaveAttribute("aria-describedby", "prioridade-error");

  const usuarioSelect = screen.getByLabelText(/Usuário/i);
  expect(usuarioSelect).toHaveAttribute("aria-invalid", "true");
  expect(usuarioSelect).toHaveAttribute("aria-describedby", "usuario-error");
});


it("botão de enviar deve estar habilitado e permitir clique, mas sem dados não envia", () => {
  const setTarefas = vi.fn();
  render(<CadTarefa setTarefas={setTarefas} />);

  const botaoCadastrar = screen.getByRole("button", { name: /Cadastrar/i });

  expect(botaoCadastrar).toBeEnabled();

  fireEvent.click(botaoCadastrar);

  expect(setTarefas).not.toHaveBeenCalled();
});

it("verifica se os placeholders estão corretos", () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  expect(screen.getByPlaceholderText(/Descrição da tarefa/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Nome do setor/i)).toBeInTheDocument();
});

});  