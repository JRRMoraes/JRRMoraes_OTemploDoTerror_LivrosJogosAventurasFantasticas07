import { useCallback, useEffect, useState } from "react";
import { ContextoLivro, ContextoJogos, ContextoPagina } from "../contextos";
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";

export const ControlePaginaInicial = () => {
    const [estado, setEstado] = useState<EEstadoPaginaInicial>(EEstadoPaginaInicial._ABERTURA);

    const [indiceApresentacoes, setIndiceApresentacoes] = useState(0);

    const { livro, CaminhoImagem } = ContextoLivro();

    const { jogoAtual, ResetarJogo } = ContextoJogos();

    const { pagina } = ContextoPagina();

    const exibeMenuViaTeclado = useCallback((evento: KeyboardEvent) => {
        ExibirMenu();
    }, []);

    const exibeMenuViaMouse = useCallback((evento: MouseEvent) => {
        ExibirMenu();
    }, []);

    useEffect(() => {
        if (jogoAtual || pagina) {
            ResetarJogo();
        }

        document.addEventListener("keydown", exibeMenuViaTeclado, false);
        document.addEventListener("click", exibeMenuViaMouse, false);
        return () => {
            document.removeEventListener("keydown", exibeMenuViaTeclado, false);
            document.removeEventListener("click", exibeMenuViaMouse, false);
        };
    }, [jogoAtual]);

    return { estado, ContextosReprovados, ProcessarApresentacoes, ObterLivroApresentacoesIndice, CaminhoImagem };

    function ContextosReprovados() {
        return !livro;
    }

    function ProcessarApresentacoes() {
        if (indiceApresentacoes + 1 < livro.apresentacoes.length) {
            setTimeout(() => {
                setIndiceApresentacoes((prevIndiceApresentacoes) => prevIndiceApresentacoes + 1);
            }, TEMPO_ANIMACAO_NORMAL);
        } else {
            setTimeout(() => {
                ExibirMenu();
            }, TEMPO_ANIMACAO_NORMAL);
        }
    }

    function ExibirMenu() {
        setEstado(EEstadoPaginaInicial.MENU);
    }

    function ObterLivroApresentacoesIndice() {
        if (livro.apresentacoes[indiceApresentacoes] && livro.apresentacoes[indiceApresentacoes].textosApresentacao) {
            return livro.apresentacoes[indiceApresentacoes].textosApresentacao;
        } else {
            return [];
        }
    }
};

export default ControlePaginaInicial;

export enum EEstadoPaginaInicial {
    _ABERTURA,
    MENU,
}
