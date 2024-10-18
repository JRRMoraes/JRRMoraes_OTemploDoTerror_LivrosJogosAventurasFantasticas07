import styles from "./TelaPanilha.module.scss";
import "../globais/CoresHES.scss";
import { ContextoJogos } from "../contextos";
import TelaPanilhaNova from "./TelaPanilhaNova";
import { IEfeito, EAtributo } from "../tipos";
import { EProcesso } from "../uteis";

export const TelaPanilha = () => {
    const { jogoAtual } = ContextoJogos();

    if (!jogoAtual) {
        return <></>;
    }
    if (!jogoAtual.panilha) {
        return <TelaPanilhaNova />;
    } else {
        return (
            <div className={styles.panilha}>
                <h2>{"Página X  -  Folha de Aventuras"}</h2>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th className="coresHES_habilidade">Habilidade:</th>
                                <th className="coresHES_energia">Energia:</th>
                                <th className="coresHES_sorte">Sorte:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="coresHES_habilidade">
                                    <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.habilidade}</span>
                                    <span className={styles.panilha_fonteNormal}>{" / "}</span>
                                    <span>{jogoAtual.panilha.habilidadeInicial}</span>
                                </td>
                                <td className="coresHES_energia">
                                    <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.energia}</span>
                                    <span className={styles.panilha_fonteNormal}>{" / "}</span>
                                    <span>{jogoAtual.panilha.energiaInicial}</span>
                                </td>
                                <td className="coresHES_sorte">
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
                            <tr>{MontarRetorno_Encantos()}</tr>
                        </tbody>
                    </table>
                    <table className={styles.panilha_tabela_itens}>
                        <thead>
                            <tr>
                                <th>Itens:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>{MontarRetorno_Itens()}</tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    function ObterEfeito(atributo: EAtributo): IEfeito {
        return jogoAtual.panilha.auxEfeitos.find((efeitoI) => {
            efeitoI.atributoEfeito === atributo && [EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO].includes(efeitoI.auxProcessoEfeito);
        })!;
    }

    function MontarRetorno_Encantos() {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.encantos) {
            return (
                <td>
                    <ul>
                        {jogoAtual.panilha.encantos.map((encantoI, indiceI) => {
                            return (
                                <li
                                    key={indiceI}
                                    className={styles.panilha_encantos}
                                >
                                    {encantoI}
                                </li>
                            );
                        })}
                    </ul>
                </td>
            );
        } else {
            return <td></td>;
        }
    }

    function MontarRetorno_Itens() {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.itens) {
            return (
                <td>
                    <ul>
                        {jogoAtual.panilha.itens.map((itemI, indiceI) => {
                            return (
                                <li
                                    key={indiceI}
                                    className={styles.panilha_itens}
                                >
                                    {itemI.quantidade + " x  " + itemI.idItem}
                                </li>
                            );
                        })}
                    </ul>
                </td>
            );
        } else {
            return <td></td>;
        }
    }
};

export default TelaPanilha;
