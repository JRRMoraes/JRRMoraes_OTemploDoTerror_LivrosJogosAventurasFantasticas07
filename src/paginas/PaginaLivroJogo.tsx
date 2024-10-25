import styles from "./PaginaLivroJogo.module.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ContextoLivro, ContextoJogos } from "../contextos";
import { TelaCampanha, TelaPanilha } from "../telas";
import { isMobile } from "react-device-detect";
import { ReprodutorAudio } from "../componentes";

export const PaginaLivroJogo = () => {
    let { idJogo } = useParams();

    const [ehJogoCarregado, setEhJogoCarregado] = useState(false);

    const { livro, ObterPagina } = ContextoLivro();

    const { jogoAtual, paginaExecutor, CarregarJogoSalvoOuNovo, ResetarJogoAtual, ImporPaginaAtualECampanha, ImporPaginaCampanhaViaAtual } = ContextoJogos();

    useEffect(() => {
        if (!jogoAtual) {
            setEhJogoCarregado(CarregarJogoSalvoOuNovo(idJogo!));
        }
    }, [idJogo]);

    useEffect(() => {
        window.addEventListener("beforeunload", ProcessarRefresh);
        return () => {
            window.removeEventListener("beforeunload", ProcessarRefresh);
        };
    }, []);

    useEffect(() => {
        if (jogoAtual) {
            setEhJogoCarregado(ImporPaginaAtualECampanha(ObterPagina(jogoAtual), ehJogoCarregado));
            ImporPaginaCampanhaViaAtual();
        }
    }, [livro, jogoAtual, paginaExecutor]);

    if (!jogoAtual || !paginaExecutor) {
        return <></>;
    }
    if (!isMobile) {
        return (
            <div className={styles.livroJogo_Desktop}>
                <div className={styles.livroJogo_Desktop_panilha}>
                    <div className={styles.livroJogo_Desktop_panilha_2}>
                        <div className={styles.livroJogo_Desktop_panilha_3}>
                            <TelaPanilha />
                        </div>
                    </div>
                    <div className={styles.livroJogo_Desktop_panilha_audio}>
                        <ReprodutorAudio />
                    </div>
                </div>
                <div className={styles.livroJogo_Desktop_campanha}>
                    <div className={styles.livroJogo_Desktop_campanha_2}>
                        <TelaCampanha />
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.livroJogo_Celular}>
                <div className={styles.livroJogo_Celular_fundo}>
                    <div className={styles.livroJogo_Celular_panilha}>
                        <div className={styles.livroJogo_Celular_panilha_2}>
                            <TelaPanilha />
                        </div>
                    </div>
                    <div className={styles.livroJogo_Celular_campanha}>
                        <div className={styles.livroJogo_Celular_campanha_2}>
                            <TelaCampanha />
                        </div>
                    </div>
                </div>
                <ReprodutorAudio />
            </div>
        );
    }

    function ProcessarRefresh(evento: BeforeUnloadEvent) {
        evento.preventDefault();
        ResetarJogoAtual();
    }
};

export default PaginaLivroJogo;
