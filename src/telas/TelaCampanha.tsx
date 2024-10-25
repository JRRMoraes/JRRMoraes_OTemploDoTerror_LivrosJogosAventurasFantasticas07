import styles from "./TelaCampanha.module.scss";
import { ContextoJogos } from "../contextos";
import TelaHistorias from "./TelaHistorias";
import TelaCombate from "./TelaCombate";
import TelaDestinos from "./TelaDestinos";

export const TelaCampanha = () => {
    const { jogoAtual, paginaCampanha } = ContextoJogos();

    if (!jogoAtual || !paginaCampanha) {
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
        if (paginaCampanha.titulo) {
            return <h1 className={styles.campanha_titulo}>{paginaCampanha.titulo}</h1>;
        } else if (paginaCampanha.idPagina > 0) {
            return <h1 className={styles.campanha_indice}>{paginaCampanha.idPagina}</h1>;
        } else {
            return <></>;
        }
    }
};

export default TelaCampanha;
