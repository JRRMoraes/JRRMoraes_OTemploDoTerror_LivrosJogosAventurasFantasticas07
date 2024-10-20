import styles from "./TelaPanilhaNova.module.scss";
import "../globais/CoresHES.scss";
import { useState, useEffect, useRef } from "react";
import { ContextoJogos } from "../contextos";
import {
    IRolagemParaPanilhaNova,
    EJogoNivel,
    ROLAGEM_PARA_PANILHA_NOVA_ZERADA,
    COR_HABILIDADE,
    COR_HABILIDADE_DOTS,
    COR_ENERGIA,
    COR_ENERGIA_DOTS,
    COR_SORTE,
    COR_SORTE_DOTS,
    DADOS_TEMPO_ROLANDO_SEGUNDOS,
    DADOS_TEMPO_ROLANDO_MILESIMOS,
} from "../tipos";
import { Botao } from "../componentes";
import ReactDice, { ReactDiceRef } from "react-dice-complete";
import { EProcesso } from "../uteis";

export const TelaPanilhaNova = () => {
    const { jogoAtual, CriarPanilhaNoJogoAtualViaRolagens } = ContextoJogos();

    const [indiceRolagem, setIndiceRolagem] = useState(0);
    const [rolagemDados, setRolagemDados] = useState<IRolagemParaPanilhaNova>(ROLAGEM_PARA_PANILHA_NOVA_ZERADA);
    const dadosHabilidade = useRef<ReactDiceRef>(null);
    const dadosEnergia = useRef<ReactDiceRef>(null);
    const dadosSorte = useRef<ReactDiceRef>(null);

    useEffect(() => {
        if (!jogoAtual || jogoAtual.panilha) {
            return;
        }
        if (indiceRolagem >= 1) {
            setRolagemDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.INICIANDO };
            });
        }
    }, [jogoAtual, indiceRolagem]);

    useEffect(() => {
        if (rolagemDados.processoRolagem === EProcesso.INICIANDO) {
            dadosHabilidade.current?.rollAll();
            dadosEnergia.current?.rollAll();
            dadosSorte.current?.rollAll();
            setRolagemDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.PROCESSANDO };
            });
        } else if (rolagemDados.processoRolagem === EProcesso.PROCESSANDO) {
            setTimeout(() => {
                setRolagemDados((prevRolandoDados) => {
                    return { ...prevRolandoDados, processoRolagem: EProcesso.CONCLUIDO };
                });
            }, DADOS_TEMPO_ROLANDO_MILESIMOS);
        } else if (rolagemDados.processoRolagem === EProcesso.CONCLUIDO) {
            setRolagemDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.DESTRUIDO };
            });
        }
    }, [rolagemDados]);

    if (!jogoAtual) {
        return <></>;
    }
    if (jogoAtual.panilha) {
        return <></>;
    }
    return (
        <div className={styles.panilhaNova}>
            <h2>
                Role os dados para determinar sua
                <br />
                <span className="coresHES_habilidade">HABILIDADE</span>, <span className="coresHES_energia">ENERGIA</span>
                {" e "}
                <span className="coresHES_sorte">SORTE</span>
            </h2>
            <div>
                {MontarRetorno_BoasVindas()}
                {MontarRetorno_PrimeiraRolagem()}
                {MontarRetorno_SegundaRolagem()}
                {MontarRetorno_TerceiraRolagem()}
            </div>
        </div>
    );

    function MontarRetorno_Rolagens() {
        return (
            <div>
                <div className="coresHES_habilidade">
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.panilhaNova_rolagem_titulo}>
                                    <span>{"HABILIDADE:  "}</span>
                                    <span className={styles.panilhaNova_rolagem_total}>{ObterTotalDaRolagem(rolagemDados.totais.habilidade)}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_soma}>
                                    <span>{"6 +"}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_dados}>
                                    <ReactDice
                                        numDice={1}
                                        ref={dadosHabilidade}
                                        rollDone={rolagemHabilidadeConcluida}
                                        faceColor={COR_HABILIDADE}
                                        dotColor={COR_HABILIDADE_DOTS}
                                        defaultRoll={1}
                                        disableIndividual={true}
                                        rollTime={DADOS_TEMPO_ROLANDO_SEGUNDOS}
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
                                    <span>{"ENERGIA:  "}</span>
                                    <span className={styles.panilhaNova_rolagem_total}>{ObterTotalDaRolagem(rolagemDados.totais.energia)}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_soma}>
                                    <span>{"12 +"}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_dados}>
                                    <ReactDice
                                        numDice={2}
                                        ref={dadosEnergia}
                                        rollDone={rolagemEnergiaConcluida}
                                        faceColor={COR_ENERGIA}
                                        dotColor={COR_ENERGIA_DOTS}
                                        defaultRoll={1}
                                        disableIndividual={true}
                                        rollTime={DADOS_TEMPO_ROLANDO_SEGUNDOS}
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
                                    <span>{"SORTE:  "}</span>
                                    <span className={styles.panilhaNova_rolagem_total}>{ObterTotalDaRolagem(rolagemDados.totais.sorte)}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_soma}>
                                    <span>{"6 +"}</span>
                                </td>
                                <td className={styles.panilhaNova_rolagem_dados}>
                                    <ReactDice
                                        numDice={1}
                                        ref={dadosSorte}
                                        rollDone={rolagemSorteConcluida}
                                        faceColor={COR_SORTE}
                                        dotColor={COR_SORTE_DOTS}
                                        defaultRoll={1}
                                        disableIndividual={true}
                                        rollTime={DADOS_TEMPO_ROLANDO_SEGUNDOS}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
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
                            //desativado={EstaRolandoDados()}
                        >
                            <h4>CLIQUE AQUI, para fazer a primeira rolagem</h4>
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
                            aoClicar={() => ExecutarRolagem()}
                            desativado={EstaRolandoDados()}
                        >
                            <h4>Você quer ROLAR novamente?</h4>
                            <p>Ainda tem 2 tentativas</p>
                        </Botao>
                        <Botao
                            aoClicar={() => AceitarRolagem()}
                            desativado={EstaRolandoDados()}
                        >
                            <h4>Você ACEITA essas rolagens?</h4>
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
                            aoClicar={() => ExecutarRolagem()}
                            desativado={EstaRolandoDados()}
                        >
                            <h4>Você quer ROLAR novamente?</h4>
                            <p>Ainda tem 1 tentativa</p>
                        </Botao>
                        <Botao
                            aoClicar={() => AceitarRolagem()}
                            desativado={EstaRolandoDados()}
                        >
                            <h4>Você ACEITA essas rolagens?</h4>
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
                            desativado={EstaRolandoDados()}
                        >
                            <h4>Você DEVE ACEITAR essas rolagens</h4>
                        </Botao>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function EstaRolandoDados() {
        return [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(rolagemDados.processoRolagem);
    }

    function ObterTotalDaRolagem(total: number) {
        if (indiceRolagem === 0 || EstaRolandoDados()) {
            return "?";
        } else {
            return total;
        }
    }

    function ExecutarRolagem() {
        setRolagemDados(ROLAGEM_PARA_PANILHA_NOVA_ZERADA);
        setIndiceRolagem((prevIndiceRolagem) => prevIndiceRolagem + 1);
    }

    function rolagemHabilidadeConcluida(totalValue: number, values: number[]) {
        setRolagemDados((prevRolandoDados) => {
            prevRolandoDados.rolagens.habilidade1 = values[0];
            prevRolandoDados.totais.habilidade = 6 + totalValue;
            return { ...prevRolandoDados };
        });
    }

    function rolagemEnergiaConcluida(totalValue: number, values: number[]) {
        setRolagemDados((prevRolandoDados) => {
            prevRolandoDados.rolagens.energia1 = values[0];
            prevRolandoDados.rolagens.energia2 = values[1];
            prevRolandoDados.totais.energia = 12 + totalValue;
            return { ...prevRolandoDados };
        });
    }

    function rolagemSorteConcluida(totalValue: number, values: number[]) {
        setRolagemDados((prevRolandoDados) => {
            prevRolandoDados.rolagens.sorte1 = values[0];
            prevRolandoDados.totais.sorte = 6 + totalValue;
            return { ...prevRolandoDados };
        });
    }

    function AceitarRolagem() {
        CriarPanilhaNoJogoAtualViaRolagens(rolagemDados.totais, "", EJogoNivel.FACIL);
    }
};

export default TelaPanilhaNova;
