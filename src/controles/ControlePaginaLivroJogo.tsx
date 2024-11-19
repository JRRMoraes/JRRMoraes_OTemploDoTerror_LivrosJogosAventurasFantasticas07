import { useEffect } from "react";
import { ContextoJogos, ContextoPagina } from "../contextos";

export const ControlePaginaLivroJogo = () => {
    const { jogoAtual, ResetarJogo } = ContextoJogos();

    const { pagina } = ContextoPagina();

    useEffect(() => {
        window.addEventListener("beforeunload", ProcessarRefresh);
        return () => {
            window.removeEventListener("beforeunload", ProcessarRefresh);
        };
    }, []);

    return { ContextosReprovados, AprovarJogoAtualPanilha };

    function ContextosReprovados() {
        return !jogoAtual || !pagina;
    }

    function AprovarJogoAtualPanilha() {
        return jogoAtual && jogoAtual.panilha;
    }

    function ProcessarRefresh(evento: BeforeUnloadEvent) {
        evento.preventDefault();
        ResetarJogo();
    }
};

export default ControlePaginaLivroJogo;
