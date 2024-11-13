import { useContext, useEffect } from "react";
import {
    IEfeito,
    IEfeitoExecucao,
    EAtributo,
    PAGINA_ZERADA,
    ECampanhaCapitulo,
    EPaginaExecutorEstado,
    EResultadoCombate,
    IHistoriaTextoExecucao,
    IHistoriaEfeitoExecucao,
    IInimigoExecucao,
    EPosturaInimigo,
    IDestinoExecucao,
    IPagina,
    EResultadoDados,
    IEfeitoInimigoExecucao,
} from "../tipos";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO_NORMAL, TEMPO_ANIMACAO_PEQUENO } from "../globais/Constantes";
import { ContextoBasePagina, ContextoJogos, ContextoLivro } from ".";

export const ContextoPagina = () => {
    const {
        pagina,
        setPagina,
        paginaEstado,
        setPaginaEstado,
        paginaEhJogoCarregado,
        setPaginaEhJogoCarregado,
        paginaIdPaginaDestino,
        setPaginaIdPaginaDestino,
        paginaIdCapituloDestino,
        setPaginaIdCapituloDestino,
        historiaTextos,
        setHistoriaTextos,
        historiaEfeitos,
        setHistoriaEfeitos,
        historiaImagens,
        setHistoriaImagens,
        historiaProcesso,
        setHistoriaProcesso,
        historiaIndice,
        setHistoriaIndice,
        historiaProcessoIndice,
        setHistoriaProcessoIndice,
        combateInimigos,
        setCombateInimigos,
        combateInimigosEfeitosAplicados,
        setCombateInimigosEfeitosAplicados,
        combateAliado,
        setCombateAliado,
        combateAliadoEfeitosAplicados,
        setCombateAliadoEfeitosAplicados,
        combateTextosDerrota,
        setCombateTextosDerrota,
        combateAprovacaoDerrota,
        setCombateAprovacaoDerrota,
        combateMultiplo_2osApoio,
        setCombateMultiplo_2osApoio,
        combateProcesso,
        setCombateProcesso,
        combateSerieDeAtaqueAtual,
        setCombateSerieDeAtaqueAtual,
        combateProcessoSerieDeAtaque,
        setCombateProcessoSerieDeAtaque,
        combateResultadoSerieDeAtaque,
        setCombateResultadoSerieDeAtaque,
        combateResultadoFinal,
        setCombateResultadoFinal,
        combateIdPaginaDestinoDerrota,
        setCombateIdPaginaDestinoDerrota,
        combateDadosJogadorRef,
        combateDadosInimigoRef,
        combateDadosSorteRef,
        destinoItens,
        setDestinoItens,
        destinoProcesso,
        setDestinoProcesso,
        destinoProcessoRolagem,
        setDestinoProcessoRolagem,
        destinoRolagemTotal,
        setDestinoRolagemTotal,
        destinoRolagemDestino,
        setDestinoRolagemDestino,
        destinoDadosRef,
        setDestinoDadosRef,
    } = useContext(ContextoBasePagina);

    const { livro, ObterPagina } = ContextoLivro();

    const { jogoAtual, padraoCapitulo, AdicionarEmJogadorEfeitosAplicados } = ContextoJogos();

    useEffect(() => {
        if (!livro || !jogoAtual) {
            ResetarContextoPagina();
            return;
        }
        const _pagina = ObterPagina(jogoAtual);
        if (_pagina.idPagina === PAGINA_ZERADA.idPagina || _pagina.idCapitulo === PAGINA_ZERADA.idCapitulo) {
            ResetarContextoPagina();
            return;
        }
        if (pagina && pagina.idPagina === _pagina.idPagina && pagina.idCapitulo === _pagina.idCapitulo) {
            return;
        }
        ImporContextoPagina(_pagina);
        IrParaOTopoDaPaginaViaScroll();
    }, [livro, jogoAtual, pagina]);

    useEffect(() => {
        if (!livro || !jogoAtual || !jogoAtual.panilha || !pagina) {
            return;
        }
        if (paginaEstado === EPaginaExecutorEstado._NULO) {
            setHistoriaProcesso(EProcesso._ZERO);
            setCombateProcesso(EProcesso._ZERO);
            setDestinoProcesso(EProcesso._ZERO);
            setPaginaEstado(EPaginaExecutorEstado.INICIALIZADO);
        } else if (paginaEstado === EPaginaExecutorEstado.INICIALIZADO) {
            setPaginaEstado(EPaginaExecutorEstado.HISTORIAS);
        }
    }, [pagina, paginaEstado]);

    useEffect(() => {
        if (
            combateInimigos &&
            combateInimigos.length &&
            combateInimigosEfeitosAplicados &&
            combateInimigosEfeitosAplicados.length &&
            combateInimigosEfeitosAplicados.find((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.PROCESSANDO)
        ) {
            setCombateInimigosEfeitosAplicados((prevCombateInimigosEfeitosAplicados) => {
                prevCombateInimigosEfeitosAplicados = prevCombateInimigosEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (efeitoI.exeProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.exeProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.INICIANDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            ImporCombateInimigosEfeitosAplicadosExeProcessoEfeito(indiceI, EProcesso.CONCLUIDO);
                            AplicarEfeitoDoCombateInimigosEfeitosAplicadosExeProcessoEfeitoProcessando(efeitoI);
                        }, TEMPO_ANIMACAO_NORMAL);
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.CONCLUIDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.DESTRUIDO;
                    }
                    return efeitoI;
                });
                prevCombateInimigosEfeitosAplicados = prevCombateInimigosEfeitosAplicados.filter((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.DESTRUIDO);
                return [...prevCombateInimigosEfeitosAplicados];
            });
        }
    }, [combateInimigosEfeitosAplicados]);

    useEffect(() => {
        if (
            combateAliado &&
            combateAliadoEfeitosAplicados &&
            combateAliadoEfeitosAplicados.length &&
            combateAliadoEfeitosAplicados.find((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.PROCESSANDO)
        ) {
            setCombateAliadoEfeitosAplicados((prevCombateAliadoEfeitosAplicados) => {
                prevCombateAliadoEfeitosAplicados = prevCombateAliadoEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (efeitoI.exeProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.exeProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.INICIANDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            ImporCombateAliadoEfeitosAplicadosExeProcessoEfeito(indiceI, EProcesso.CONCLUIDO);
                            AplicarEfeitoDoCombateAliadoEfeitosAplicadosExeProcessoEfeitoProcessando(efeitoI);
                        }, TEMPO_ANIMACAO_NORMAL);
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.CONCLUIDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.DESTRUIDO;
                    }
                    return efeitoI;
                });
                prevCombateAliadoEfeitosAplicados = prevCombateAliadoEfeitosAplicados.filter((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.DESTRUIDO);
                return [...prevCombateAliadoEfeitosAplicados];
            });
        }
    }, [combateAliadoEfeitosAplicados]);

    return {
        pagina,
        setPagina,
        paginaEstado,
        setPaginaEstado,
        paginaEhJogoCarregado,
        setPaginaEhJogoCarregado,
        paginaIdPaginaDestino,
        setPaginaIdPaginaDestino,
        paginaIdCapituloDestino,
        setPaginaIdCapituloDestino,
        historiaTextos,
        setHistoriaTextos,
        historiaEfeitos,
        setHistoriaEfeitos,
        historiaImagens,
        setHistoriaImagens,
        historiaProcesso,
        setHistoriaProcesso,
        historiaIndice,
        setHistoriaIndice,
        historiaProcessoIndice,
        setHistoriaProcessoIndice,
        combateInimigos,
        setCombateInimigos,
        combateInimigosEfeitosAplicados,
        setCombateInimigosEfeitosAplicados,
        combateAliado,
        setCombateAliado,
        combateAliadoEfeitosAplicados,
        setCombateAliadoEfeitosAplicados,
        combateTextosDerrota,
        setCombateTextosDerrota,
        combateAprovacaoDerrota,
        setCombateAprovacaoDerrota,
        combateMultiplo_2osApoio,
        setCombateMultiplo_2osApoio,
        combateProcesso,
        setCombateProcesso,
        combateSerieDeAtaqueAtual,
        setCombateSerieDeAtaqueAtual,
        combateProcessoSerieDeAtaque,
        setCombateProcessoSerieDeAtaque,
        combateResultadoSerieDeAtaque,
        setCombateResultadoSerieDeAtaque,
        combateResultadoFinal,
        setCombateResultadoFinal,
        combateIdPaginaDestinoDerrota,
        setCombateIdPaginaDestinoDerrota,
        combateDadosJogadorRef,
        combateDadosInimigoRef,
        combateDadosSorteRef,
        destinoItens,
        setDestinoItens,
        destinoProcesso,
        setDestinoProcesso,
        destinoProcessoRolagem,
        setDestinoProcessoRolagem,
        destinoRolagemTotal,
        setDestinoRolagemTotal,
        destinoRolagemDestino,
        setDestinoRolagemDestino,
        destinoDadosRef,
        ResetarContextoPagina,
        ImporPaginaExecutorViaDestino,
        AtualizarCombateExecutorNoProcessoInicial,
        ImporHistoriaTextosExeProcessoTexto,
        ImporHistoriaEfeitosExeProcessoEfeito,
        ObterCombateInimigosEfeitosAplicados,
        AdicionarEmCombateInimigosEfeitosAplicados,
        ObterCombateAliadoEfeitosAplicados,
        AdicionarEmCombateAliadosEfeitosAplicados,
        ImporCombateInimigosExeProcessoRolagem,
        ImporCombateInimigosExeProcessoSorteConfirmacao,
        ImporCombateInimigosExeRolagemResultadoAtaque,
        ImporCombateInimigosExeRolagemResultadoSorte,
    };

    function ResetarContextoPagina() {
        setPagina(null!);
        setPaginaEhJogoCarregado(false);
        setPaginaIdPaginaDestino(PAGINA_ZERADA.idPagina);
        setPaginaIdCapituloDestino(PAGINA_ZERADA.idCapitulo);
        setPaginaEstado(EPaginaExecutorEstado._NULO);
        setHistoriaTextos([]);
        setHistoriaEfeitos([]);
        setHistoriaImagens([]);
        setHistoriaProcesso(EProcesso._ZERO);
        setHistoriaProcessoIndice(EProcesso._ZERO);
        setHistoriaIndice(0);
        setCombateInimigos([]);
        setCombateInimigosEfeitosAplicados([]);
        setCombateAliado(null!);
        setCombateAliadoEfeitosAplicados([]);
        setCombateTextosDerrota([]);
        setCombateAprovacaoDerrota("");
        setCombateMultiplo_2osApoio(false);
        setCombateProcesso(EProcesso._ZERO);
        setCombateSerieDeAtaqueAtual(0);
        setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
        setCombateResultadoSerieDeAtaque(EResultadoCombate._COMBATENDO);
        setCombateResultadoFinal(EResultadoCombate._COMBATENDO);
        setCombateIdPaginaDestinoDerrota(PAGINA_ZERADA.idPagina);
        setDestinoItens([]);
        setDestinoProcesso(EProcesso._ZERO);
        setDestinoProcessoRolagem(EProcesso._ZERO);
        setDestinoRolagemTotal(0);
        setDestinoRolagemDestino(null!);
    }

    function ImporPaginaExecutorViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        setPaginaIdPaginaDestino(idPaginaDestino);
        setPaginaIdCapituloDestino(idCapituloDestino);
        setPaginaEhJogoCarregado(false);
    }

    function ImporContextoPagina(novaPagina: IPagina) {
        const _ehJogoCarregado = !!(!pagina && jogoAtual.panilha);
        setPagina(novaPagina);
        setPaginaEhJogoCarregado(_ehJogoCarregado);
        setPaginaIdPaginaDestino(PAGINA_ZERADA.idPagina);
        setPaginaIdCapituloDestino(PAGINA_ZERADA.idCapitulo);
        setPaginaEstado(EPaginaExecutorEstado._NULO);
        setHistoriaTextos([]);
        setHistoriaEfeitos([]);
        setHistoriaImagens([]);
        if (novaPagina.historias && novaPagina.historias.length) {
            setHistoriaTextos(
                novaPagina.historias.map<IHistoriaTextoExecucao>((historiaI) => ({
                    textosHistoria: historiaI.textosHistoria,
                    exeProcessoTexto: EProcesso._ZERO,
                }))
            );
            setHistoriaEfeitos(
                novaPagina.historias.map<IHistoriaEfeitoExecucao>((historiaI) => ({
                    efeitos: historiaI.efeitos?.map<IEfeitoExecucao>((efeitoI2) => ({
                        ...efeitoI2,
                        exeProcessoEfeito: EProcesso._ZERO,
                        exeIdEfeito: Math.ceil(Math.random() * 1000),
                    })),
                    exeProcessoEfeito: EProcesso._ZERO,
                }))
            );
            setHistoriaImagens(novaPagina.historias.map<string>((historiaI) => historiaI.imagem));
        }
        setHistoriaProcesso(EProcesso._ZERO);
        setHistoriaProcessoIndice(EProcesso._ZERO);
        setHistoriaIndice(0);
        setCombateInimigos([]);
        setCombateInimigosEfeitosAplicados([]);
        setCombateAliado(null!);
        setCombateAliadoEfeitosAplicados([]);
        setCombateTextosDerrota([]);
        setCombateAprovacaoDerrota("");
        setCombateMultiplo_2osApoio(false);
        if (novaPagina.combate) {
            if (novaPagina.combate.inimigos && novaPagina.combate.inimigos.length) {
                setCombateInimigos(
                    novaPagina.combate.inimigos.map<IInimigoExecucao>((inimigoI) => ({
                        ...inimigoI,
                        exeEnergiaAtual: inimigoI.energia,
                        exePosturaInimigo: EPosturaInimigo._AGUARDANDO,
                        exeSerieDeAtaqueVencidoConsecutivo: 0,
                        exeProcessoRolagemAtaque: EProcesso._ZERO,
                        exeProcessoRolagemSorteConfirmacao: EProcesso._ZERO,
                        exeRolagemTotalJogador: 0,
                        exeRolagemTotalInimigo: 0,
                        exeRolagemTotalSorte: 0,
                        exeRolagemResultadoAtaque: EResultadoDados._NULO,
                        exeRolagemResultadoSorte: EResultadoDados._NULO,
                    }))
                );
            }
            if (novaPagina.combate.aliado) {
                setCombateAliado({
                    ...novaPagina.combate.aliado,
                    exeEnergiaAtual: novaPagina.combate.aliado.energia,
                    exeEhAliado: true,
                    exeEstaVivo: true,
                });
            }
            if (novaPagina.combate.textosDerrota && novaPagina.combate.textosDerrota.length) {
                setCombateTextosDerrota(novaPagina.combate.textosDerrota);
            }
            if (novaPagina.combate.aprovacaoDerrota) {
                setCombateAprovacaoDerrota(novaPagina.combate.aprovacaoDerrota);
            }
            if (novaPagina.combate.combateMultiplo_2osApoio) {
                setCombateMultiplo_2osApoio(novaPagina.combate.combateMultiplo_2osApoio);
            }
        }
        setCombateProcesso(EProcesso._ZERO);
        setCombateSerieDeAtaqueAtual(0);
        setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
        setCombateResultadoSerieDeAtaque(EResultadoCombate._COMBATENDO);
        setCombateResultadoFinal(EResultadoCombate._COMBATENDO);
        setCombateIdPaginaDestinoDerrota(PAGINA_ZERADA.idPagina);
        setDestinoItens([]);
        if (novaPagina.destinos && novaPagina.destinos.length) {
            setDestinoItens(
                novaPagina.destinos.map<IDestinoExecucao>((destinoI) => ({
                    ...destinoI,
                    exeProcessoEfeito: EProcesso._ZERO,
                    idCapitulo: destinoI.idCapitulo && destinoI.idCapitulo !== ECampanhaCapitulo._NULO ? destinoI.idCapitulo : padraoCapitulo,
                }))
            );
        }
        setDestinoProcesso(EProcesso._ZERO);
        setDestinoProcessoRolagem(EProcesso._ZERO);
        setDestinoRolagemTotal(0);
        setDestinoRolagemDestino(null!);
    }

    function AtualizarCombateExecutorNoProcessoInicial() {
        if (!combateInimigos || !combateInimigos.length) {
            setCombateProcesso(EProcesso.CONCLUIDO);
            return;
        }
        if (paginaEhJogoCarregado) {
            setCombateInimigos((prevCombateInimigos) =>
                prevCombateInimigos.map((inimigoI) => {
                    inimigoI.exePosturaInimigo = EPosturaInimigo.MORTO;
                    inimigoI.exeEnergiaAtual = 0;
                    return inimigoI;
                })
            );
            setCombateProcesso(EProcesso.CONCLUIDO);
            return;
        }
        setCombateProcesso(EProcesso.INICIANDO);
        setCombateInimigos((prevCombateInimigos) =>
            prevCombateInimigos.map((inimigoI, indiceI) => {
                inimigoI.exeRolagemResultadoAtaque = EResultadoDados._NULO;
                inimigoI.exeRolagemResultadoSorte = EResultadoDados._NULO;
                inimigoI.exePosturaInimigo = EPosturaInimigo._AGUARDANDO;
                if (indiceI === 0) {
                    inimigoI.exePosturaInimigo = EPosturaInimigo.ATACANTE;
                } else if (combateMultiplo_2osApoio) {
                    inimigoI.exePosturaInimigo = EPosturaInimigo.APOIO;
                }
                return inimigoI;
            })
        );
    }

    function ObterCombateInimigosEfeitosAplicados(atributo: EAtributo): IEfeito {
        if (!combateInimigosEfeitosAplicados || !combateInimigosEfeitosAplicados.length) {
            return null!;
        }
        return combateInimigosEfeitosAplicados.find(
            (efeitoI) => efeitoI.atributoEfeito === atributo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.exeProcessoEfeito)
        )!;
    }

    function AdicionarEmCombateInimigosEfeitosAplicados(efeitos: IEfeitoInimigoExecucao[]) {
        setInterval(() => {
            setCombateInimigosEfeitosAplicados((prevCombateInimigosEfeitosAplicados) => {
                efeitos.forEach((efeitoI) => {
                    if (!prevCombateInimigosEfeitosAplicados.some((efeitoI2) => efeitoI2.exeIdEfeito === efeitoI.exeIdEfeito)) {
                        prevCombateInimigosEfeitosAplicados.push(efeitoI);
                    }
                });
                return [...prevCombateInimigosEfeitosAplicados];
            });
        }, TEMPO_ANIMACAO_PEQUENO);
    }

    function ImporCombateInimigosEfeitosAplicadosExeProcessoEfeito(indice: number, processo: EProcesso) {
        if (combateInimigosEfeitosAplicados && combateInimigosEfeitosAplicados[indice] && combateInimigosEfeitosAplicados[indice].exeProcessoEfeito !== processo) {
            setCombateInimigosEfeitosAplicados((prevCombateInimigosEfeitosAplicados) => {
                prevCombateInimigosEfeitosAplicados = prevCombateInimigosEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (indice === indiceI) {
                        efeitoI.exeProcessoEfeito = processo;
                    }
                    return efeitoI;
                });
                return [...prevCombateInimigosEfeitosAplicados];
            });
        }
    }

    function AplicarEfeitoDoCombateInimigosEfeitosAplicadosExeProcessoEfeitoProcessando(efeito: IEfeitoInimigoExecucao) {
        if (!efeito || efeito.exeProcessoEfeito !== EProcesso.PROCESSANDO || efeito.atributoEfeito !== EAtributo.ENERGIA || !combateInimigos || !combateInimigos[efeito.exeIdInimigo]) {
            return;
        }
        setCombateInimigos((prevCombateInimigo) => {
            prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                if (efeito.exeIdInimigo === indiceI) {
                    inimigoI.exeEnergiaAtual += efeito.quantidade;
                    inimigoI.exeEnergiaAtual = Math.max(inimigoI.exeEnergiaAtual, 0);
                    inimigoI.exeEnergiaAtual = Math.min(inimigoI.exeEnergiaAtual, inimigoI.energia);
                    if (inimigoI.exeEnergiaAtual === 0) {
                        inimigoI.exePosturaInimigo = EPosturaInimigo.MORTO;
                        inimigoI.exeProcessoRolagemSorteConfirmacao = EProcesso.CONCLUIDO;
                        setCombateProcessoSerieDeAtaque(EProcesso.DESTRUIDO);
                    }
                }
                return { ...inimigoI };
            });
            return [...prevCombateInimigo];
        });
    }

    function ObterCombateAliadoEfeitosAplicados(atributo: EAtributo): IEfeito {
        if (!combateAliadoEfeitosAplicados || !combateAliadoEfeitosAplicados.length) {
            return null!;
        }
        return combateAliadoEfeitosAplicados.find(
            (efeitoI) => efeitoI.atributoEfeito === atributo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.exeProcessoEfeito)
        )!;
    }

    function AdicionarEmCombateAliadosEfeitosAplicados(efeitos: IEfeitoExecucao[]) {
        setInterval(() => {
            if (!combateAliado) {
                AdicionarEmJogadorEfeitosAplicados(efeitos);
            } else {
                setCombateAliadoEfeitosAplicados((prevCombateAliadoEfeitosAplicados) => {
                    efeitos.forEach((efeitoI) => {
                        if (!prevCombateAliadoEfeitosAplicados.some((efeitoI2) => efeitoI2.exeIdEfeito === efeitoI.exeIdEfeito)) {
                            prevCombateAliadoEfeitosAplicados.push(efeitoI);
                        }
                    });
                    return [...prevCombateAliadoEfeitosAplicados];
                });
            }
        }, TEMPO_ANIMACAO_PEQUENO);
    }

    function ImporCombateAliadoEfeitosAplicadosExeProcessoEfeito(indice: number, processo: EProcesso) {
        if (combateAliadoEfeitosAplicados && combateAliadoEfeitosAplicados[indice] && combateAliadoEfeitosAplicados[indice].exeProcessoEfeito !== processo) {
            setCombateAliadoEfeitosAplicados((prevCombateAliadoEfeitosAplicados) => {
                prevCombateAliadoEfeitosAplicados = prevCombateAliadoEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (indice === indiceI) {
                        efeitoI.exeProcessoEfeito = processo;
                    }
                    return efeitoI;
                });
                return [...prevCombateAliadoEfeitosAplicados];
            });
        }
    }

    function AplicarEfeitoDoCombateAliadoEfeitosAplicadosExeProcessoEfeitoProcessando(efeito: IEfeitoExecucao) {
        if (!efeito || efeito.exeProcessoEfeito !== EProcesso.PROCESSANDO || efeito.atributoEfeito !== EAtributo.ENERGIA || !combateAliado) {
            return;
        }
        setCombateAliado((prevCombateAliado) => {
            prevCombateAliado.exeEnergiaAtual += efeito.quantidade;
            prevCombateAliado.exeEnergiaAtual = Math.max(prevCombateAliado.exeEnergiaAtual, 0);
            prevCombateAliado.exeEnergiaAtual = Math.min(prevCombateAliado.exeEnergiaAtual, prevCombateAliado.energia);
            prevCombateAliado.exeEstaVivo = prevCombateAliado.exeEnergiaAtual >= 1;
            return { ...prevCombateAliado };
        });
    }

    function ImporHistoriaTextosExeProcessoTexto(indice: number, processo: EProcesso) {
        if (historiaTextos && historiaTextos[indice] && historiaTextos[indice].exeProcessoTexto !== processo) {
            setHistoriaTextos((prevHistoriaTextos) => {
                prevHistoriaTextos = prevHistoriaTextos.map((historiaI, indiceI) => {
                    if (indice === indiceI) {
                        historiaI.exeProcessoTexto = processo;
                    }
                    return historiaI;
                });
                return [...prevHistoriaTextos];
            });
        }
    }

    function ImporHistoriaEfeitosExeProcessoEfeito(indice: number, processo: EProcesso) {
        if (historiaEfeitos && historiaEfeitos[indice] && historiaEfeitos[indice].exeProcessoEfeito !== processo) {
            setHistoriaEfeitos((prevHistoriaEfeitos) => {
                prevHistoriaEfeitos = prevHistoriaEfeitos.map((historiaI, indiceI) => {
                    if (indice === indiceI) {
                        historiaI.exeProcessoEfeito = processo;
                    }
                    return historiaI;
                });
                return [...prevHistoriaEfeitos];
            });
        }
    }

    function ImporCombateInimigosExeProcessoRolagem(indice: number, processo: EProcesso) {
        if (combateInimigos && combateInimigos[indice] && combateInimigos[indice].exeProcessoRolagemAtaque !== processo) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (indice === indiceI) {
                        inimigoI.exeProcessoRolagemAtaque = processo;
                    }
                    return { ...inimigoI };
                });
                return [...prevCombateInimigo];
            });
        }
    }

    function ImporCombateInimigosExeProcessoSorteConfirmacao(indice: number, processo: EProcesso) {
        if (combateInimigos && combateInimigos[indice] && combateInimigos[indice].exeProcessoRolagemSorteConfirmacao !== processo) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (indice === indiceI) {
                        inimigoI.exeProcessoRolagemSorteConfirmacao = processo;
                    }
                    return { ...inimigoI };
                });
                return [...prevCombateInimigo];
            });
        }
    }

    function ImporCombateInimigosExeRolagemResultadoAtaque(indice: number, resultado: EResultadoDados) {
        if (combateInimigos && combateInimigos[indice] && combateInimigos[indice].exeRolagemResultadoAtaque !== resultado) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (indice === indiceI) {
                        inimigoI.exeRolagemResultadoAtaque = resultado;
                    }
                    return { ...inimigoI };
                });
                return [...prevCombateInimigo];
            });
        }
        return resultado;
    }

    function ImporCombateInimigosExeRolagemResultadoSorte(indice: number, resultado: EResultadoDados) {
        if (combateInimigos && combateInimigos[indice] && combateInimigos[indice].exeRolagemResultadoSorte !== resultado) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (indice === indiceI) {
                        inimigoI.exeRolagemResultadoSorte = resultado;
                    }
                    return { ...inimigoI };
                });
                return [...prevCombateInimigo];
            });
        }
        return resultado;
    }

    function IrParaOTopoDaPaginaViaScroll() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};

export default ContextoPagina;
