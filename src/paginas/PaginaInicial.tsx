import styles from "./PaginaInicial.module.scss";
import { useCallback, useEffect, useState } from "react";
import { ContextoLivro, ContextoJogos } from "../contextos";
import { IChildrenProps } from "../uteis";
import { TextosDatilografados, ReprodutorAudio } from "../componentes";
import { TelaListaJogosSalvos } from "../telas";
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";

export const PaginaInicial = () => {
    const { livro, CaminhoImagem } = ContextoLivro();

    const { jogoAtual, paginaExecutor, ResetarJogo } = ContextoJogos();

    const [estado, setEstado] = useState<"ABERTURA" | "MENU">("ABERTURA");

    const [indiceApresentacoes, setIndiceApresentacoes] = useState(0);

    const exibeMenuViaTeclado = useCallback((evento: KeyboardEvent) => {
        ExibirMenu();
    }, []);

    const exibeMenuViaMouse = useCallback((evento: MouseEvent) => {
        ExibirMenu();
    }, []);

    useEffect(() => {
        if (jogoAtual || paginaExecutor) {
            ResetarJogo();
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
                    <div className={styles.paginaInicial_conteudo_1}>
                        <ReprodutorAudio />
                    </div>
                    <div className={styles.paginaInicial_conteudo_2}>{MontarRetorno_AberturaOuMenu()}</div>
                    <div className={styles.paginaInicial_conteudo_1}></div>
                </div>
            </div>
        </MontarRetorno>
    );

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
        setEstado("MENU");
    }

    function MontarRetorno_AberturaOuMenu() {
        if (estado === "ABERTURA") {
            if (livro.apresentacoes[indiceApresentacoes] && livro.apresentacoes[indiceApresentacoes].textosApresentacao) {
                return (
                    <div className={styles.paginaInicial_conteudo_2_apresentacao}>
                        <TextosDatilografados
                            textos={livro.apresentacoes[indiceApresentacoes].textosApresentacao}
                            velocidade={50}
                            aoConcluir={() => ProcessarApresentacoes()}
                        />
                    </div>
                );
            } else {
                return <></>;
            }
        } else {
            return (
                <div className={styles.paginaInicial_conteudo_2_jogosSalvos}>
                    <TelaListaJogosSalvos />
                </div>
            );
        }
    }
};

export default PaginaInicial;
