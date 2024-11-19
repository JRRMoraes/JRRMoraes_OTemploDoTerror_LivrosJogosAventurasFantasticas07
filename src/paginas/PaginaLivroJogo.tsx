import styles from "./PaginaLivroJogo.module.scss";
import { TelaCampanha, TelaPanilha, TelaPanilhaNova } from "../telas";
import { ReprodutorAudio } from "../componentes";
import { ControlePaginaLivroJogo } from "../controles";
import { UteisDimensoesPaginaHtml } from "../uteis";

export const PaginaLivroJogo = () => {
    const { ContextosReprovados, AprovarJogoAtualPanilha } = ControlePaginaLivroJogo();

    const { EhDispositivoTabletOuDesktop, MontarElemento_BotaoFullscreen } = UteisDimensoesPaginaHtml();

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
                    <div className={styles.livroJogo_Celular_comandos}>
                        <ReprodutorAudio />
                        {MontarElemento_BotaoFullscreen()}
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
                    <div className={styles.livroJogo_Desktop_panilha_comandos}>
                        <ReprodutorAudio />
                        {MontarElemento_BotaoFullscreen()}
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
