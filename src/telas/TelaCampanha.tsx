import styles from "./TelaCampanha.module.scss";
import { ContextoJogos, ContextoLivro } from "../contextos";
import TelaHistorias from "./TelaHistorias";
import TelaDestinos from "./TelaDestinos";

export const TelaCampanha = () => {
    const { ObterPagina } = ContextoLivro();

    const { jogoAtual } = ContextoJogos();

    const paginaAtual = ObterPagina(jogoAtual);

    function MontarRetorno_IndiceTitulo() {
        if (paginaAtual.titulo) {
            return <h4 className={styles.campanha_titulo}>{paginaAtual.titulo}</h4>;
        } else if (paginaAtual.idPagina >= 0) {
            return <h3 className={styles.campanha_indice}>{paginaAtual.idPagina}</h3>;
        } else {
            return <></>;
        }
    }

    if (!jogoAtual) return <></>;
    if (!paginaAtual) return <></>;
    return (
        <div className={styles.campanha}>
            {MontarRetorno_IndiceTitulo()}
            <TelaHistorias paginaAtual={paginaAtual} />
            <TelaDestinos paginaAtual={paginaAtual} />
        </div>
    );
};

export default TelaCampanha;
