import { useState, useEffect, useRef } from "react";
import { ContextoJogos } from "../contextos";
import {
    EPaginaExecutorEstado,
    EResultadoCombate,
    EPosturaInimigo,
    AvaliarResultadoCombateDoCombateExecutorProcessoIniciando,
    AvaliarResultadoCombateDoCombateExecutorProcessoDestruido,
} from "../tipos";
import { EProcesso } from "../uteis";
import { ReactDiceRef } from "react-dice-complete";

export const ControleCombate = () => {
    const { jogoAtual, paginaExecutor, combateExecutor, setCombateExecutor, ImporProcessoCombateNoCombateExecutor } = ContextoJogos();

    const dados = useRef<ReactDiceRef>(null);

    // const [rolagemDados, setRolagemDados] = useState<IRolagemParaDestino>(ROLAGEM_PARA_DESTINO_ZERADA);

    useEffect(() => {
        if (ContextosReprovados(false)) {
            return;
        }
        if (combateExecutor.processoCombate === EProcesso.INICIANDO) {
            //setSerieDeAtaqueAtual(1);
            //setProcessoSerieDeAtaque(EProcesso._ZERO);
            ImporProcessoCombateNoCombateExecutor(EProcesso.PROCESSANDO);
            return;
        }
        if (combateExecutor.processoCombate === EProcesso.PROCESSANDO) {
            if (combateExecutor.processoSerieDeAtaque === EProcesso._ZERO) {
                ImporCombateExecutorDoProcessoZeroDaSerieDeAtaque();
            } else if (combateExecutor.processoSerieDeAtaque === EProcesso.INICIANDO) {
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoIniciando(combateExecutor, jogoAtual.panilha)) {
                    case EResultadoCombate.VITORIA:
                        ImporProcessoCombateNoCombateExecutor(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.DERROTA:
                        // matar ou destino derrota
                        break;
                    case EResultadoCombate._COMBATENDO:
                    default:
                        setCombateExecutor((prevCombateExecutor) => {
                            prevCombateExecutor.processoSerieDeAtaque = EProcesso.PROCESSANDO;
                            return { ...prevCombateExecutor };
                        });
                        break;
                }
            } else if (combateExecutor.processoSerieDeAtaque === EProcesso.PROCESSANDO) {
                // rolar dados
            } else if (combateExecutor.processoSerieDeAtaque === EProcesso.DESTRUIDO) {
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoDestruido(combateExecutor, jogoAtual.panilha)) {
                    case EResultadoCombate.VITORIA:
                        ImporProcessoCombateNoCombateExecutor(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.DERROTA:
                        // matar ou destino derrota
                        break;
                    case EResultadoCombate._COMBATENDO:
                    default:
                        setCombateExecutor((prevCombateExecutor) => {
                            prevCombateExecutor.processoSerieDeAtaque = EProcesso._ZERO;
                            return { ...prevCombateExecutor };
                        });
                        break;
                }
                ///// teste
                ImporProcessoCombateNoCombateExecutor(EProcesso.CONCLUIDO);
            }
        }
    }, [combateExecutor]);

    return {
        combateExecutor,
        ContextosReprovados,
        AprovarTextosDerrota,
        AprovarBotaoRolarCombate,
        AoRolarCombate,
    };

    function ContextosReprovados(processoIniciandoReprova: boolean) {
        let _reprovado =
            !jogoAtual ||
            !combateExecutor ||
            !combateExecutor.inimigos ||
            !combateExecutor.inimigos.length ||
            ![EPaginaExecutorEstado.COMBATE, EPaginaExecutorEstado.DESTINOS].includes(paginaExecutor.exeEstado);
        if (processoIniciandoReprova) {
            _reprovado ||= ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(combateExecutor.processoCombate);
        } else {
            _reprovado ||= ![EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(combateExecutor.processoCombate);
        }
        return _reprovado;
    }

    function AprovarTextosDerrota() {
        return combateExecutor.textosDerrota && combateExecutor.textosDerrota.length;
    }

    function ImporCombateExecutorDoProcessoZeroDaSerieDeAtaque() {
        setCombateExecutor((prevCombateExecutor) => {
            prevCombateExecutor.serieDeAtaqueAtual += 1;
            prevCombateExecutor.processoSerieDeAtaque = EProcesso.INICIANDO;
            return { ...prevCombateExecutor };
        });
        combateExecutor.inimigos.forEach((inimigoI, indiceI) => {
            const _temAtacante = inimigoI.exePosturaInimigo === EPosturaInimigo.ATACANTE;
            if (combateExecutor.combateMultiplo_2osApoio) {
                if (!_temAtacante && inimigoI.exePosturaInimigo === EPosturaInimigo.APOIO) {
                    setCombateExecutor((prevCombateExecutor) => {
                        prevCombateExecutor.inimigos = prevCombateExecutor.inimigos.map((inimigoI2, indiceI2) => {
                            if (indiceI === indiceI2) {
                                inimigoI2.exePosturaInimigo = EPosturaInimigo.ATACANTE;
                            }
                            return inimigoI2;
                        });
                        return { ...prevCombateExecutor };
                    });
                    return;
                }
            } else {
                if (!_temAtacante && inimigoI.exePosturaInimigo === EPosturaInimigo._AGUARDANDO) {
                    setCombateExecutor((prevCombateExecutor) => {
                        prevCombateExecutor.inimigos = prevCombateExecutor.inimigos.map((inimigoI2, indiceI2) => {
                            if (indiceI === indiceI2) {
                                inimigoI2.exePosturaInimigo = EPosturaInimigo.ATACANTE;
                            }
                            return inimigoI2;
                        });
                        return { ...prevCombateExecutor };
                    });
                    return;
                }
            }
        });
    }

    function AprovarBotaoRolarCombate() {
        return combateExecutor.processoSerieDeAtaque === EProcesso.PROCESSANDO;
    }

    function AoRolarCombate() {
        setCombateExecutor((prevCombateExecutor) => {
            prevCombateExecutor.processoSerieDeAtaque = EProcesso.DESTRUIDO;
            return { ...prevCombateExecutor };
        });
    }
};

export default ControleCombate;
