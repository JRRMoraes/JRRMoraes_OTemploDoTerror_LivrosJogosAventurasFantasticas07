import styles from "./TelaCampanha.module.scss";
import { ContextoJogos } from "../contextos";
import TelaHistorias from "./TelaHistorias";
import TelaDestinos from "./TelaDestinos";

export const TelaCampanha = () => {
    const { jogoAtual, paginaCampanha } = ContextoJogos();

    function MontarRetorno_IndiceTitulo() {
        if (paginaCampanha.titulo) {
            return <h3 className={styles.campanha_titulo}>{paginaCampanha.titulo}</h3>;
        } else if (paginaCampanha.idPagina >= 0) {
            return <h3 className={styles.campanha_indice}>{paginaCampanha.idPagina}</h3>;
        } else {
            return <></>;
        }
    }

    if (!jogoAtual || !paginaCampanha) {
        return <></>;
    }
    return (
        <div className={styles.campanha}>
            {MontarRetorno_IndiceTitulo()}
            <TelaHistorias />
            <TelaDestinos />
        </div>
    );
};

export default TelaCampanha;
