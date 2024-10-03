import styles from "./TelaListaJogosSalvos.module.scss";
import { ContextoJogos } from "../contextos";
import { ItemListaJogosSalvos } from "../componentes";

export const TelaListaJogosSalvos = () => {
    const { jogoSalvo1, jogoSalvo2, jogoSalvo3 } = ContextoJogos();

    function MontarRetorno_Sucesso() {
        return (
            <div className={styles.lista}>
                <ul>
                    <ItemListaJogosSalvos jogoSalvo={jogoSalvo1} />
                    <ItemListaJogosSalvos jogoSalvo={jogoSalvo2} />
                    <ItemListaJogosSalvos jogoSalvo={jogoSalvo3} />
                </ul>
            </div>
        );
    }

    return <div>{MontarRetorno_Sucesso()}</div>;
};

export default TelaListaJogosSalvos;
