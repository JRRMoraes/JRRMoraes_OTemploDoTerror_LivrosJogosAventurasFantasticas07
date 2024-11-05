import styles from "./PaginaLivroJogo.module.scss";
import { useEffect } from "react";
import { ContextoJogos } from "../contextos";
import { TelaCampanha, TelaPanilha } from "../telas";
import { isMobile } from "react-device-detect";
import { ReprodutorAudio } from "../componentes";

export const PaginaLivroJogo = () => {
    const { jogoAtual, paginaExecutor, ResetarJogo } = ContextoJogos();

    useEffect(() => {
        window.addEventListener("beforeunload", ProcessarRefresh);
        return () => {
            window.removeEventListener("beforeunload", ProcessarRefresh);
        };
    }, []);

    if (!jogoAtual || !paginaExecutor) {
        return <></>;
    }
    if (!isMobile) {
        return (
            <div className={styles.livroJogo_Desktop}>
                <div className={styles.livroJogo_Desktop_campanha}>
                    <div className={styles.livroJogo_Desktop_campanha_2}>
                        <TelaCampanha />
                    </div>
                </div>
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
        ResetarJogo();
    }
};

export default PaginaLivroJogo;
