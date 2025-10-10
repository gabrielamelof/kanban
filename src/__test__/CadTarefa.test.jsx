import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from "vitest"; // se não estiver usando globals
import { CadTarefa } from "../Paginas/CadTarefa";
import axios from "axios";

vi.mock("axios"); 

describe("CadTarefa", () => {
  it("deve renderizar o formulário corretamente", () => {
    render(<CadTarefa setTarefas={vi.fn()} />);

    // Verifica se os campos existem
    expect(screen.getByLabelText(/Descrição/i)).not.toBeNull();
    expect(screen.getByLabelText(/Nome do Setor/i)).not.toBeNull();
    expect(screen.getByLabelText(/Prioridade/i)).not.toBeNull();
    expect(screen.getByLabelText(/Usuário/i)).not.toBeNull();

    // Verifica se o botão existe
    const botao = screen.getByRole("button", { name: /Cadastrar/i });
    expect(botao).not.toBeNull();
  });

   it("deve exibir erro quando a descrição tem menos de 10 caracteres", async () => {
    render(<CadTarefa setTarefas={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "curta" }, // menos de 10 caracteres
    });

    // Envia o formulário (sem preencher os outros campos necessários)
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Insira ao menos 10 caracteres")).toBeInTheDocument();
    });
  });

  

  it("deve exibir erro quando o nome do setor contém números", async () => {
    render(<CadTarefa setTarefas={vi.fn()} />);

    // Força a inserção de um option no select de usuário, porque está vazio
    const selectUsuario = screen.getByLabelText(/Usuário/i);
    const option = document.createElement("option");
    option.value = "1";
    option.textContent = "Usuário Teste";
    selectUsuario.appendChild(option);

    // Agora dispara as mudanças no form
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
      target: { value: "Setor12345" }, // contém números
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

  // Texto com 301 caracteres
  const textoLongo = "a".repeat(301);

  fireEvent.change(descricaoInput, { target: { value: textoLongo } });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText("Insira no máximo 300 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando o campo 'Nome do Setor' estiver vazio", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Preenche os outros campos obrigatórios corretamente
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  // Adiciona um usuário ao select manualmente (já que ele vem do backend)
  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  // O campo 'nome_setor' é deixado vazio de propósito

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Aguarda o erro ser exibido
  await waitFor(() => {
    expect(screen.getByText("Insira ao menos 10 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando o campo 'Descrição' estiver vazio", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Preenche os outros campos obrigatórios corretamente
  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  // Adiciona um usuário ao select manualmente (já que ele vem do backend)
  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  // O campo 'descricao' é deixado vazio de propósito (string vazia)

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Aguarda o erro ser exibido
  await waitFor(() => {
    expect(screen.getByText("Insira no mínimo 10 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando o nome do setor ultrapassa 300 caracteres", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Gera uma string com 301 caracteres
  const textoLongo = "a".repeat(301);

  // Preenche o campo nome_setor com essa string longa
  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: textoLongo },
  });

  // Preenche os outros campos com valores válidos
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  // Adiciona uma opção ao select usuário e seleciona ela
  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera a mensagem de erro aparecer
  await waitFor(() => {
    expect(screen.getByText("Insira até 300 caracteres")).toBeInTheDocument();
  });
});

it("deve exibir erro quando nenhum usuário for selecionado", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Preenche os outros campos com valores válidos
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  // Garante que o select usuário fique vazio (nenhum selecionado)
  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: "" },
  });

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera a mensagem de erro aparecer
  await waitFor(() => {
    expect(screen.getByText("Selecione um usuário")).toBeInTheDocument();
  });
});

it("não deve enviar o formulário se algum dado obrigatório estiver vazio", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  // Não mockar axios.post aqui porque não deve ser chamado
  axios.post.mockClear();

  render(<CadTarefa setTarefas={mockSetTarefas} />);

  // Espera os usuários carregarem no select
  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  // Preenche os campos necessários, mas deixa "nome_setor" vazio
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
    target: { value: "" }, // campo obrigatório vazio
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera aparecer o erro de validação relacionado ao "nome_setor"
  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 10 caracteres/i)).toBeInTheDocument();
  });

  // Axios.post não deve ter sido chamado porque o formulário está inválido
  expect(axios.post).not.toHaveBeenCalled();

  // setTarefas também não deve ser chamado
  expect(mockSetTarefas).not.toHaveBeenCalled();
});

it("exibe erro ao enviar formulário com prioridade inválida", async () => {
  const mockSetTarefas = vi.fn();

  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  render(<CadTarefa setTarefas={mockSetTarefas} />);

  // Espera os usuários carregarem no select
  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  // Preenche os demais campos corretamente
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "muito alta" }, // Valor inválido não listado em ESCOLHA_PRIORIDADE
  });

  fireEvent.change(screen.getByLabelText(/Usuário/i), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera que a mensagem de erro da prioridade seja exibida
  await waitFor(() => {
    expect(screen.getByText(/Selecione uma das opções/i)).toBeInTheDocument();
  });

  // Axios.post e setTarefas não devem ser chamados
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

  // Pega o input hidden status pelo container, que não tem role
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

  // Espionar o alert (caso esteja usando window.alert)
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<CadTarefa setTarefas={mockSetTarefas} />);

  // Aguarda os usuários serem carregados
  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  // Preenche o formulário com dados válidos
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

  // Envia o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera o alerta ser chamado
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith("Cadastro não concluído!");
    expect(mockSetTarefas).not.toHaveBeenCalled();
  });

  // Limpa o mock do alert
  alertMock.mockRestore();
});


it("atualiza aria-invalid e aria-describedby no campo descrição", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  const descricao = screen.getByLabelText(/Descrição/i);

  // Submete o formulário vazio
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Busca o erro de forma flexível (apenas parte do texto)
  const erroDescricao = await screen.findByText((content, element) =>
    element.tagName.toLowerCase() === 'p' &&
    content.includes('Insira no mínimo 10 caracteres')
  );

  // Verifica atributos ARIA
  expect(descricao).toHaveAttribute("aria-invalid", "true");
  expect(descricao).toHaveAttribute("aria-describedby", "descricao-error");

  // Corrige o campo
  fireEvent.change(descricao, { target: { value: "Descrição válida com mais de 10 caracteres" } });

  // Reenvia o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera o erro desaparecer
  await waitFor(() => {
    expect(screen.queryByText((content, element) =>
      element.tagName.toLowerCase() === 'p' &&
      content.includes('Insira no mínimo 10 caracteres')
    )).not.toBeInTheDocument();
  });

  // Verifica que aria-invalid voltou a false e aria-describedby sumiu
  expect(descricao).toHaveAttribute("aria-invalid", "false");
  expect(descricao).not.toHaveAttribute("aria-describedby");
});

it("deve exibir erro quando a prioridade não for selecionada", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Preenche os outros campos obrigatórios corretamente
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  // Adiciona um usuário ao select manualmente (já que ele vem do backend)
  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  // Mantém o campo "Prioridade" vazio de propósito

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera a mensagem de erro aparecer
  await waitFor(() => {
    expect(screen.getByText(/Selecione uma das opções/i)).toBeInTheDocument();
  });

  // Verifica se o campo recebeu aria-invalid
  const prioridadeInput = screen.getByLabelText(/Prioridade/i);
  expect(prioridadeInput).toHaveAttribute("aria-invalid", "true");
  expect(prioridadeInput).toHaveAttribute("aria-describedby", "prioridade-error");
});


it("deve exibir erro quando a descrição contém apenas espaços", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Preenche os outros campos obrigatórios corretamente
  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  // Adiciona um usuário ao select manualmente (já que ele vem do backend)
  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  // Preenche o campo "Descrição" apenas com espaços
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "     " }, // apenas espaços
  });

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera a mensagem de erro aparecer
  await waitFor(() => {
    expect(screen.getByText(/Insira no mínimo 10 caracteres/i)).toBeInTheDocument();
  });

  // Verifica se o campo recebeu aria-invalid
  const descricaoInput = screen.getByLabelText(/Descrição/i);
  expect(descricaoInput).toHaveAttribute("aria-invalid", "true");
  expect(descricaoInput).toHaveAttribute("aria-describedby", "descricao-error");
});

it("deve exibir erro quando o nome do setor contém apenas espaços", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Preenche os outros campos obrigatórios corretamente
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  // Adiciona um usuário ao select manualmente (já que ele vem do backend)
  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Usuário Teste";
  selectUsuario.appendChild(option);
  fireEvent.change(selectUsuario, { target: { value: "1" } });

  // Preenche o campo "Nome do Setor" apenas com espaços
  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "     " }, // apenas espaços
  });

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera a mensagem de erro aparecer
  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 10 caracteres/i)).toBeInTheDocument();
  });

  // Verifica se o campo recebeu aria-invalid
  const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
  expect(nomeSetorInput).toHaveAttribute("aria-invalid", "true");
  expect(nomeSetorInput).toHaveAttribute("aria-describedby", "nome_setor-error");
});

it("deve exibir erro quando o usuário selecionado não está listado ou é inválido", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Preenche os campos obrigatórios corretamente
  fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: "Descrição válida com mais de 10 caracteres" },
  });

  fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
    target: { value: "Setor válido" },
  });

  fireEvent.change(screen.getByLabelText(/Prioridade/i), {
    target: { value: "baixa" },
  });

  // Adiciona uma opção válida ao select de usuário
  const selectUsuario = screen.getByLabelText(/Usuário/i);
  const optionValido = document.createElement("option");
  optionValido.value = "1";
  optionValido.textContent = "Usuário Teste";
  selectUsuario.appendChild(optionValido);

  // Seleciona um valor inválido (não listado)
  fireEvent.change(selectUsuario, { target: { value: "999" } });

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera a mensagem de erro aparecer
  await waitFor(() => {
    expect(screen.getByText(/Selecione um usuário/i)).toBeInTheDocument();
  });

  // Verifica ARIA
  expect(selectUsuario).toHaveAttribute("aria-invalid", "true");
  expect(selectUsuario).toHaveAttribute("aria-describedby", "usuario-error");
});


it("deve enviar o formulário corretamente quando todos os campos são válidos", async () => {
  const mockSetTarefas = vi.fn();

  // Mock GET para popular select de usuário
  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  // Mock POST
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

  // Aguarda o select de usuário ser populado
  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  // Preenche campos corretamente
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
    target: { value: 1 }, // Número, não string
  });

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera o POST ser chamado corretamente
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/aplicacao/tarefas/", // endpoint correto
      expect.objectContaining({
        descricao: "Descrição válida com mais de 10 caracteres",
        nome_setor: "Setor válido",
        prioridade: "baixa",
        usuario: 1, // número
        status: "a fazer",
      })
    );

    // Verifica se setTarefas foi chamado
    expect(mockSetTarefas).toHaveBeenCalled();
  });

  // Campos limpos após envio
  expect(screen.getByLabelText(/Descrição/i).value).toBe("");
  expect(screen.getByLabelText(/Nome do Setor/i).value).toBe("");
  expect(screen.getByLabelText(/Prioridade/i).value).toBe("");
  expect(screen.getByLabelText(/Usuário/i).value).toBe("");
});

it("deve limpar todos os campos após envio bem-sucedido", async () => {
  const mockSetTarefas = vi.fn();

  // Mock GET para popular select de usuário
  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  // Mock POST
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

  // Aguarda o select de usuário ser populado
  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Usuário Teste" })).toBeInTheDocument();
  });

  // Preenche todos os campos
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

  // Submete o formulário
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Espera o POST ser chamado e setTarefas atualizado
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
    expect(mockSetTarefas).toHaveBeenCalled();
  });

  // Verifica se todos os campos foram limpos
  expect(screen.getByLabelText(/Descrição/i).value).toBe("");
  expect(screen.getByLabelText(/Nome do Setor/i).value).toBe("");
  expect(screen.getByLabelText(/Prioridade/i).value).toBe("");
  expect(screen.getByLabelText(/Usuário/i).value).toBe("");
});


it("deve atualizar aria-invalid e aria-describedby para todos os campos inválidos além da descrição", async () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  // Submete o formulário sem preencher nenhum campo
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

  // Aguarda os erros aparecerem
  const erroDescricao = await screen.findByText(/Insira no mínimo 10 caracteres/i);
  const erroNomeSetor = await screen.findByText(/Insira ao menos 10 caracteres/i);
  const erroPrioridade = await screen.findByText(/Invalid option: expected one of/i);
  const erroUsuario = await screen.findByText(/Invalid input: expected number/i);

  // Verifica atributos ARIA para o campo descrição
  const descricaoInput = screen.getByLabelText(/Descrição/i);
  expect(descricaoInput).toHaveAttribute("aria-invalid", "true");
  expect(descricaoInput).toHaveAttribute("aria-describedby", "descricao-error");

  // Verifica atributos ARIA para o campo nome do setor
  const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
  expect(nomeSetorInput).toHaveAttribute("aria-invalid", "true");
  expect(nomeSetorInput).toHaveAttribute("aria-describedby", "nome_setor-error");

  // Verifica atributos ARIA para o campo prioridade
  const prioridadeSelect = screen.getByLabelText(/Prioridade/i);
  expect(prioridadeSelect).toHaveAttribute("aria-invalid", "true");
  expect(prioridadeSelect).toHaveAttribute("aria-describedby", "prioridade-error");

  // Verifica atributos ARIA para o campo usuário
  const usuarioSelect = screen.getByLabelText(/Usuário/i);
  expect(usuarioSelect).toHaveAttribute("aria-invalid", "true");
  expect(usuarioSelect).toHaveAttribute("aria-describedby", "usuario-error");
});


it("botão de enviar deve estar habilitado e permitir clique, mas sem dados não envia", () => {
  const setTarefas = vi.fn();
  render(<CadTarefa setTarefas={setTarefas} />);

  const botaoCadastrar = screen.getByRole("button", { name: /Cadastrar/i });

  // Confirma que o botão está habilitado
  expect(botaoCadastrar).toBeEnabled();

  // Tenta clicar sem preencher nada
  fireEvent.click(botaoCadastrar);

  // Verifica que setTarefas ou axios.post NÃO foram chamados
  expect(setTarefas).not.toHaveBeenCalled();
});

it("verifica se os placeholders estão corretos", () => {
  render(<CadTarefa setTarefas={vi.fn()} />);

  expect(screen.getByPlaceholderText(/Descrição da tarefa/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Nome do setor/i)).toBeInTheDocument();
});


});  