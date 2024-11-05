import { useState, useEffect, useRef } from "react";
import { ContextoJogos, OperacoesJogoLivro } from "../contextos";
import { EPaginaExecutorEstado, EResultadoCombate, EPosturaInimigo, EAtributo, IEfeitoExecucao, IRolagemParaCombate, IInimigoExecucao } from "../tipos";
import { EProcesso } from "../uteis";
import { DieContainerRef } from "react-dice-complete/dist/DiceContainer";
import { TEMPO_DADOS_ROLANDO_MILESIMOS } from "../globais/Constantes";

export const ControleCombate = () => {
    const { jogoAtual, paginaExecutor, combateExecutor, setCombateExecutor, ImporProcessoCombateNoCombateExecutor, AplicarEfeitosAtuaisDaHistoria } = ContextoJogos();

    const { AvaliarResultadoCombateDoCombateExecutorProcessoIniciando, AvaliarResultadoCombateDoCombateExecutorProcessoDestruido } = OperacoesJogoLivro();

    const [rolagensCombate, setRolagensCombate] = useState<IRolagemParaCombate[]>(ImporRolagensCombate());
    const [effectCombateExecutor, setEffectCombateExecutor] = useState<IProcessosCombateExecutor>({ processoCombate: EProcesso._ZERO, processoSerieDeAtaque: EProcesso._ZERO });

    useEffect(() => {
        ProcessarEffect_CombateExecutor();
    }, [effectCombateExecutor]);

    return {
        jogoAtual,
        combateExecutor,
        ContextosReprovados,
        AprovarTextosDerrota,
        AprovarBotaoRolarCombate,
        AprovarBotaoTestarSorte,
        AprovarBotaoConfirmar,
        AoRolarCombate,
        AoTestarSorte,
        AoConfirmar,
        AoConcluirRolarCombateJogador,
        AoConcluirRolarCombateInimigo,
        AoConcluirTestarSorte,
        ObterRolagemCombateViaInimigo,
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

    function ProcessarEffect_CombateExecutor() {
        if (ContextosReprovados(false)) {
            ImporEffectCombateExecutor(EProcesso._ZERO, EProcesso._ZERO, true);
            return;
        }
        if (paginaExecutor.exeEstado !== EPaginaExecutorEstado.COMBATE) {
            return;
        }
        if (combateExecutor.processoCombate === EProcesso.INICIANDO) {
            ImporProcessoCombateNoCombateExecutor(EProcesso.PROCESSANDO);
            ImporEffectCombateExecutor(EProcesso.PROCESSANDO, EProcesso._ZERO);
            return;
        }
        if (combateExecutor.processoCombate === EProcesso.PROCESSANDO) {
            if (combateExecutor.processoSerieDeAtaque === EProcesso._ZERO) {
                ImporCombateExecutorDoProcessoZeroDaSerieDeAtaque();
                ImporEffectCombateExecutor(EProcesso._ZERO, EProcesso.INICIANDO);
            } else if (combateExecutor.processoSerieDeAtaque === EProcesso.INICIANDO) {
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoIniciando()) {
                    case EResultadoCombate.VITORIA:
                        ImporProcessoCombateNoCombateExecutor(EProcesso.CONCLUIDO);
                        ImporEffectCombateExecutor(EProcesso.CONCLUIDO, EProcesso._ZERO);
                        break;
                    case EResultadoCombate.DERROTA:
                        AplicarEfeitoDerrota();
                        ImporProcessoCombateNoCombateExecutor(EProcesso.CONCLUIDO);
                        ImporEffectCombateExecutor(EProcesso.CONCLUIDO, EProcesso._ZERO);
                        break;
                    case EResultadoCombate._COMBATENDO:
                    default:
                        setCombateExecutor((prevCombateExecutor) => {
                            prevCombateExecutor.processoSerieDeAtaque = EProcesso.PROCESSANDO;
                            return { ...prevCombateExecutor };
                        });
                        ImporEffectCombateExecutor(EProcesso._ZERO, EProcesso.PROCESSANDO);
                        break;
                }
            } else if (combateExecutor.processoSerieDeAtaque === EProcesso.PROCESSANDO) {
                rolagensCombate.forEach((rolagemI) => {
                    if (rolagemI.exeProcessoRolagem === EProcesso.CONCLUIDO) {
                        setRolagensCombate((prevRolagensCombate2) => {
                            prevRolagensCombate2 = prevRolagensCombate2.map((rolagemI2) => {
                                if (rolagemI2.exeIdRolagemCombate === rolagemI.exeIdRolagemCombate) {
                                    rolagemI2.exeProcessoRolagem = EProcesso.DESTRUIDO;
                                    rolagemI2.exeProcessoSorteConfirmacao = EProcesso.INICIANDO;
                                }
                                return { ...rolagemI2 };
                            });
                            return [...prevRolagensCombate2];
                        });
                    }
                    if (rolagemI.exeProcessoSorteConfirmacao === EProcesso.CONCLUIDO) {
                        setRolagensCombate((prevRolagensCombate2) => {
                            prevRolagensCombate2 = prevRolagensCombate2.map((rolagemI2) => {
                                if (rolagemI2.exeIdRolagemCombate === rolagemI.exeIdRolagemCombate) {
                                    rolagemI2.exeProcessoSorteConfirmacao = EProcesso.DESTRUIDO;
                                }
                                return { ...rolagemI2 };
                            });
                            return [...prevRolagensCombate2];
                        });
                    }
                });
            } else if (combateExecutor.processoSerieDeAtaque === EProcesso.DESTRUIDO) {
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoDestruido()) {
                    case EResultadoCombate.VITORIA:
                        ImporProcessoCombateNoCombateExecutor(EProcesso.CONCLUIDO);
                        ImporEffectCombateExecutor(EProcesso.CONCLUIDO, EProcesso._ZERO);
                        break;
                    case EResultadoCombate.DERROTA:
                        AplicarEfeitoDerrota();
                        ImporProcessoCombateNoCombateExecutor(EProcesso.CONCLUIDO);
                        ImporEffectCombateExecutor(EProcesso.CONCLUIDO, EProcesso._ZERO);
                        break;
                    case EResultadoCombate._COMBATENDO:
                    default:
                        setCombateExecutor((prevCombateExecutor) => {
                            prevCombateExecutor.processoSerieDeAtaque = EProcesso._ZERO;
                            return { ...prevCombateExecutor };
                        });
                        ImporEffectCombateExecutor(EProcesso.PROCESSANDO, EProcesso._ZERO, true);
                        break;
                }
            }
        }
    }

    function ImporEffectCombateExecutor(processoCombate: EProcesso, processoSerieDeAtaque: EProcesso, consideraZero: boolean = false) {
        let _altera = (consideraZero || processoCombate !== EProcesso._ZERO) && effectCombateExecutor.processoCombate !== processoCombate;
        _altera ||= (consideraZero || processoSerieDeAtaque !== EProcesso._ZERO) && effectCombateExecutor.processoSerieDeAtaque !== processoSerieDeAtaque;
        if (!_altera) {
            return;
        }
        setEffectCombateExecutor((prevEffectCombateExecutor) => {
            if (consideraZero || processoCombate !== EProcesso._ZERO) {
                prevEffectCombateExecutor.processoCombate = processoCombate;
            }
            if (consideraZero || processoSerieDeAtaque !== EProcesso._ZERO) {
                prevEffectCombateExecutor.processoSerieDeAtaque = processoSerieDeAtaque;
            }
            return { ...prevEffectCombateExecutor };
        });
    }

    function ImporRolagensCombate(): IRolagemParaCombate[] {
        const _rolagens: IRolagemParaCombate[] = [];
        if (combateExecutor && combateExecutor.inimigos && combateExecutor.inimigos.length) {
            combateExecutor.inimigos.forEach((inimigoI) => {
                const _rolagemParaCombate: IRolagemParaCombate = {
                    exeIdRolagemCombate: inimigoI.exeIdRolagemCombate,
                    exeProcessoRolagem: EProcesso._ZERO,
                    exeProcessoSorteConfirmacao: EProcesso._ZERO,
                    exeDadosJogadorRef: useRef<DieContainerRef>(null),
                    exeRolagemTotalJogador: 0,
                    exeDadosInimigoRef: useRef<DieContainerRef>(null),
                    exeRolagemTotalInimigo: 0,
                    exeDadosSorteRef: useRef<DieContainerRef>(null),
                    exeRolagemTotalSorte: 0,
                };
                _rolagens.push(_rolagemParaCombate);
            });
        }
        return _rolagens;
    }

    function AprovarTextosDerrota() {
        return combateExecutor.textosDerrota && combateExecutor.textosDerrota.length;
    }

    function ImporCombateExecutorDoProcessoZeroDaSerieDeAtaque() {
        let _ajustado = false;
        combateExecutor.inimigos.forEach((inimigoI, indiceI) => {
            if (!_ajustado) {
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
                        _ajustado = true;
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
                        _ajustado = true;
                    }
                }
            }
            setRolagensCombate((prevRolagensCombate) => {
                prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                    if (rolagemI.exeIdRolagemCombate === inimigoI.exeIdRolagemCombate) {
                        if ([EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigoI.exePosturaInimigo)) {
                            rolagemI.exeProcessoRolagem = EProcesso.INICIANDO;
                        } else {
                            rolagemI.exeProcessoRolagem = EProcesso._ZERO;
                        }
                        rolagemI.exeProcessoSorteConfirmacao = EProcesso._ZERO;
                    }
                    return { ...rolagemI };
                });
                return [...prevRolagensCombate];
            });
        });
        setCombateExecutor((prevCombateExecutor) => {
            prevCombateExecutor.serieDeAtaqueAtual += 1;
            prevCombateExecutor.processoSerieDeAtaque = EProcesso.INICIANDO;
            return { ...prevCombateExecutor };
        });
    }

    function AplicarEfeitoDerrota() {
        if (jogoAtual.panilha && jogoAtual.panilha.energia <= 0) {
            const _efeitoDerrota: IEfeitoExecucao = {
                atributoEfeito: EAtributo.ENERGIA,
                textoEfeito: "DERROTA!!!",
                nomeEfeito: "",
                quantidade: -999,
                exeProcessoEfeito: EProcesso._ZERO,
                exeIdEfeito: 99999,
            };
            AplicarEfeitosAtuaisDaHistoria([_efeitoDerrota]);
        }
    }

    function AprovarBotaoRolarCombate(inimigo: IInimigoExecucao) {
        const _rolagem = ObterRolagemCombateViaInimigo(inimigo);
        return (
            combateExecutor.processoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigo.exePosturaInimigo) &&
            _rolagem &&
            _rolagem.exeProcessoRolagem === EProcesso.INICIANDO
        );
    }

    function AprovarBotaoTestarSorte(inimigo: IInimigoExecucao) {
        const _rolagem = ObterRolagemCombateViaInimigo(inimigo);
        return (
            combateExecutor.processoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigo.exePosturaInimigo) &&
            _rolagem &&
            _rolagem.exeProcessoSorteConfirmacao === EProcesso.INICIANDO
        );
    }
    function AprovarBotaoConfirmar(inimigo: IInimigoExecucao) {
        const _rolagem = ObterRolagemCombateViaInimigo(inimigo);
        return (
            combateExecutor.processoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigo.exePosturaInimigo) &&
            _rolagem &&
            _rolagem.exeProcessoSorteConfirmacao === EProcesso.INICIANDO
        );
    }

    function AoRolarCombate(inimigo: IInimigoExecucao) {
        const _aoClicar = () => {
            const _rolagem = ObterRolagemCombateViaInimigo(inimigo);
            if (_rolagem) {
                _rolagem.exeDadosJogadorRef.current?.rollAll();
                _rolagem.exeDadosInimigoRef.current?.rollAll();
            }
            setRolagensCombate((prevRolagensCombate) => {
                prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                    if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                        rolagemI.exeProcessoRolagem = EProcesso.PROCESSANDO;
                    }
                    return { ...rolagemI };
                });
                return [...prevRolagensCombate];
            });
            setTimeout(() => {
                setRolagensCombate((prevRolagensCombate) => {
                    prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                        if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                            rolagemI.exeProcessoRolagem = EProcesso.CONCLUIDO;
                        }
                        return { ...rolagemI };
                    });
                    return [...prevRolagensCombate];
                });
            }, TEMPO_DADOS_ROLANDO_MILESIMOS);
        };
        return _aoClicar;
    }

    function AoTestarSorte(inimigo: IInimigoExecucao) {
        const _aoClicar = () => {
            const _rolagem = ObterRolagemCombateViaInimigo(inimigo);
            if (_rolagem) {
                _rolagem.exeDadosSorteRef.current?.rollAll();
            }
            setCombateExecutor((prevCombateExecutor) => {
                prevCombateExecutor.processoSerieDeAtaque = EProcesso.CONCLUIDO;
                return { ...prevCombateExecutor };
            });
            setTimeout(() => {
                setCombateExecutor((prevCombateExecutor) => {
                    prevCombateExecutor.processoSerieDeAtaque = EProcesso.DESTRUIDO;
                    return { ...prevCombateExecutor };
                });
            }, TEMPO_DADOS_ROLANDO_MILESIMOS);
            setRolagensCombate((prevRolagensCombate) => {
                prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                    if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                        rolagemI.exeProcessoSorteConfirmacao = EProcesso.PROCESSANDO;
                    }
                    return { ...rolagemI };
                });
                return [...prevRolagensCombate];
            });
            setTimeout(() => {
                setRolagensCombate((prevRolagensCombate) => {
                    prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                        if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                            rolagemI.exeProcessoSorteConfirmacao = EProcesso.CONCLUIDO;
                        }
                        return { ...rolagemI };
                    });
                    return [...prevRolagensCombate];
                });
            }, TEMPO_DADOS_ROLANDO_MILESIMOS);
        };
        return _aoClicar;
    }

    function AoConfirmar(inimigo: IInimigoExecucao) {
        const _aoClicar = () => {
            setCombateExecutor((prevCombateExecutor) => {
                prevCombateExecutor.processoSerieDeAtaque = EProcesso.DESTRUIDO;
                return { ...prevCombateExecutor };
            });
            setRolagensCombate((prevRolagensCombate) => {
                prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                    if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                        rolagemI.exeProcessoSorteConfirmacao = EProcesso.CONCLUIDO;
                    }
                    return { ...rolagemI };
                });
                return [...prevRolagensCombate];
            });
        };
        return _aoClicar;
    }

    function AoConcluirRolarCombateJogador(inimigo: IInimigoExecucao) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            setRolagensCombate((prevRolagensCombate) => {
                prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                    if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                        rolagemI.exeRolagemTotalJogador = totalValue + jogoAtual.panilha.habilidade;
                    }
                    return { ...rolagemI };
                });
                return [...prevRolagensCombate];
            });
        };
        return _aoConcluir;
    }

    function AoConcluirRolarCombateInimigo(inimigo: IInimigoExecucao) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            setRolagensCombate((prevRolagensCombate) => {
                prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                    if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                        rolagemI.exeRolagemTotalInimigo = totalValue + inimigo.habilidade;
                    }
                    return { ...rolagemI };
                });
                return [...prevRolagensCombate];
            });
        };
        return _aoConcluir;
    }

    function AoConcluirTestarSorte(inimigo: IInimigoExecucao) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            setRolagensCombate((prevRolagensCombate) => {
                prevRolagensCombate = prevRolagensCombate.map((rolagemI) => {
                    if (rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate) {
                        rolagemI.exeRolagemTotalSorte = totalValue + jogoAtual.panilha.sorte;
                    }
                    return { ...rolagemI };
                });
                return [...prevRolagensCombate];
            });
        };
        return _aoConcluir;
    }

    function ObterRolagemCombateViaInimigo(inimigo: IInimigoExecucao) {
        return rolagensCombate.find((rolagemI) => rolagemI.exeIdRolagemCombate === inimigo.exeIdRolagemCombate);
    }
};

export default ControleCombate;

interface IProcessosCombateExecutor {
    processoCombate: EProcesso;
    processoSerieDeAtaque: EProcesso;
}
