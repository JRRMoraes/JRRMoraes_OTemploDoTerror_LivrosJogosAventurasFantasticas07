import styles from "./PaginaInicial.module.scss";
import { useCallback, useEffect, useState } from "react";
import { ContextoLivro, ContextoJogos } from "../contextos";
import { IChildrenProps } from "../uteis";
import { TextosDatilografados, ReprodutorAudio } from "../componentes";
import { TelaListaJogosSalvos } from "../telas";
import { TEMPO_ANIMACAO } from "../globais/Constantes";

export const PaginaInicial = () => {
    const { livro, CaminhoImagem } = ContextoLivro();

    const { jogoAtual, ResetarJogoAtual } = ContextoJogos();

    const [estado, setEstado] = useState<"ABERTURA" | "MENU">("ABERTURA");

    const [indiceApresentacoes, setIndiceApresentacoes] = useState(0);

    const exibeMenuViaTeclado = useCallback((evento: KeyboardEvent) => {
        ExibirMenu();
    }, []);

    const exibeMenuViaMouse = useCallback((evento: MouseEvent) => {
        ExibirMenu();
    }, []);

    useEffect(() => {
        if (jogoAtual) {
            ResetarJogoAtual();
        }

        document.addEventListener("keydown", exibeMenuViaTeclado, false);
        document.addEventListener("click", exibeMenuViaMouse, false);
        return () => {
            document.removeEventListener("keydown", exibeMenuViaTeclado, false);
            document.removeEventListener("click", exibeMenuViaMouse, false);
        };
    }, [jogoAtual]);

    const MontarRetorno = ({ children }: IChildrenProps) => {
        return (
            <div
                className={styles.paginaInicial}
                style={{ backgroundImage: "url(" + CaminhoImagem("Capa.png") + ")" }}
            >
                {children}
            </div>
        );
    };

    if (!livro) {
        return <></>;
    }
    return (
        <MontarRetorno>
            <div className={styles.paginaInicial_total}>
                <div className={styles.paginaInicial_espaco}></div>
                <div className={styles.paginaInicial_conteudo}>
                    {MontarRetorno_AberturaOuMenu()}
                    <ReprodutorAudio audio="/The Storyteller.mp3" />
                </div>
            </div>
        </MontarRetorno>
    );

    function ProcessarApresentacoes() {
        if (indiceApresentacoes + 1 < livro.apresentacoes.length) {
            setTimeout(() => {
                setIndiceApresentacoes((prevIndiceApresentacoes) => prevIndiceApresentacoes + 1);
            }, TEMPO_ANIMACAO);
        } else {
            ExibirMenu();
        }
    }

    function ExibirMenu() {
        setEstado("MENU");
    }

    function MontarRetorno_AberturaOuMenu() {
        if (estado === "ABERTURA") {
            if (livro.apresentacoes[indiceApresentacoes] && livro.apresentacoes[indiceApresentacoes].textos) {
                return (
                    <TextosDatilografados
                        textos={livro.apresentacoes[indiceApresentacoes].textos}
                        velocidade={50}
                        aoConcluir={() => ProcessarApresentacoes()}
                    />
                );
            } else {
                return <></>;
            }
        } else {
            return <TelaListaJogosSalvos />;
        }
    }
};

export default PaginaInicial;
