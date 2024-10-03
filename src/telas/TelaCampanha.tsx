import styles from "./TelaCampanha.module.scss";
import { ContextoJogos, ContextoLivro } from "../contextos";
import TelaHistorias from "./TelaHistorias";

export const TelaCampanha = () => {
    const { ObterPagina } = ContextoLivro();

    const { jogoAtual } = ContextoJogos();
    if (!jogoAtual) return <></>;

    const paginaAtual = ObterPagina(jogoAtual);
    if (!paginaAtual) return <></>;

    function MontarRetorno_Titulo() {
        if (paginaAtual.titulo)
            return (
                <h4 className={styles.campanha_titulo}>{paginaAtual.titulo}</h4>
            );
    }

    return (
        <div className={styles.campanha}>
            <h3 className={styles.campanha_indice}>{paginaAtual.idPagina}</h3>
            {MontarRetorno_Titulo()}
            <TelaHistorias paginaAtual={paginaAtual} />
        </div>
    );
};

export default TelaCampanha;
