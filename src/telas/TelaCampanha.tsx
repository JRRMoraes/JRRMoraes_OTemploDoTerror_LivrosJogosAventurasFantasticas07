import styles from "./TelaCampanha.module.scss";
import { ContextoJogos, ContextoPagina } from "../contextos";
import TelaHistorias from "./TelaHistorias";
import TelaCombate from "./TelaCombate";
import TelaDestinos from "./TelaDestinos";

export const TelaCampanha = () => {
    const { jogoAtual } = ContextoJogos();

    const { pagina } = ContextoPagina();

    if (!jogoAtual || !pagina) {
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
        if (pagina.titulo) {
            return <h1 className={styles.campanha_titulo}>{pagina.titulo}</h1>;
        } else if (pagina.idPagina > 0) {
            return <h1 className={styles.campanha_indice}>{pagina.idPagina}</h1>;
        } else {
            return <></>;
        }
    }
};

export default TelaCampanha;
