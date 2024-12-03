import styles from "../telas/TelaCombate.module.scss";
import { useEffect } from "react";
import { ContextoLivro, ContextoJogos, ContextoPagina, OperacoesJogoLivro } from "../contextos";
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
    EAtributo,
    IEfeito,
    EAudioMomentoEfeitoSonoro,
    EAudioMomentoMusica,
} from "../tipos";
import { EProcesso, FormatarNumberInteiro } from "../uteis";
import { TEMPO_DADOS_RESULTADO_MILESIMOS } from "../globais/Constantes";

export const ControleCombate = () => {
    const { ImporAudioMusicaViaMomento, AdicionarNoAudioEfeitosViaMomento } = ContextoLivro();

    const { jogoAtual, AdicionarEmJogadorEfeitosAplicados, AplicarPenalidadeDeTestarSorte } = ContextoJogos();

    const {
        paginaEstado,
        setPaginaEstado,
        combateInimigos,
        setCombateInimigos,
        combateInimigos_PosturaInimigo,
        combateInimigos_ProcessoRolagemAtaque,
        combateInimigos_ProcessoRolagemSorteConfirmacao,
        combateAliado,
        setCombateAliado,
        combateProcesso,
        setCombateProcesso,
        combateAprovacaoDerrota,
        combateTextosDerrota,
        combateMultiplo_2osApoio,
        combateSerieDeAtaqueAtual,
        setCombateSerieDeAtaqueAtual,
        combateDadosJogadorRef,
        combateDadosInimigoRef,
        combateDadosSorteRef,
        combateProcessoSerieDeAtaque,
        setCombateProcessoSerieDeAtaque,
        combateResultadoFinalDerrota,
        combateResultadoFinalInimigos,
        AtualizarCombateExecutorNoProcessoInicial,
        ObterCombateAliadoEfeitosAplicadosDoAtributo,
        ImporCombateInimigos_PosturaInimigo,
        ObterCombateInimigosEfeitosAplicados,
        AdicionarEmCombateInimigosEfeitosAplicados,
        ImporCombateInimigos_ProcessoRolagemAtaque,
        ImporCombateInimigos_ProcessoRolagemSorteConfirmacao,
        AdicionarEmCombateAliadosEfeitosAplicados,
        ImporCombateInimigosExeSerieDeAtaqueVencidoConsecutivo,
    } = ContextoPagina();

    const {
        AvaliarResultadoCombateDoCombateExecutorProcessoIniciando,
        AvaliarResultadoCombateDoCombateExecutorProcessoDestruido,
        MontarElementoCombateAprovacaoDerrota,
        AprovarExibicaoDeSerieDeAtaqueVencidoConsecutivo,
    } = OperacoesJogoLivro();

    let _unicoSetCombateSerieDeAtaqueAtual: boolean = true;

    useEffect(() => {
        if (!jogoAtual || paginaEstado !== EPaginaExecutorEstado.COMBATE) {
            return;
        }
        switch (combateProcesso) {
            case EProcesso._ZERO:
                setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
                setCombateProcesso(EProcesso._ZERO);
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
                ImporCombateInimigosExecutorDoProcessoZeroDaSerieDeAtaque();
                break;
            case EProcesso.INICIANDO:
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoIniciando()) {
                    case EResultadoCombate.VITORIA:
                        ImporAudioMusicaViaMomento(EAudioMomentoMusica.VITORIA_COMBATE);
                        setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.DERROTA:
                        ImporAudioMusicaViaMomento(EAudioMomentoMusica.DERROTA_COMBATE);
                        AplicarEfeitoDerrota();
                        setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.COMBATENDO:
                    default:
                        setCombateProcessoSerieDeAtaque(EProcesso.PROCESSANDO);
                        break;
                }
                break;
            case EProcesso.DESTRUIDO:
                switch (AvaliarResultadoCombateDoCombateExecutorProcessoDestruido()) {
                    case EResultadoCombate.VITORIA:
                        ImporAudioMusicaViaMomento(EAudioMomentoMusica.VITORIA_COMBATE);
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.DERROTA:
                        ImporAudioMusicaViaMomento(EAudioMomentoMusica.DERROTA_COMBATE);
                        AplicarEfeitoDerrota();
                        setCombateProcesso(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.COMBATENDO:
                    default:
                        setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
                        _unicoSetCombateSerieDeAtaqueAtual = true;
                        break;
                }
                break;
        }
    }, [combateProcessoSerieDeAtaque, combateInimigos, combateInimigos_PosturaInimigo]);

    useEffect(() => {
        if (
            !jogoAtual ||
            !combateInimigos ||
            !combateInimigos.length ||
            paginaEstado !== EPaginaExecutorEstado.COMBATE ||
            combateProcesso !== EProcesso.PROCESSANDO ||
            combateProcessoSerieDeAtaque !== EProcesso.PROCESSANDO
        ) {
            return;
        }
        //// Descobrir se inimigo está morto
        let _indiceIdInimigo = combateInimigos.findIndex((inimigoI) => inimigoI.exeEnergiaAtual === 0 && combateInimigos_PosturaInimigo[inimigoI.exeIdInimigo] !== EPosturaInimigo.MORTO);
        if (_indiceIdInimigo >= 0) {
            AdicionarNoAudioEfeitosViaMomento(EAudioMomentoEfeitoSonoro.VITORIA_SOBRE_INIMIGO);
            ImporCombateInimigos_PosturaInimigo(_indiceIdInimigo, EPosturaInimigo.MORTO);
            ImporCombateInimigos_ProcessoRolagemAtaque(_indiceIdInimigo, EProcesso.DESTRUIDO);
            ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(_indiceIdInimigo, EProcesso.DESTRUIDO);
            setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
            return;
        }
        //// Rolagem de ataque Concluído, mas sem resultado
        _indiceIdInimigo = combateInimigos.findIndex(
            (inimigoI) => combateInimigos_ProcessoRolagemAtaque[inimigoI.exeIdInimigo] === EProcesso.CONCLUIDO && inimigoI.exeRolagemResultadoAtaque === EResultadoDados._NULO
        );
        if (_indiceIdInimigo >= 0) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (_indiceIdInimigo === indiceI) {
                        if (inimigoI.exeRolagemTotalJogador > inimigoI.exeRolagemTotalInimigo) {
                            inimigoI.exeRolagemResultadoAtaque = EResultadoDados.VITORIA;
                        } else if (inimigoI.exeRolagemTotalJogador < inimigoI.exeRolagemTotalInimigo) {
                            inimigoI.exeRolagemResultadoAtaque = EResultadoDados.DERROTA;
                        } else if (inimigoI.exeRolagemTotalJogador === inimigoI.exeRolagemTotalInimigo) {
                            inimigoI.exeRolagemResultadoAtaque = EResultadoDados.EMPATE;
                        }
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
            return;
        }
        //// Rolagem de ataque Concluído e com resultado
        _indiceIdInimigo = combateInimigos.findIndex(
            (inimigoI) => combateInimigos_ProcessoRolagemAtaque[inimigoI.exeIdInimigo] === EProcesso.CONCLUIDO && inimigoI.exeRolagemResultadoAtaque !== EResultadoDados._NULO
        );
        if (_indiceIdInimigo >= 0 && combateInimigos[_indiceIdInimigo]) {
            ImporCombateInimigos_ProcessoRolagemAtaque(_indiceIdInimigo, EProcesso.DESTRUIDO);
            if ((combateInimigos[_indiceIdInimigo].exeRolagemResultadoAtaque = EResultadoDados.VITORIA)) {
                AdicionarNoAudioEfeitosViaMomento(EAudioMomentoEfeitoSonoro.VITORIA_SOBRE_SERIE_ATAQUE);
                AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_ATAQUE_NO_INIMIGO(_indiceIdInimigo));
                ImporCombateInimigosExeSerieDeAtaqueVencidoConsecutivo(_indiceIdInimigo, false);
                ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(_indiceIdInimigo, EProcesso.INICIANDO);
            } else if ((combateInimigos[_indiceIdInimigo].exeRolagemResultadoAtaque = EResultadoDados.DERROTA)) {
                AdicionarNoAudioEfeitosViaMomento(EAudioMomentoEfeitoSonoro.DERROTA_SOBRE_SERIE_ATAQUE);
                AdicionarEmCombateAliadosEfeitosAplicados(EFEITO_ATAQUE_NO_JOGADOR());
                ImporCombateInimigosExeSerieDeAtaqueVencidoConsecutivo(_indiceIdInimigo, true);
                ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(_indiceIdInimigo, EProcesso.INICIANDO);
            } else if ((combateInimigos[_indiceIdInimigo].exeRolagemResultadoAtaque = EResultadoDados.EMPATE)) {
                ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(_indiceIdInimigo, EProcesso.DESTRUIDO);
            }
            return;
        }
        //// Rolagem de sorte e confirmação Concluído, mas sem resultado
        _indiceIdInimigo = combateInimigos.findIndex(
            (inimigoI) => combateInimigos_ProcessoRolagemSorteConfirmacao[inimigoI.exeIdInimigo] === EProcesso.CONCLUIDO && inimigoI.exeRolagemResultadoSorte === EResultadoDados._NULO
        );
        if (_indiceIdInimigo >= 0) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (_indiceIdInimigo === indiceI) {
                        if (jogoAtual.panilha.sorte <= inimigoI.exeRolagemTotalSorte) {
                            inimigoI.exeRolagemResultadoSorte = EResultadoDados.VITORIA;
                        } else if (jogoAtual.panilha.sorte > inimigoI.exeRolagemTotalSorte) {
                            inimigoI.exeRolagemResultadoSorte = EResultadoDados.DERROTA;
                        }
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
            return;
        }
        //// Rolagem de sorte e confirmação Concluído e com resultado
        _indiceIdInimigo = combateInimigos.findIndex(
            (inimigoI) => combateInimigos_ProcessoRolagemSorteConfirmacao[inimigoI.exeIdInimigo] === EProcesso.CONCLUIDO && inimigoI.exeRolagemResultadoSorte !== EResultadoDados._NULO
        );
        if (_indiceIdInimigo >= 0 && combateInimigos[_indiceIdInimigo]) {
            ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(_indiceIdInimigo, EProcesso.DESTRUIDO);
            if (combateInimigos[_indiceIdInimigo].exeRolagemResultadoSorte === EResultadoDados.VITORIA) {
                if (combateInimigos[_indiceIdInimigo].exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                    AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_SORTE_VITORIA_EM_ATAQUE_NO_INIMIGO(_indiceIdInimigo));
                } else if (combateInimigos[_indiceIdInimigo].exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                    AdicionarEmCombateAliadosEfeitosAplicados(EFEITO_SORTE_VITORIA_EM_DEFESA_DO_JOGADOR());
                }
            } else if (combateInimigos[_indiceIdInimigo].exeRolagemResultadoSorte === EResultadoDados.DERROTA) {
                if (combateInimigos[_indiceIdInimigo].exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                    AdicionarEmCombateInimigosEfeitosAplicados(EFEITO_SORTE_DERROTA_EM_ATAQUE_NO_INIMIGO(_indiceIdInimigo));
                } else if (combateInimigos[_indiceIdInimigo].exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                    AdicionarEmCombateAliadosEfeitosAplicados(EFEITO_SORTE_DERROTA_EM_DEFESA_DO_JOGADOR());
                }
            }
            AplicarPenalidadeDeTestarSorte();
            return;
        }
        //// Verificando fim da serie de ataque
        const _quantidadeInimigosAtacanteEApoio = combateInimigos.filter((inimigoI) =>
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(combateInimigos_PosturaInimigo[inimigoI.exeIdInimigo])
        ).length;
        if (_quantidadeInimigosAtacanteEApoio === 0) {
            setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
            return;
        }
        const _quantidadeInimigosAtacanteEApoioDestruidos = combateInimigos.filter(
            (inimigoI) =>
                [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(combateInimigos_PosturaInimigo[inimigoI.exeIdInimigo]) &&
                combateInimigos_ProcessoRolagemAtaque[inimigoI.exeIdInimigo] === EProcesso.DESTRUIDO &&
                combateInimigos_ProcessoRolagemSorteConfirmacao[inimigoI.exeIdInimigo] === EProcesso.DESTRUIDO
        ).length;
        if (_quantidadeInimigosAtacanteEApoio === _quantidadeInimigosAtacanteEApoioDestruidos) {
            setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
            return;
        }
    }, [combateProcessoSerieDeAtaque, combateInimigos, combateInimigos_ProcessoRolagemAtaque, combateInimigos_ProcessoRolagemSorteConfirmacao]);

    return {
        jogoAtual,
        combateInimigos,
        combateInimigos_PosturaInimigo,
        combateInimigos_ProcessoRolagemAtaque,
        combateAliado,
        combateTextosDerrota,
        combateSerieDeAtaqueAtual,
        combateDadosJogadorRef,
        combateDadosInimigoRef,
        combateDadosSorteRef,
        combateResultadoFinalDerrota,
        combateResultadoFinalInimigos,
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
        ObterElementoEfeitoEnergiaDoJogadorAliado,
        ObterElementoEfeitoEnergiaDoInimigo,
        MontarElementoCombateAprovacaoDerrota,
        ExibirSerieDeAtaqueVencidoConsecutivo,
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
        return (combateTextosDerrota && combateTextosDerrota.length) || combateAprovacaoDerrota;
    }

    function ImporCombateInimigosExecutorDoProcessoZeroDaSerieDeAtaque() {
        const _temAtacante = combateInimigos_PosturaInimigo.find((prevCombateInimigos_PosturaInimigo) => prevCombateInimigos_PosturaInimigo === EPosturaInimigo.ATACANTE);
        if (!_temAtacante) {
            let _indiceIdInimigo = -1;
            if (combateMultiplo_2osApoio) {
                _indiceIdInimigo = combateInimigos_PosturaInimigo.findIndex((posturaInimigoI) => posturaInimigoI === EPosturaInimigo.APOIO);
            } else {
                _indiceIdInimigo = combateInimigos_PosturaInimigo.findIndex((posturaInimigoI) => posturaInimigoI === EPosturaInimigo._AGUARDANDO);
            }
            if (_indiceIdInimigo >= 0) {
                ImporCombateInimigos_PosturaInimigo(_indiceIdInimigo, EPosturaInimigo.ATACANTE);
            }
            return;
        }
        combateInimigos_PosturaInimigo.forEach((posturaInimigoI, indiceI) => {
            if ([EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(posturaInimigoI)) {
                ImporCombateInimigos_ProcessoRolagemAtaque(indiceI, EProcesso.INICIANDO);
                ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(indiceI, EProcesso._ZERO);
            } else if ([EPosturaInimigo._AGUARDANDO].includes(posturaInimigoI)) {
                ImporCombateInimigos_ProcessoRolagemAtaque(indiceI, EProcesso._ZERO);
                ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(indiceI, EProcesso._ZERO);
            } else if ([EPosturaInimigo.MORTO].includes(posturaInimigoI)) {
                ImporCombateInimigos_ProcessoRolagemAtaque(indiceI, EProcesso.DESTRUIDO);
                ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(indiceI, EProcesso.DESTRUIDO);
            }
        });
        setCombateInimigos((prevCombateInimigo) => {
            prevCombateInimigo = prevCombateInimigo.map((inimigoI) => {
                inimigoI.exeRolagemResultadoAtaque = EResultadoDados._NULO;
                inimigoI.exeRolagemResultadoSorte = EResultadoDados._NULO;
                inimigoI.exeRolagemTotalJogador = 0;
                inimigoI.exeRolagemTotalInimigo = 0;
                inimigoI.exeRolagemTotalSorte = 0;
                return inimigoI;
            });
            return prevCombateInimigo;
        });
        if (_unicoSetCombateSerieDeAtaqueAtual) {
            _unicoSetCombateSerieDeAtaqueAtual = false;
            setCombateSerieDeAtaqueAtual((prevCombateSerieDeAtaqueAtual) => (prevCombateSerieDeAtaqueAtual += 1));
        }
        setCombateProcessoSerieDeAtaque(EProcesso.INICIANDO);
    }

    function AplicarEfeitoDerrota() {
        if (jogoAtual.panilha && jogoAtual.panilha.energia > 0) {
            AdicionarEmJogadorEfeitosAplicados(EFEITO_MORTE_NO_JOGADOR());
        }
    }

    function AprovarBotaoRolarCombate(inimigo: IInimigoExecucao) {
        return (
            combateProcessoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) &&
            combateInimigos_ProcessoRolagemAtaque[inimigo.exeIdInimigo] === EProcesso.INICIANDO
        );
    }

    function AprovarBotaoTestarSorte(inimigo: IInimigoExecucao) {
        return (
            combateProcessoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) &&
            combateInimigos_ProcessoRolagemSorteConfirmacao[inimigo.exeIdInimigo] === EProcesso.INICIANDO
        );
    }
    function AprovarBotaoConfirmar(inimigo: IInimigoExecucao) {
        return (
            combateProcessoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) &&
            combateInimigos_ProcessoRolagemSorteConfirmacao[inimigo.exeIdInimigo] === EProcesso.INICIANDO
        );
    }

    function AoRolarCombate(inimigo: IInimigoExecucao) {
        const _aoClicar = () => {
            AdicionarNoAudioEfeitosViaMomento(EAudioMomentoEfeitoSonoro.ROLANDO_DADOS);
            combateDadosJogadorRef[inimigo.exeIdInimigo]?.current?.rollAll();
            combateDadosInimigoRef[inimigo.exeIdInimigo]?.current?.rollAll();
            ImporCombateInimigos_ProcessoRolagemAtaque(inimigo.exeIdInimigo, EProcesso.PROCESSANDO);
            setTimeout(() => {
                ImporCombateInimigos_ProcessoRolagemAtaque(inimigo.exeIdInimigo, EProcesso.CONCLUIDO);
            }, TEMPO_DADOS_RESULTADO_MILESIMOS);
        };
        return _aoClicar;
    }

    function AoTestarSorte(inimigo: IInimigoExecucao) {
        const _aoClicar = () => {
            AdicionarNoAudioEfeitosViaMomento(EAudioMomentoEfeitoSonoro.ROLANDO_DADOS);
            combateDadosSorteRef[inimigo.exeIdInimigo]?.current?.rollAll();
            ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(inimigo.exeIdInimigo, EProcesso.PROCESSANDO);
            setTimeout(() => {
                ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(inimigo.exeIdInimigo, EProcesso.CONCLUIDO);
            }, TEMPO_DADOS_RESULTADO_MILESIMOS);
        };
        return _aoClicar;
    }

    function AoConfirmar(inimigo: IInimigoExecucao) {
        const _aoClicar = () => {
            ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(inimigo.exeIdInimigo, EProcesso.DESTRUIDO);
        };
        return _aoClicar;
    }

    function AoConcluirRolarCombateJogador(inimigo: IInimigoExecucao) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            //if (inimigo.exeRolagemTotalJogador !== totalValue + ObterJogadorOuAliado().habilidade) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI) => {
                    if (inimigo.exeIdInimigo === inimigoI.exeIdInimigo) {
                        inimigoI.exeRolagemTotalJogador = totalValue + ObterJogadorOuAliado().habilidade;
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
            //}
        };
        return _aoConcluir;
    }

    function AoConcluirRolarCombateInimigo(inimigo: IInimigoExecucao) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            //if (inimigo.exeRolagemTotalInimigo !== totalValue + inimigo.habilidade) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI) => {
                    if (inimigo.exeIdInimigo === inimigoI.exeIdInimigo) {
                        inimigoI.exeRolagemTotalInimigo = totalValue + inimigoI.habilidade;
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
            //}
        };
        return _aoConcluir;
    }

    function AoConcluirTestarSorte(inimigo: IInimigoExecucao) {
        const _aoConcluir = (totalValue: number, values: number[]) => {
            //if (inimigo.exeRolagemTotalSorte !== totalValue) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI) => {
                    if (inimigo.exeIdInimigo === inimigoI.exeIdInimigo && totalValue > 0) {
                        inimigoI.exeRolagemTotalSorte = totalValue;
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
            //}
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

    function ObterElementoEfeitoEnergiaDoJogadorAliado() {
        return MontarElementosDosEfeitosPorQuantidade(ObterCombateAliadoEfeitosAplicadosDoAtributo(EAtributo.ENERGIA));
    }

    function ObterElementoEfeitoEnergiaDoInimigo(inimigo: IInimigoExecucao) {
        return MontarElementosDosEfeitosPorQuantidade(ObterCombateInimigosEfeitosAplicados(inimigo.exeIdInimigo, EAtributo.ENERGIA));
    }

    function MontarElementosDosEfeitosPorQuantidade(efeitos: IEfeito[]) {
        if (efeitos && efeitos.length) {
            return efeitos.map((efeitoI, indiceI) => (
                <span
                    key={indiceI}
                    className={MontarEstilo(efeitoI)}
                >
                    {FormatarNumberInteiro(efeitoI.quantidade)}
                </span>
            ));
        } else {
            return <></>;
        }
    }

    function MontarEstilo(efeito: IEfeito) {
        let _estilo = styles.combate_efeito;
        if (efeito) {
            _estilo += " " + styles.combate_efeito_popup;
            if (efeito.quantidade >= 1) {
                _estilo += " " + styles.combate_efeito_bom;
            } else {
                _estilo += " " + styles.combate_efeito_ruim;
            }
        }
        return _estilo;
    }

    function ExibirSerieDeAtaqueVencidoConsecutivo(inimigo: IInimigoExecucao) {
        return (
            AprovarExibicaoDeSerieDeAtaqueVencidoConsecutivo() &&
            combateProcessoSerieDeAtaque === EProcesso.PROCESSANDO &&
            [EPosturaInimigo.ATACANTE, EPosturaInimigo.APOIO].includes(combateInimigos_PosturaInimigo[inimigo.exeIdInimigo])
        );
    }
};

export default ControleCombate;
