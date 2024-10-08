import styles from "./TelaPanilha.module.scss";
import "../globais/CoresHES.scss";
import { ContextoJogos } from "../contextos";
import TelaPanilhaNova from "./TelaPanilhaNova";

export const TelaPanilha = () => {
    const { jogoAtual } = ContextoJogos();

    function MontarRetorno_Encantos() {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.encantos) {
            return (
                <ul>
                    {jogoAtual.panilha.encantos.map((encantoI, indiceI) => {
                        return <li key={indiceI}>{encantoI}</li>;
                    })}
                </ul>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Itens() {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.itens) {
            return (
                <ul>
                    {jogoAtual.panilha.itens.map((itemI, indiceI) => {
                        return <li key={indiceI}>{itemI.quantidade + " x  " + itemI.idItem}</li>;
                    })}
                </ul>
            );
        } else {
            return <></>;
        }
    }

    if (!jogoAtual) {
        return <></>;
    }
    if (!jogoAtual.panilha) {
        return <TelaPanilhaNova />;
    } else {
        return (
            <div className={styles.panilha}>
                <div>{jogoAtual.panilha.jogador}</div>
                <table className={styles.panilha_tabela_hes}>
                    <thead>
                        <tr>
                            <th className={styles.panilha_habilidade}>Habilidade:</th>
                            <th className={styles.panilha_energia}>Energia:</th>
                            <th className={styles.panilha_sorte}>Sorte:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.panilha_habilidade}>
                                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.habilidade}</span>
                                <span className={styles.panilha_fonteNormal}>{" / "}</span>
                                <span>{jogoAtual.panilha.habilidadeInicial}</span>
                            </td>
                            <td className={styles.panilha_energia}>
                                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.energia}</span>
                                <span className={styles.panilha_fonteNormal}>{" / "}</span>
                                <span>{jogoAtual.panilha.energiaInicial}</span>
                            </td>
                            <td className={styles.panilha_sorte}>
                                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.sorte}</span>
                                <span className={styles.panilha_fonteNormal}>{" / "}</span>
                                <span>{jogoAtual.panilha.sorteInicial}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.panilha_tabela_op}>
                    <thead>
                        <tr>
                            <th>Ouro:</th>
                            <th>Provisões:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.ouro}</span>
                            </td>
                            <td>
                                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.provisao}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.panilha_tabela_encantos}>
                    <thead>
                        <tr>
                            <th>Encantos:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{MontarRetorno_Encantos()}</td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.panilha_tabela_itens}>
                    <thead>
                        <tr>
                            <th>Itens:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{MontarRetorno_Itens()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
};

export default TelaPanilha;
