import styles from "./TelaCampanha.module.scss";
import { ContextoJogos } from "../contextos";
import TelaHistorias from "./TelaHistorias";
import TelaCombate from "./TelaCombate";
import TelaDestinos from "./TelaDestinos";

export const TelaCampanha = () => {
    const { jogoAtual, paginaExecutor } = ContextoJogos();

    if (!jogoAtual || !paginaExecutor) {
        return <></>;
    }
    return (
        <div className={styles.campanha}>
            {MontarRetorno_IndiceTitulo()}
            <TelaHistorias />
            <TelaCombate />
            <TelaDestinos />
        </div>
    );

    function MontarRetorno_IndiceTitulo() {
        if (paginaExecutor.titulo) {
            return <h1 className={styles.campanha_titulo}>{paginaExecutor.titulo}</h1>;
        } else if (paginaExecutor.idPagina > 0) {
            return <h1 className={styles.campanha_indice}>{paginaExecutor.idPagina}</h1>;
        } else {
            return <></>;
        }
    }
};

export default TelaCampanha;
