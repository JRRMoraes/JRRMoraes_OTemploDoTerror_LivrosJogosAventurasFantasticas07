import { useCallback, useEffect, useState } from "react";
import { ContextoLivro, ContextoJogos, ContextoPagina } from "../contextos";
import { TEMPO_ANIMACAO_NORMAL, TEMPO_ANIMACAO_GRANDE } from "../globais/Constantes";
import { EAudioMomentoMusica } from "../tipos";

export const ControlePaginaInicial = () => {
    const CREDITOS: string[] = [
        "HOMENAGEM AO LIVRO-JOGO 'O TEMPLO DO TERROR'",
        "Este aplicativo é uma homenagem ao livro-jogo 'O Templo do Terror', publicado por Puffin Books, Penguin Books Ltd.",
        "Copyright © 1985 por Ian Livingstone",
        "Copyright © 1985 das ilustrações por Bill Houston",
        "Direitos exclusivos para o Brasil adquiridos por Marques Saraiva Gráficos e Editores S.A.",
        "ISBN 85-85238-32-1",
        "Este aplicativo não possui fins lucrativos e foi criado com o objetivo de prestar uma homenagem à obra original e a seus autores.",
        "Todos os direitos sobre os textos e ilustrações são reservados aos seus respectivos criadores e detentores dos direitos autorais.",
        "Se você é o detentor dos direitos autorais e tem alguma preocupação sobre o uso do conteúdo, por favor, entre em contato conosco para que possamos resolver a questão prontamente.",
    ];

    const [estado, setEstado] = useState<EEstadoPaginaInicial>(EEstadoPaginaInicial._CREDITO);

    const [indiceCreditos, setIndiceCreditos] = useState(0);

    const [indiceApresentacoes, setIndiceApresentacoes] = useState(0);

    const { livro, CaminhoImagem, ImporAudioMusicaViaMomento } = ContextoLivro();

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
        ImporAudioMusicaViaMomento(EAudioMomentoMusica.ABERTURA);

        document.addEventListener("keydown", exibeMenuViaTeclado, false);
        document.addEventListener("click", exibeMenuViaMouse, false);
        return () => {
            document.removeEventListener("keydown", exibeMenuViaTeclado, false);
            document.removeEventListener("click", exibeMenuViaMouse, false);
        };
    }, [jogoAtual]);

    return { CREDITOS, estado, ContextosReprovados, ProcessarCreditos, ProcessarApresentacoes, ObterLivroApresentacoesIndice, CaminhoImagem };

    function ContextosReprovados() {
        return !livro;
    }

    function ProcessarCreditos() {
        setTimeout(() => {
            setEstado(EEstadoPaginaInicial.ABERTURA);
        }, TEMPO_ANIMACAO_GRANDE);
    }

    function ProcessarApresentacoes() {
        if (indiceApresentacoes + 1 < livro.apresentacoes.length) {
            setTimeout(() => {
                setIndiceApresentacoes((prevIndiceApresentacoes) => prevIndiceApresentacoes + 1);
            }, TEMPO_ANIMACAO_NORMAL);
        } else {
            setTimeout(() => {
                ExibirMenu();
            }, TEMPO_ANIMACAO_GRANDE);
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
    _CREDITO,
    ABERTURA,
    MENU,
}
