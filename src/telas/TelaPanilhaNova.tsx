import styles from "./TelaPanilhaNova.module.scss";
import "../globais/CoresHES.scss";
import { useState, useEffect, useRef } from "react";
import { ContextoJogos } from "../contextos";
import { IRolagensParaPanilhaNova, ITotaisRoladosParaPanilhaNova, CriarPanilhaViaRolagens, COR_HABILIDADE, COR_ENERGIA, COR_SORTE } from "../tipos";
import { Botao } from "../componentes";
import ReactDice, { ReactDiceRef } from "react-dice-complete";

export const TelaPanilhaNova = () => {
    const { jogoAtual, setJogoAtual } = ContextoJogos();

    const [indiceRolagem, setIndiceRolagem] = useState(0);

    const [rolagens, setRolagens] = useState<IRolagensParaPanilhaNova>({
        habilidade1: 0,
        energia1: 0,
        energia2: 0,
        sorte1: 0,
    });

    const [totaisRolados, setTotaisRolados] = useState<ITotaisRoladosParaPanilhaNova>({
        habilidade: 0,
        energia: 0,
        sorte: 0,
    });

    const [rolandoDados, setRolandoDados] = useState({ rolando: false, quantidade: 0 });

    const reactDiceHabilidade = useRef<ReactDiceRef>(null);
    const reactDiceEnergia = useRef<ReactDiceRef>(null);
    const reactDiceSorte = useRef<ReactDiceRef>(null);

    function RolarDados() {
        setRolagens({
            habilidade1: 0,
            energia1: 0,
            energia2: 0,
            sorte1: 0,
        });
        reactDiceHabilidade.current?.rollAll();
        reactDiceEnergia.current?.rollAll();
        reactDiceSorte.current?.rollAll();
    }

    const rolagemHabilidadeConcluida = (totalValue: number, values: number[]) => {
        setRolagens((prevRolagens) => {
            return { ...prevRolagens, habilidade1: values[0] };
        });
        setTotaisRolados((prevTotaisRolados) => {
            return { ...prevTotaisRolados, habilidade: 6 + values[0] };
        });
        setRolandoDados((prevRolandoDados) => {
            return { ...prevRolandoDados, quantidade: prevRolandoDados.quantidade + 1 };
        });
    };

    const rolagemEnergiaConcluida = (totalValue: number, values: number[]) => {
        setRolagens((prevRolagens) => {
            return { ...prevRolagens, energia1: values[0], energia2: values[1] };
        });
        setTotaisRolados((prevTotaisRolados) => {
            return { ...prevTotaisRolados, energia: 12 + values[0] + values[1] };
        });
        setRolandoDados((prevRolandoDados) => {
            return { ...prevRolandoDados, quantidade: prevRolandoDados.quantidade + 1 };
        });
    };

    const rolagemSorteConcluida = (totalValue: number, values: number[]) => {
        setRolagens((prevRolagens) => {
            return { ...prevRolagens, sorte1: values[0] };
        });
        setTotaisRolados((prevTotaisRolados) => {
            return { ...prevTotaisRolados, sorte: 6 + values[0] };
        });
        setRolandoDados((prevRolandoDados) => {
            return { ...prevRolandoDados, quantidade: prevRolandoDados.quantidade + 1 };
        });
    };

    function ObterTotalDaRolagem(total: number) {
        if (indiceRolagem === 0 || rolandoDados.rolando) {
            return "?";
        } else {
            return total;
        }
    }

    function MontarRetorno_Rolagens() {
        return (
            <div>
                <div className="coresHES_habilidade">
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.panilhaNova_rolagem_titulo}>
                                    {"HABILIDADE:  "} <span className={styles.panilhaNova_rolagem_total}>{ObterTotalDaRolagem(totaisRolados.habilidade)}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_soma}>6 +</td>
                                <td className={styles.panilhaNova_rolagem_dados}>
                                    <ReactDice
                                        numDice={1}
                                        ref={reactDiceHabilidade}
                                        rollDone={rolagemHabilidadeConcluida}
                                        faceColor={COR_HABILIDADE}
                                        dotColor="#000000"
                                        defaultRoll={1}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="coresHES_energia">
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.panilhaNova_rolagem_titulo}>
                                    {"ENERGIA:  "} <span className={styles.panilhaNova_rolagem_total}>{ObterTotalDaRolagem(totaisRolados.energia)}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_soma}>12 +</td>
                                <td className={styles.panilhaNova_rolagem_dados}>
                                    <ReactDice
                                        numDice={2}
                                        ref={reactDiceEnergia}
                                        rollDone={rolagemEnergiaConcluida}
                                        faceColor={COR_ENERGIA}
                                        dotColor="#000000"
                                        defaultRoll={1}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="coresHES_sorte">
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.panilhaNova_rolagem_titulo}>
                                    {"SORTE:  "} <span className={styles.panilhaNova_rolagem_total}>{ObterTotalDaRolagem(totaisRolados.sorte)}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_soma}>6 +</td>
                                <td className={styles.panilhaNova_rolagem_dados}>
                                    <ReactDice
                                        numDice={1}
                                        ref={reactDiceSorte}
                                        rollDone={rolagemSorteConcluida}
                                        faceColor={COR_SORTE}
                                        dotColor="#ffffff"
                                        defaultRoll={1}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    function AceitarRolagem() {
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, panilha: CriarPanilhaViaRolagens(totaisRolados) };
        });
    }

    function ExecutarRolagem() {
        setRolandoDados({ rolando: true, quantidade: 0 });
        setIndiceRolagem((prevIndiceRolagem) => prevIndiceRolagem + 1);
    }

    function MontarRetorno_BoasVindas() {
        if (indiceRolagem === 0) {
            return (
                <div>
                    <h4>Você terá 3 rolagens de dados e aceite a que desejar.</h4>
                    <p>Entretanto a rolagem descartada será perdida.</p>
                    {MontarRetorno_Rolagens()}
                    <div className={styles.panilhaNova_botoes}>
                        <Botao
                            aoClicar={() => ExecutarRolagem()}
                            desativado={rolandoDados.rolando}
                        >
                            CLIQUE AQUI, para fazer a primeira rolagem
                        </Botao>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_PrimeiraRolagem() {
        if (indiceRolagem === 1) {
            return (
                <div>
                    <h4>Nessa primeira rolagem, você obteve:</h4>
                    {MontarRetorno_Rolagens()}
                    <div className={styles.panilhaNova_botoes}>
                        <Botao
                            aoClicar={() => AceitarRolagem()}
                            desativado={rolandoDados.rolando}
                        >
                            Você ACEITA essas rolagens?
                        </Botao>
                        <Botao
                            aoClicar={() => ExecutarRolagem()}
                            desativado={rolandoDados.rolando}
                        >
                            Você quer ROLAR novamente? Ainda tem 2 tentativas
                        </Botao>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_SegundaRolagem() {
        if (indiceRolagem === 2) {
            return (
                <div>
                    <h4>Nessa segunda rolagem, você obteve:</h4>
                    {MontarRetorno_Rolagens()}
                    <div className={styles.panilhaNova_botoes}>
                        <Botao
                            aoClicar={() => AceitarRolagem()}
                            desativado={rolandoDados.rolando}
                        >
                            Você ACEITA essas rolagens?
                        </Botao>
                        <Botao
                            aoClicar={() => ExecutarRolagem()}
                            desativado={rolandoDados.rolando}
                        >
                            Você quer ROLAR novamente? Ainda tem 1 tentativas
                        </Botao>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_TerceiraRolagem() {
        if (indiceRolagem === 3) {
            return (
                <div>
                    <h4>Nessa terceira rolagem, você obteve:</h4>
                    {MontarRetorno_Rolagens()}
                    <div className={styles.panilhaNova_botoes}>
                        <Botao
                            aoClicar={() => AceitarRolagem()}
                            desativado={rolandoDados.rolando}
                        >
                            Você DEVE ACEITAR essas rolagens
                        </Botao>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }

    useEffect(() => {
        if (!jogoAtual || jogoAtual.panilha) {
            return;
        }
        if (indiceRolagem >= 1) {
            RolarDados();
        }
    }, [jogoAtual, indiceRolagem]);

    useEffect(() => {
        if (rolandoDados.rolando) {
            if (indiceRolagem === 0 && rolandoDados.quantidade >= 12) {
                setRolandoDados((prevRolandoDados) => {
                    return { ...prevRolandoDados, rolando: false };
                });
            } else if (indiceRolagem !== 0 && rolandoDados.quantidade >= 15) {
                setRolandoDados((prevRolandoDados) => {
                    return { ...prevRolandoDados, rolando: false };
                });
            }
        } else if (rolandoDados.quantidade !== 0) {
            setRolandoDados({ rolando: false, quantidade: 0 });
        }
    }, [rolandoDados]);

    if (!jogoAtual) {
        return <></>;
    }
    if (jogoAtual.panilha) {
        return <></>;
    }
    return (
        <div className={styles.panilhaNova}>
            <h3>
                Role os dados para determinar sua
                <br />
                <span className="coresHES_habilidade">HABILIDADE</span>, <span className="coresHES_energia">ENERGIA</span>
                {" e "}
                <span className="coresHES_sorte">SORTE</span>
            </h3>
            <div>
                {MontarRetorno_BoasVindas()}
                {MontarRetorno_PrimeiraRolagem()}
                {MontarRetorno_SegundaRolagem()}
                {MontarRetorno_TerceiraRolagem()}
            </div>
        </div>
    );
};

export default TelaPanilhaNova;
