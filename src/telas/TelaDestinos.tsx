import styles from "./TelaDestinos.module.scss";
import "../componentes/Botao.module.scss";
import { Botao } from "../componentes";
import { IDestino } from "../tipos";
import { ControleDestinos } from "../controles";
import { EProcesso } from "../uteis";
import ReactDice from "react-dice-complete";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { TEMPO_DADOS_ROLANDO_SEGUNDOS } from "../globais/Constantes";

export const TelaDestinos = () => {
    const {
        destinoItens,
        destinoDadosRef,
        salvando,
        curando,
        desativaBotoes,
        ContextosReprovados,
        EhFimDeJogo,
        AoReiniciar,
        AprovarSalvaJogoAtual,
        DesativarBotaoCurarViaProvisao,
        TextoBotaoCurarViaProvisao,
        EhSalvamentoAutomatico,
        AoSalvarJogoAtual,
        AoCurarViaProvisao,
        AoClicarBotaoDestino,
        AoObterDesativaBotao,
        ObterTesteSorteHabilidade,
        AoConcluirRolagem,
    } = ControleDestinos();

    if (ContextosReprovados()) {
        return <></>;
    }
    if (EhFimDeJogo()) {
        return (
            <div className={styles.destinoItens}>
                <div className={styles.destinos_morte}>
                    <div className={styles.destinos_comandos}>
                        <h3>{"VOCÊ MORREU - FIM DE JOGO"}</h3>
                    </div>
                    <div className={styles.destinos_conteudo}>
                        <div className={styles.destinos_conteudo_pagina}>
                            <Botao aoClicar={() => AoReiniciar()}>{"Voltar a página inicial"}</Botao>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.destinoItens}>
                <div className={styles.destinos_normal}>
                    <div className={styles.destinos_comandos}>
                        <h3>Escolha o seu Destino:</h3>
                        {MontarRetorno_CurarViaProvisao()}
                        {MontarRetorno_SalvaJogoAtual()}
                    </div>
                    {MontarRetorno_Destinos()}
                </div>
            </div>
        );
    }

    function MontarRetorno_SalvaJogoAtual() {
        if (AprovarSalvaJogoAtual()) {
            return <></>;
        }
        switch (salvando) {
            case EProcesso._ZERO:
                if (EhSalvamentoAutomatico()) {
                    AoSalvarJogoAtual();
                    return <></>;
                } else {
                    return (
                        <div className={styles.destinos_comandos_funcao}>
                            <Botao
                                aoClicar={() => AoSalvarJogoAtual()}
                                desativado={desativaBotoes}
                            >
                                <div className={styles.destinos_comandos_funcao_2}>
                                    <SaveOutlinedIcon />
                                    <p>{"SALVAR JOGO ?"}</p>
                                </div>
                            </Botao>
                        </div>
                    );
                }
            case (EProcesso.INICIANDO, EProcesso.PROCESSANDO):
                return (
                    <div className={styles.destinos_comandos_funcao + " " + styles.destinos_comandos_funcao_borda}>
                        <SaveOutlinedIcon />
                        <p>{"... SALVANDO O JOGO ..."}</p>
                    </div>
                );
            case EProcesso.CONCLUIDO:
                return (
                    <div className={styles.destinos_comandos_funcao + " " + styles.destinos_comandos_funcao_borda}>
                        <SaveOutlinedIcon />
                        <p>{"JOGO SALVO !"}</p>
                    </div>
                );
            default:
                return <></>;
        }
    }

    function MontarRetorno_CurarViaProvisao() {
        switch (curando) {
            case EProcesso._ZERO:
                return (
                    <div className={styles.destinos_comandos_funcao}>
                        <Botao
                            aoClicar={() => AoCurarViaProvisao()}
                            desativado={DesativarBotaoCurarViaProvisao(desativaBotoes)}
                        >
                            <div className={styles.destinos_comandos_funcao_2}>
                                <AutoAwesomeIcon />
                                <p>{TextoBotaoCurarViaProvisao()}</p>
                            </div>
                        </Botao>
                    </div>
                );
            case (EProcesso.INICIANDO, EProcesso.PROCESSANDO):
                return (
                    <div className={styles.destinos_comandos_funcao + " " + styles.destinos_comandos_funcao_borda}>
                        <AutoAwesomeIcon />
                        <p>{"... CURANDO ..."}</p>
                    </div>
                );
            case EProcesso.CONCLUIDO:
                return (
                    <div className={styles.destinos_comandos_funcao + " " + styles.destinos_comandos_funcao_borda}>
                        <AutoAwesomeIcon />
                        <p>{"CURADO !"}</p>
                    </div>
                );
            default:
                return <></>;
        }
    }

    function MontarRetorno_Destinos() {
        return (
            <div className={styles.destinos_conteudo}>
                {destinoItens.map((destinoI, indiceI) => {
                    return (
                        <div
                            key={indiceI}
                            className={styles.destinos_conteudo_pagina}
                        >
                            <Botao
                                aoClicar={AoClicarBotaoDestino(destinoI)}
                                desativado={AoObterDesativaBotao(destinoI)}
                            >
                                <>
                                    {MontarRetorno_TextoDestino(destinoI)}
                                    {MontarRetorno_TesteSorteHabilidade(destinoI)}
                                </>
                            </Botao>
                        </div>
                    );
                })}
            </div>
        );
    }

    function MontarRetorno_TextoDestino(destino: IDestino) {
        if (destino.textoDestino) {
            return <p>{destino.textoDestino}</p>;
        } else if (destino.textosDestino && destino.textosDestino.length) {
            return (
                <div>
                    {destino.textosDestino.map((textoI, indiceI) => {
                        return <p key={indiceI}>{textoI}</p>;
                    })}
                </div>
            );
        } else {
            return <p>{"???"}</p>;
        }
    }

    function MontarRetorno_TesteSorteHabilidade(destino: IDestino) {
        const _testeSH = ObterTesteSorteHabilidade(destino);
        if (!_testeSH) {
            return <></>;
        } else {
            return (
                <div className={styles.destinos_conteudo_pagina_rolagem}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_dados}>
                                    <span>{_testeSH.soma}</span>
                                    <ReactDice
                                        numDice={2}
                                        ref={destinoDadosRef}
                                        rollDone={AoConcluirRolagem}
                                        faceColor={_testeSH.corDados}
                                        dotColor={_testeSH.corDots}
                                        defaultRoll={1}
                                        disableIndividual={true}
                                        rollTime={TEMPO_DADOS_ROLANDO_SEGUNDOS}
                                    />
                                </td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_texto}>
                                    <span>{"Você terá " + _testeSH.atributoTexto}</span>
                                    <br />
                                    <span>{"se os dados resultarem em"}</span>
                                    <br />
                                    <span>
                                        {"MENOR OU IGUAL a "}
                                        <span className={styles.destinos_conteudo_pagina_rolagem_atributo}>{_testeSH.atributoValor.toString()}</span>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_dados}>
                                    <span className={styles.destinos_conteudo_pagina_rolagem_total}>{" = " + _testeSH.totalTexto}</span>
                                </td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_texto}>
                                    <span className={styles.destinos_conteudo_pagina_rolagem_total}>{_testeSH.resultadoTexto}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }
};

export default TelaDestinos;
