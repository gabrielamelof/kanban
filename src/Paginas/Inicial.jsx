import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { Outlet } from "react-router-dom";

export function Inicial({ tarefas, setTarefas }) {
  return (
    <>
      {/* Cabeçalho principal da página */}
      <Cabecalho role="banner" />

      {/* Barra de navegação principal */}
      <BarraNavegacao role="navigation" aria-label="Menu principal" />

      {/* Conteúdo principal das rotas */}
      <main role="main">
        <Outlet />
      </main>
    </>
  );
}
