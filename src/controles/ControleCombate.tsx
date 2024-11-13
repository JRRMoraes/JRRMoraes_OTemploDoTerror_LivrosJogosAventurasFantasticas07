import { useEffect } from "react";
import { ContextoJogos, ContextoPagina, OperacoesJogoLivro } from "../contextos";
import {
    EPaginaExecutorEstado,
    EResultadoCombate,
    EPosturaInimigo,
    IInimigoExecucao,
    IAliadoExecucao,
    EResultadoDados,
    EFEITO_MORTE_NO_JOGADOR,
    EFEITO_ATAQUE_NO_JOGADOR,
    EFEITO_ATAQUE_NO_INIMIGO,
    EFEITO_SORTE_VITORIA_EM_ATAQUE_NO_INIMIGO,
    EFEITO_SORTE_DERROTA_EM_ATAQUE_NO_INIMIGO,
    EFEITO_SORTE_VITORIA_EM_DEFESA_DO_JOGADOR,
    EFEITO_SORTE_DERROTA_EM_DEFESA_DO_JOGADOR,
} from "../tipos";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO_PEQUENO, TEMPO_DADOS_RESULTADO_MILESIMOS } from "../globais/Constantes";

export const ControleCombate = () => {
    const {
        paginaEstado,
        setPaginaEstado,
        combateInimigos,
        setCombateInimigos,
        combateAliado,
        setCombateAliado,
        combateProcesso,
        setCombateProcesso,
        combateTextosDerrota,
        combateMultiplo_2osApoio,
        combateSerieDeAtaqueAtual,
        setCombateSerieDeAtaqueAtual,
        combateDadosJogadorRef,
        combateDadosInimigoRef,
        combateDadosSorteRef,
        combateProcessoSerieDeAtaque,
        setCombateProcessoSerieDeAtaque,
        AtualizarCombateExecutorNoProcessoInicial,
        AdicionarEmCombateInimigosEfeitosAplicados,
        ImporCombateInimigosExeProcessoRolagem,
        ImporCombateInimigosExeProcessoSorteConfirmacao,
        ImporCombateInimigosExeRolagemResultadoAtaque,
        ImporCombateInimigosExeRolagemResultadoSorte,
        AdicionarEmCombateAliadosEfeitosAplicados,
    } = ContextoPagina();

    const { jogoAtual, AdicionarEmJogadorEfeitosAplicados, AplicarPenalidadeDeTestarSorte } = ContextoJogos();

    const { AvaliarResultadoCombateDoCombateExecutorProcessoIniciando, AvaliarResultadoCombateDoCombateExecutorProcessoDestruido } = OperacoesJogoLivro();

    let _unicoSetCombateSerieDeAtaqueAtual: boolean = true;
    let _unicosCombateInimigosExeProcessoRolagemDestruido: boolean[] = Array(combateInimigos.length).fill(true);
    let _unicosCombateInimigosExeProcessoRolagemSorteConfirmacao: boolean[] = Array(combateInimigos.length).fill(true);

    useEffect(() => {
        if (!jogoAtual || paginaEstado !== EPaginaExecutorEstado.COMBATE) {
            setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
            setCombateProcesso(EProcesso._ZERO);
            return;
        }
        switch (combateProcesso) {
            case EProcesso._ZERO:
                AtualizarCombateExecutorNoProcessoInicial();
                break;
            case EProcesso.INICIANDO:
                setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
                setCombateProcesso(EProcesso.PROCESSANDO);
                _unicoSetCombateSerieDeAtaqueAtual = true;
                break;
            case EProcesso.CONCLUIDO:
                setCombateProcesso(EProcesso.DESTRUIDO);
                setPaginaEstado(EPaginaExecutorEstado.DESTINOS);
                break;
        }
    }, [paginaEstado, combateProcesso]);

    useEffect(() => {
        if (!jogoAtual || !combateInimigos || !combateInimigos.length || paginaEstado !== EPaginaExecutorEstado.COMBATE || combateProcesso !== EProcesso.PROCESSANDO) {
            return;
        }
        switch (combateProcessoSerieDeAtaque) {
            case EProcesso._ZERO:
                ImporCombateExecutorDoProcessoZeroDaSerieDeAtaque();
                setCombateProcessoSerieDeAtaque(EProcesso.INICIANDO);
                break;
            case EProcesso.INICIANDO:
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoIniciando()) {
                    case EResultadoCombate.VITORIA:
                        setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.DERROTA:
                        AplicarEfeitoDerrota();
                        setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate._COMBATENDO:
                    default:
                        setCombateProcessoSerieDeAtaque(EProcesso.PROCESSANDO);
                        break;
                }
                break;
            case EProcesso.PROCESSANDO:
                const _indiceAtaque = combateInimigos.findIndex(
                    (inimigoI, indiceI) => inimigoI.exeProcessoRolagemAtaque === EProcesso.CONCLUIDO && inimigoI.exeRolagemResultadoAtaque === EResultadoDados._NULO
                );
                if (_indiceAtaque >= 0) {
                    setCombateInimigos((prevCombateInimigo) => {
                        prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                            if (_indiceAtaque === indiceI) {
                                if (_unicosCombateInimigosExeProcessoRolagemDestruido[_indiceAtaque]) {
                                    _unicosCombateInimigosExeProcessoRolagemDestruido[_indiceAtaque] = false;
                                    if (inimigoI.exeRolagemTotalJogador > inimigoI.exeRolagemTotalInimigo) {
                                        inimigoI.exeRolagemResultadoAtaque = EResultadoDados.VITORIA;
                                        AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_ATAQUE_NO_INIMIGO(indiceI));
                                    } else if (inimigoI.exeRolagemTotalJogador < inimigoI.exeRolagemTotalInimigo) {
                                        inimigoI.exeRolagemResultadoAtaque = EResultadoDados.DERROTA;
                                        AdicionarEmCombateAliadosEfeitosAplicados(EFEITO_ATAQUE_NO_JOGADOR());
                                    } else if (inimigoI.exeRolagemTotalJogador === inimigoI.exeRolagemTotalInimigo) {
                                        inimigoI.exeRolagemResultadoAtaque = EResultadoDados.EMPATE;
                                    }
                                    inimigoI.exeProcessoRolagemSorteConfirmacao = EProcesso.INICIANDO;
                                    inimigoI.exeProcessoRolagemAtaque = EProcesso.DESTRUIDO;
                                }
                            }
                            return { ...inimigoI };
                        });
                        return [...prevCombateInimigo];
                    });
                    return;
                }
                const _indiceSorte = combateInimigos.findIndex(
                    (inimigoI, indiceI) => inimigoI.exeProcessoRolagemSorteConfirmacao === EProcesso.CONCLUIDO && inimigoI.exeRolagemResultadoSorte === EResultadoDados._NULO
                );
                if (_indiceSorte >= 0) {
                    setCombateInimigos((prevCombateInimigo) => {
                        prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                            if (_indiceAtaque === indiceI) {
                                if (_unicosCombateInimigosExeProcessoRolagemSorteConfirmacao[_indiceSorte]) {
                                    _unicosCombateInimigosExeProcessoRolagemSorteConfirmacao[_indiceSorte] = false;
                                    if (jogoAtual.panilha.sorte <= inimigoI.exeRolagemTotalSorte) {
                                        inimigoI.exeRolagemResultadoSorte = EResultadoDados.VITORIA;
                                        if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                                            AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_SORTE_VITORIA_EM_ATAQUE_NO_INIMIGO(indiceI));
                                        } else if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                                            AdicionarEmCombateAliadosEfeitosAplicados(EFEITO_SORTE_VITORIA_EM_DEFESA_DO_JOGADOR());
                                        }
                                    } else if (jogoAtual.panilha.sorte > inimigoI.exeRolagemTotalSorte) {
                                        inimigoI.exeRolagemResultadoSorte = EResultadoDados.DERROTA;
                                        if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                                            AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_SORTE_DERROTA_EM_ATAQUE_NO_INIMIGO(indiceI));
                                        } else if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                                            AdicionarEmCombateAliadosEfeitosAplicados(EFEITO_SORTE_DERROTA_EM_DEFESA_DO_JOGADOR());
                                        }
                                    }
                                    AplicarPenalidadeDeTestarSorte();
                                    inimigoI.exeProcessoRolagemSorteConfirmacao = EProcesso.DESTRUIDO;
                                }
                            }
                            return { ...inimigoI };
                        });
                        return [...prevCombateInimigo];
                    });
                    return;
                }

                /*
                combateInimigos.forEach((inimigoI, indiceI) => {
                    if (
                        inimigoI.exeProcessoRolagemAtaque === EProcesso.CONCLUIDO &&
                        inimigoI.exeRolagemResultadoAtaque === EResultadoDados._NULO &&
                        _unicosCombateInimigosExeProcessoRolagemDestruido[indiceI]
                    ) {
                        _unicosCombateInimigosExeProcessoRolagemDestruido[indiceI] = false;
                        let _resultado = EResultadoDados._NULO;
                        if (inimigoI.exeRolagemTotalJogador > inimigoI.exeRolagemTotalInimigo) {
                            _resultado = ImporCombateInimigosExeRolagemResultadoAtaque(indiceI, EResultadoDados.VITORIA);
                        } else if (inimigoI.exeRolagemTotalJogador < inimigoI.exeRolagemTotalInimigo) {
                            _resultado = ImporCombateInimigosExeRolagemResultadoAtaque(indiceI, EResultadoDados.DERROTA);
                        } else if (inimigoI.exeRolagemTotalJogador === inimigoI.exeRolagemTotalInimigo) {
                            _resultado = ImporCombateInimigosExeRolagemResultadoAtaque(indiceI, EResultadoDados.EMPATE);
                        }
                        if (_resultado === EResultadoDados.VITORIA) {
                            AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_ATAQUE_NO_INIMIGO(indiceI));
                        } else if (_resultado === EResultadoDados.DERROTA) {
                            AdicionarEmJogadorEfeitosAplicados(EFEITO_ATAQUE_NO_JOGADOR());
                        }
                        ImporCombateInimigosExeProcessoSorteConfirmacao(indiceI, EProcesso.INICIANDO);
                        ImporCombateInimigosExeProcessoRolagem(indiceI, EProcesso.DESTRUIDO);
                    }
                    if (
                        inimigoI.exeProcessoRolagemSorteConfirmacao === EProcesso.CONCLUIDO &&
                        inimigoI.exeRolagemResultadoSorte === EResultadoDados._NULO &&
                        _unicosCombateInimigosExeProcessoRolagemSorteConfirmacao[indiceI]
                    ) {
                        _unicosCombateInimigosExeProcessoRolagemSorteConfirmacao[indiceI] = false;
                        let _resultado = EResultadoDados._NULO;
                        if (jogoAtual.panilha.sorte <= inimigoI.exeRolagemTotalSorte) {
                            _resultado = ImporCombateInimigosExeRolagemResultadoSorte(indiceI, EResultadoDados.VITORIA);
                        } else if (jogoAtual.panilha.sorte > inimigoI.exeRolagemTotalSorte) {
                            _resultado = ImporCombateInimigosExeRolagemResultadoSorte(indiceI, EResultadoDados.DERROTA);
                        }
                        if (_resultado === EResultadoDados.VITORIA) {
                            if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                                AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_SORTE_VITORIA_EM_ATAQUE_NO_INIMIGO(indiceI));
                            } else if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                                AdicionarEmJogadorEfeitosAplicados(EFEITO_SORTE_VITORIA_EM_DEFESA_DO_JOGADOR());
                            }
                        } else if (_resultado === EResultadoDados.DERROTA) {
                            if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                                AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_SORTE_DERROTA_EM_ATAQUE_NO_INIMIGO(indiceI));
                            } else if (inimigoI.exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                                AdicionarEmJogadorEfeitosAplicados(EFEITO_SORTE_DERROTA_EM_DEFESA_DO_JOGADOR());
                            }
                        }
                        AplicarPenalidadeDeTestarSorte();
                        ImporCombateInimigosExeProcessoSorteConfirmacao(indiceI, EProcesso.DESTRUIDO);
                    }
                });
                /*/
                break;
            case EProcesso.DESTRUIDO:
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoDestruido()) {
                    case EResultadoCombate.VITORIA:
                        //setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.DERROTA:
                        AplicarEfeitoDerrota();
                        //setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate._COMBATENDO:
                    default:
                        setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
                        _unicoSetCombateSerieDeAtaqueAtual = true;
                        break;
                }
                break;
        }
    }, [combateProcessoSerieDeAtaque, combateInimigos]);

    return {
        jogoAtual,
        combateInimigos,
        combateAliado,
        combateTextosDerrota,
        combateSerieDeAtaqueAtual,
        combateDadosJogadorRef,
        combateDadosInimigoRef,
        combateDadosSorteRef,
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
        ObterJogadorOuAliado,
    };

    function ContextosReprovados() {
        return (
            !jogoAtual ||
            !combateInimigos ||
            !combateInimigos.length ||
            ![EPaginaExecutorEstado.COMBATE, EPaginaExecutorEstado.DESTINOS].includes(paginaEstado) ||
            ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(combateProcesso)
        );
    }

    function AprovarTextosDerrota() {
        return combateTextosDerrota && combateTextosDerrota.length;
    }

    function ImporCombateExecutorDoProcessoZeroDaSerieDeAtaque() {
        let _ajustado = false;
        let _temAtacante = false;
        setCombateInimigos((prevCombateInimigo) => {
            prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                if (!_ajustado) {
                    _temAtacante ||= inimigoI.exePosturaInimigo === EPosturaInimigo.ATACANTE;
                    if (combateMultiplo_2osApoio) {
                        if (!_temAtacante && inimigoI.exePosturaInimigo === EPosturaInimigo.APOIO) {
                            inimigoI.exePosturaInimigo = EPosturaInimigo.ATACANTE;
                            _ajustado = true;
                        }
                    } else {
                        if (!_temAtacante && inimigoI.exePosturaInimigo === EPosturaInimigo._AGUARDANDO) {
                            inimigoI.exePosturaInimigo = EPosturaInimigo.ATACANTE;
                            _ajustado = true;
                        }
                    }
                }
                if ([EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigoI.exePosturaInimigo)) {
                    inimigoI.exeProcessoRolagemAtaque = EProcesso.INICIANDO;
                    inimigoI.exeProcessoRolagemSorteConfirmacao = EProcesso._ZERO;
                } else if ([EPosturaInimigo._AGUARDANDO].includes(inimigoI.exePosturaInimigo)) {
                    inimigoI.exeProcessoRolagemAtaque = EProcesso._ZERO;
                    inimigoI.exeProcessoRolagemSorteConfirmacao = EProcesso._ZERO;
                }
                inimigoI.exeRolagemResultadoAtaque = EResultadoDados._NULO;
                inimigoI.exeRolagemResultadoSorte = EResultadoDados._NULO;
                inimigoI.exeRolagemTotalJogador = 0;
                inimigoI.exeRolagemTotalInimigo = 0;
                inimigoI.exeRolagemTotalSorte = 0;
                return inimigoI;
            });
            return [...prevCombateInimigo];
        });
        if (_unicoSetCombateSerieDeAtaqueAtual) {
            _unicoSetCombateSerieDeAtaqueAtual = false;
            setCombateSerieDeAtaqueAtual((prevCombateSerieDeAtaqueAtual) => (prevCombateSerieDeAtaqueAtual += 1));
        }
    }

    function AplicarEfeitoDerrota() {
        if (jogoAtual.panilha && jogoAtual.panilha.energia > 0) {
            AdicionarEmJogadorEfeitosAplicados(EFEITO_MORTE_NO_JOGADOR());
        }
    }

    function AprovarBotaoRolarCombate(inimigo: IInimigoExecucao) {
        return (
            combateProcessoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigo.exePosturaInimigo) &&
            inimigo.exeProcessoRolagemAtaque === EProcesso.INICIANDO
        );
    }

    function AprovarBotaoTestarSorte(inimigo: IInimigoExecucao) {
        return (
            combateProcessoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigo.exePosturaInimigo) &&
            inimigo.exeProcessoRolagemSorteConfirmacao === EProcesso.INICIANDO
        );
    }
    function AprovarBotaoConfirmar(inimigo: IInimigoExecucao) {
        return (
            combateProcessoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(inimigo.exePosturaInimigo) &&
            inimigo.exeProcessoRolagemSorteConfirmacao === EProcesso.INICIANDO
        );
    }

    function AoRolarCombate(inimigo: IInimigoExecucao, indice: number) {
        const _aoClicar = () => {
            combateDadosJogadorRef[indice]?.current?.rollAll();
            combateDadosInimigoRef[indice]?.current?.rollAll();
            ImporCombateInimigosExeProcessoRolagem(indice, EProcesso.PROCESSANDO);
            setTimeout(() => {
                ImporCombateInimigosExeProcessoRolagem(indice, EProcesso.CONCLUIDO);
            }, TEMPO_DADOS_RESULTADO_MILESIMOS);
        };
        return _aoClicar;
    }

    function AoTestarSorte(inimigo: IInimigoExecucao, indice: number) {
        const _aoClicar = () => {
            combateDadosSorteRef[indice]?.current?.rollAll();
            ImporCombateInimigosExeProcessoSorteConfirmacao(indice, EProcesso.PROCESSANDO);
            setCombateProcessoSerieDeAtaque(EProcesso.CONCLUIDO);
            setTimeout(() => {
                ImporCombateInimigosExeProcessoSorteConfirmacao(indice, EProcesso.CONCLUIDO);
                setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
            }, TEMPO_DADOS_RESULTADO_MILESIMOS);
        };
        return _aoClicar;
    }

    function AoConfirmar(inimigo: IInimigoExecucao, indice: number) {
        const _aoClicar = () => {
            setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
            ImporCombateInimigosExeProcessoSorteConfirmacao(indice, EProcesso.CONCLUIDO);
        };
        return _aoClicar;
    }

    function AoConcluirRolarCombateJogador(inimigo: IInimigoExecucao, indice: number) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (indice === indiceI) {
                        inimigoI.exeRolagemTotalJogador = totalValue + ObterJogadorOuAliado().habilidade;
                    }
                    return { ...inimigoI };
                });
                return [...prevCombateInimigo];
            });
        };
        return _aoConcluir;
    }

    function AoConcluirRolarCombateInimigo(inimigo: IInimigoExecucao, indice: number) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (indice === indiceI) {
                        inimigoI.exeRolagemTotalInimigo = totalValue + inimigoI.habilidade;
                    }
                    return { ...inimigoI };
                });
                return [...prevCombateInimigo];
            });
        };
        return _aoConcluir;
    }

    function AoConcluirTestarSorte(inimigo: IInimigoExecucao, indice: number) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (indice === indiceI && totalValue > 0) {
                        inimigoI.exeRolagemTotalSorte = totalValue;
                    }
                    return { ...inimigoI };
                });
                return [...prevCombateInimigo];
            });
        };
        return _aoConcluir;
    }

    function ObterJogadorOuAliado(): IAliadoExecucao {
        const _jogadorOuAliado: IAliadoExecucao =
            !combateAliado ?
                {
                    aliado: jogoAtual.panilha.nome,
                    energia: jogoAtual.panilha.energiaInicial,
                    habilidade: jogoAtual.panilha.habilidade,
                    exeEnergiaAtual: jogoAtual.panilha.energia,
                    exeEhAliado: false,
                    exeEstaVivo: jogoAtual.panilha.energia > 0,
                }
            :   {
                    aliado: combateAliado.aliado,
                    energia: combateAliado.energia,
                    habilidade: combateAliado.habilidade,
                    exeEnergiaAtual: combateAliado.exeEnergiaAtual,
                    exeEhAliado: true,
                    exeEstaVivo: combateAliado.exeEnergiaAtual > 0,
                };
        return _jogadorOuAliado;
    }
};

export default ControleCombate;
