import styles from "./PaginaLivroJogo.module.scss";
import { TelaCampanha, TelaPanilha, TelaPanilhaNova } from "../telas";
import { ReprodutorAudio } from "../componentes";
import { ControlePaginaLivroJogo } from "../controles";

export const PaginaLivroJogo = () => {
    const { ContextosReprovados, AprovarJogoAtualPanilha, EhDispositivoTabletOuDesktop } = ControlePaginaLivroJogo();

    if (ContextosReprovados()) {
        return <></>;
    }
    if (EhDispositivoTabletOuDesktop()) {
        return (
            <div className={styles.livroJogo_Desktop}>
                <div className={styles.livroJogo_Desktop_2}>
                    <div className={styles.livroJogo_Desktop_campanha}>
                        <div className={styles.livroJogo_Desktop_campanha_2}>{MontarRetorno_CampanhaOuPanilhaNova()}</div>
                    </div>
                    {MontarRetorno_Panilha()}
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.livroJogo_Celular}>
                <div className={styles.livroJogo_Celular_2}>
                    {MontarRetorno_Panilha()}
                    <div className={styles.livroJogo_Celular_campanha}>
                        <div className={styles.livroJogo_Celular_campanha_2}>{MontarRetorno_CampanhaOuPanilhaNova()}</div>
                    </div>
                    <div className={styles.livroJogo_Celular_audio}>
                        <ReprodutorAudio />
                    </div>
                </div>
            </div>
        );
    }

    function MontarRetorno_CampanhaOuPanilhaNova() {
        if (AprovarJogoAtualPanilha()) {
            return <TelaCampanha />;
        } else {
            return <TelaPanilhaNova />;
        }
    }

    function MontarRetorno_Panilha() {
        if (!AprovarJogoAtualPanilha()) {
            return <></>;
        }
        if (EhDispositivoTabletOuDesktop()) {
            return (
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
            );
        } else {
            return (
                <div className={styles.livroJogo_Celular_panilha}>
                    <div className={styles.livroJogo_Celular_panilha_2}>
                        <TelaPanilha />
                    </div>
                </div>
            );
        }
    }
};

export default PaginaLivroJogo;
