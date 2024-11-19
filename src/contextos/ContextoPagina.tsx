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
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";
import { ContextoBasePagina, ContextoJogos, ContextoLivro } from ".";

export const ContextoPagina = () => {
    const { livro, ObterPagina } = ContextoLivro();

    const { jogoAtual, padraoCapitulo, AdicionarEmJogadorEfeitosAplicados, ObterJogadorEfeitosAplicadosDoAtributo } = ContextoJogos();

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
        combateInimigos_PosturaInimigo,
        setCombateInimigos_PosturaInimigo,
        combateInimigos_ProcessoRolagemAtaque,
        setCombateInimigos_ProcessoRolagemAtaque,
        combateInimigos_ProcessoRolagemSorteConfirmacao,
        setCombateInimigos_ProcessoRolagemSorteConfirmacao,
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
        combateResultadoFinalDerrota,
        setCombateResultadoFinalDerrota,
        combateResultadoFinalInimigos,
        setCombateResultadoFinalInimigos,
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
    } = useContext(ContextoBasePagina);

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
                        AplicarEfeitoDoCombateInimigosEfeitosAplicadosExeProcessoEfeitoIniciando(efeitoI);
                        efeitoI.exeProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            ImporCombateInimigosEfeitosAplicadosExeProcessoEfeito(indiceI, EProcesso.CONCLUIDO);
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
                        AplicarEfeitoDoCombateAliadoEfeitosAplicadosExeProcessoEfeitoIniciando(efeitoI);
                        efeitoI.exeProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            ImporCombateAliadoEfeitosAplicadosExeProcessoEfeito(indiceI, EProcesso.CONCLUIDO);
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
        combateInimigos_PosturaInimigo,
        setCombateInimigos_PosturaInimigo,
        combateInimigos_ProcessoRolagemAtaque,
        setCombateInimigos_ProcessoRolagemAtaque,
        combateInimigos_ProcessoRolagemSorteConfirmacao,
        setCombateInimigos_ProcessoRolagemSorteConfirmacao,
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
        combateResultadoFinalDerrota,
        setCombateResultadoFinalDerrota,
        combateResultadoFinalInimigos,
        setCombateResultadoFinalInimigos,
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
        ImporCombateInimigos_PosturaInimigo,
        ObterCombateInimigosEfeitosAplicados,
        AdicionarEmCombateInimigosEfeitosAplicados,
        ObterCombateAliadoEfeitosAplicadosDoAtributo,
        AdicionarEmCombateAliadosEfeitosAplicados,
        ImporCombateInimigos_ProcessoRolagemAtaque,
        ImporCombateInimigos_ProcessoRolagemSorteConfirmacao,
        ImporCombateInimigosExeRolagemResultadoAtaque,
        ImporCombateInimigosExeRolagemResultadoSorte,
        ImporCombateInimigosExeSerieDeAtaqueVencidoConsecutivo,
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
        setCombateInimigos_PosturaInimigo([]);
        setCombateInimigos_ProcessoRolagemAtaque([]);
        setCombateInimigos_ProcessoRolagemSorteConfirmacao([]);
        setCombateInimigosEfeitosAplicados([]);
        setCombateAliado(null!);
        setCombateAliadoEfeitosAplicados([]);
        setCombateTextosDerrota([]);
        setCombateAprovacaoDerrota("");
        setCombateMultiplo_2osApoio(false);
        setCombateResultadoFinalDerrota(EResultadoCombate._NULO);
        setCombateResultadoFinalInimigos(EResultadoCombate._NULO);
        setCombateProcesso(EProcesso._ZERO);
        setCombateSerieDeAtaqueAtual(0);
        setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
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
        setCombateInimigos_PosturaInimigo([]);
        setCombateInimigos_ProcessoRolagemAtaque([]);
        setCombateInimigos_ProcessoRolagemSorteConfirmacao([]);
        setCombateInimigosEfeitosAplicados([]);
        setCombateAliado(null!);
        setCombateAliadoEfeitosAplicados([]);
        setCombateTextosDerrota([]);
        setCombateAprovacaoDerrota("");
        setCombateMultiplo_2osApoio(false);
        setCombateResultadoFinalDerrota(EResultadoCombate._NULO);
        setCombateResultadoFinalInimigos(EResultadoCombate._NULO);
        if (novaPagina.combate) {
            if (novaPagina.combate.inimigos && novaPagina.combate.inimigos.length) {
                setCombateInimigos(
                    novaPagina.combate.inimigos.map<IInimigoExecucao>((inimigoI, indiceI) => ({
                        ...inimigoI,
                        exeIdInimigo: indiceI,
                        exeEnergiaAtual: inimigoI.energia,
                        exeSerieDeAtaqueVencidoConsecutivo: 0,
                        exeRolagemTotalJogador: 0,
                        exeRolagemTotalInimigo: 0,
                        exeRolagemTotalSorte: 0,
                        exeRolagemResultadoAtaque: EResultadoDados._NULO,
                        exeRolagemResultadoSorte: EResultadoDados._NULO,
                    }))
                );
                setCombateInimigos_PosturaInimigo(Array(novaPagina.combate.inimigos.length).fill(EPosturaInimigo._AGUARDANDO));
                setCombateInimigos_ProcessoRolagemAtaque(Array(novaPagina.combate.inimigos.length).fill(EProcesso._ZERO));
                setCombateInimigos_ProcessoRolagemSorteConfirmacao(Array(novaPagina.combate.inimigos.length).fill(EProcesso._ZERO));
                setCombateResultadoFinalInimigos(EResultadoCombate.COMBATENDO);
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
                setCombateResultadoFinalDerrota(EResultadoCombate.COMBATENDO);
            }
            if (novaPagina.combate.aprovacaoDerrota) {
                setCombateAprovacaoDerrota(novaPagina.combate.aprovacaoDerrota);
                setCombateResultadoFinalDerrota(EResultadoCombate.COMBATENDO);
            }
            if (novaPagina.combate.combateMultiplo_2osApoio) {
                setCombateMultiplo_2osApoio(novaPagina.combate.combateMultiplo_2osApoio);
            }
        }
        setCombateProcesso(EProcesso._ZERO);
        setCombateSerieDeAtaqueAtual(0);
        setCombateProcessoSerieDeAtaque(EProcesso._ZERO);
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
                    inimigoI.exeEnergiaAtual = 0;
                    return inimigoI;
                })
            );
            setCombateInimigos_PosturaInimigo(Array(combateInimigos.length).fill(EPosturaInimigo.MORTO));
            setCombateInimigos_ProcessoRolagemAtaque(Array(combateInimigos.length).fill(EProcesso.DESTRUIDO));
            setCombateInimigos_ProcessoRolagemSorteConfirmacao(Array(combateInimigos.length).fill(EProcesso.DESTRUIDO));
            setCombateResultadoFinalDerrota(EResultadoCombate.VITORIA);
            setCombateResultadoFinalInimigos(EResultadoCombate.VITORIA);
            setCombateProcesso(EProcesso.CONCLUIDO);
            return;
        }
        setCombateProcesso(EProcesso.INICIANDO);
        setCombateInimigos((prevCombateInimigos) =>
            prevCombateInimigos.map((inimigoI) => {
                inimigoI.exeRolagemResultadoAtaque = EResultadoDados._NULO;
                inimigoI.exeRolagemResultadoSorte = EResultadoDados._NULO;
                return inimigoI;
            })
        );
        setCombateInimigos_PosturaInimigo((prevCombateInimigos_PosturaInimigo) => {
            prevCombateInimigos_PosturaInimigo = prevCombateInimigos_PosturaInimigo.map((posturaI, indiceI) => {
                posturaI = EPosturaInimigo._AGUARDANDO;
                if (indiceI === 0) {
                    posturaI = EPosturaInimigo.ATACANTE;
                } else if (combateMultiplo_2osApoio) {
                    posturaI = EPosturaInimigo.APOIO;
                }
                return posturaI;
            });
            return prevCombateInimigos_PosturaInimigo;
        });
    }

    function ImporCombateInimigos_PosturaInimigo(idInimigo: number, postura: EPosturaInimigo) {
        if (combateInimigos_PosturaInimigo && combateInimigos_PosturaInimigo[idInimigo] && combateInimigos_PosturaInimigo[idInimigo] !== postura) {
            setCombateInimigos_PosturaInimigo((prevCombateInimigos_PosturaInimigo) => {
                prevCombateInimigos_PosturaInimigo = prevCombateInimigos_PosturaInimigo.map((posturaInimigoI, indiceI) => {
                    if (idInimigo === indiceI) {
                        posturaInimigoI = postura;
                    }
                    return posturaInimigoI;
                });
                return prevCombateInimigos_PosturaInimigo;
            });
        }
    }

    function ObterCombateInimigosEfeitosAplicados(idInimigo: number, atributo: EAtributo): IEfeito[] {
        if (!combateInimigosEfeitosAplicados || !combateInimigosEfeitosAplicados.length) {
            return [];
        }
        return combateInimigosEfeitosAplicados.filter(
            (efeitoI) => efeitoI.atributoEfeito === atributo && efeitoI.exeIdInimigo === idInimigo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.exeProcessoEfeito)
        )!;
    }

    function AdicionarEmCombateInimigosEfeitosAplicados(efeitos: IEfeitoInimigoExecucao[]) {
        setCombateInimigosEfeitosAplicados((prevCombateInimigosEfeitosAplicados) => {
            efeitos.forEach((efeitoI) => {
                if (!prevCombateInimigosEfeitosAplicados.some((efeitoI2) => efeitoI2.exeIdEfeito === efeitoI.exeIdEfeito)) {
                    prevCombateInimigosEfeitosAplicados.push(efeitoI);
                }
            });
            return [...prevCombateInimigosEfeitosAplicados];
        });
    }

    function ImporCombateInimigosEfeitosAplicadosExeProcessoEfeito(idInimigo: number, processo: EProcesso) {
        if (combateInimigosEfeitosAplicados && combateInimigosEfeitosAplicados[idInimigo] && combateInimigosEfeitosAplicados[idInimigo].exeProcessoEfeito !== processo) {
            setCombateInimigosEfeitosAplicados((prevCombateInimigosEfeitosAplicados) => {
                prevCombateInimigosEfeitosAplicados = prevCombateInimigosEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (idInimigo === indiceI) {
                        efeitoI.exeProcessoEfeito = processo;
                    }
                    return efeitoI;
                });
                return [...prevCombateInimigosEfeitosAplicados];
            });
        }
    }

    function AplicarEfeitoDoCombateInimigosEfeitosAplicadosExeProcessoEfeitoIniciando(efeito: IEfeitoInimigoExecucao) {
        if (!efeito || efeito.exeProcessoEfeito !== EProcesso.INICIANDO || efeito.atributoEfeito !== EAtributo.ENERGIA || !combateInimigos || !combateInimigos[efeito.exeIdInimigo]) {
            return;
        }
        setCombateInimigos((prevCombateInimigo) => {
            prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                if (efeito.exeIdInimigo === indiceI) {
                    inimigoI.exeEnergiaAtual += efeito.quantidade;
                    inimigoI.exeEnergiaAtual = Math.max(inimigoI.exeEnergiaAtual, 0);
                    inimigoI.exeEnergiaAtual = Math.min(inimigoI.exeEnergiaAtual, inimigoI.energia);
                }
                return inimigoI;
            });
            return prevCombateInimigo;
        });
    }

    function ObterCombateAliadoEfeitosAplicadosDoAtributo(atributo: EAtributo): IEfeito[] {
        if (!combateAliado) {
            return ObterJogadorEfeitosAplicadosDoAtributo(atributo);
        } else {
            if (!combateAliadoEfeitosAplicados || !combateAliadoEfeitosAplicados.length) {
                return [];
            }
            return combateAliadoEfeitosAplicados.filter(
                (efeitoI) => efeitoI.atributoEfeito === atributo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.exeProcessoEfeito)
            )!;
        }
    }

    function AdicionarEmCombateAliadosEfeitosAplicados(efeitos: IEfeitoExecucao[]) {
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
    }

    function ImporCombateAliadoEfeitosAplicadosExeProcessoEfeito(idInimigo: number, processo: EProcesso) {
        if (combateAliadoEfeitosAplicados && combateAliadoEfeitosAplicados[idInimigo] && combateAliadoEfeitosAplicados[idInimigo].exeProcessoEfeito !== processo) {
            setCombateAliadoEfeitosAplicados((prevCombateAliadoEfeitosAplicados) => {
                prevCombateAliadoEfeitosAplicados = prevCombateAliadoEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (idInimigo === indiceI) {
                        efeitoI.exeProcessoEfeito = processo;
                    }
                    return efeitoI;
                });
                return prevCombateAliadoEfeitosAplicados;
            });
        }
    }

    function AplicarEfeitoDoCombateAliadoEfeitosAplicadosExeProcessoEfeitoIniciando(efeito: IEfeitoExecucao) {
        if (!efeito || efeito.exeProcessoEfeito !== EProcesso.INICIANDO || efeito.atributoEfeito !== EAtributo.ENERGIA || !combateAliado) {
            return;
        }
        setCombateAliado((prevCombateAliado) => {
            prevCombateAliado.exeEnergiaAtual += efeito.quantidade;
            prevCombateAliado.exeEnergiaAtual = Math.max(prevCombateAliado.exeEnergiaAtual, 0);
            prevCombateAliado.exeEnergiaAtual = Math.min(prevCombateAliado.exeEnergiaAtual, prevCombateAliado.energia);
            prevCombateAliado.exeEstaVivo = prevCombateAliado.exeEnergiaAtual >= 1;
            return prevCombateAliado;
        });
    }

    function ImporHistoriaTextosExeProcessoTexto(idInimigo: number, processo: EProcesso) {
        if (historiaTextos && historiaTextos[idInimigo] && historiaTextos[idInimigo].exeProcessoTexto !== processo) {
            setHistoriaTextos((prevHistoriaTextos) => {
                prevHistoriaTextos = prevHistoriaTextos.map((historiaI, indiceI) => {
                    if (idInimigo === indiceI) {
                        historiaI.exeProcessoTexto = processo;
                    }
                    return historiaI;
                });
                return prevHistoriaTextos;
            });
        }
    }

    function ImporHistoriaEfeitosExeProcessoEfeito(idInimigo: number, processo: EProcesso) {
        if (historiaEfeitos && historiaEfeitos[idInimigo] && historiaEfeitos[idInimigo].exeProcessoEfeito !== processo) {
            setHistoriaEfeitos((prevHistoriaEfeitos) => {
                prevHistoriaEfeitos = prevHistoriaEfeitos.map((historiaI, indiceI) => {
                    if (idInimigo === indiceI) {
                        historiaI.exeProcessoEfeito = processo;
                    }
                    return historiaI;
                });
                return prevHistoriaEfeitos;
            });
        }
    }

    function ImporCombateInimigos_ProcessoRolagemAtaque(idInimigo: number, processo: EProcesso) {
        if (combateInimigos_ProcessoRolagemAtaque && combateInimigos_ProcessoRolagemAtaque[idInimigo] && combateInimigos_ProcessoRolagemAtaque[idInimigo] !== processo) {
            setCombateInimigos_ProcessoRolagemAtaque((prevCombateInimigos_ProcessoRolagemAtaque) => {
                prevCombateInimigos_ProcessoRolagemAtaque = prevCombateInimigos_ProcessoRolagemAtaque.map((processoRolagemAtaqueI, indiceI) => {
                    if (idInimigo === indiceI) {
                        processoRolagemAtaqueI = processo;
                    }
                    return processoRolagemAtaqueI;
                });
                return prevCombateInimigos_ProcessoRolagemAtaque;
            });
        }
    }

    function ImporCombateInimigos_ProcessoRolagemSorteConfirmacao(idInimigo: number, processo: EProcesso) {
        if (combateInimigos_ProcessoRolagemSorteConfirmacao && combateInimigos_ProcessoRolagemSorteConfirmacao[idInimigo] && combateInimigos_ProcessoRolagemSorteConfirmacao[idInimigo] !== processo) {
            setCombateInimigos_ProcessoRolagemSorteConfirmacao((prevCombateInimigos_ProcessoRolagemSorteConfirmacao) => {
                prevCombateInimigos_ProcessoRolagemSorteConfirmacao = prevCombateInimigos_ProcessoRolagemSorteConfirmacao.map((processoRolagemSorteConfirmacaoI, indiceI) => {
                    if (idInimigo === indiceI) {
                        processoRolagemSorteConfirmacaoI = processo;
                    }
                    return processoRolagemSorteConfirmacaoI;
                });
                return prevCombateInimigos_ProcessoRolagemSorteConfirmacao;
            });
        }
    }

    function ImporCombateInimigosExeRolagemResultadoAtaque(idInimigo: number, resultado: EResultadoDados) {
        if (combateInimigos && combateInimigos[idInimigo] && combateInimigos[idInimigo].exeRolagemResultadoAtaque !== resultado) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (idInimigo === indiceI) {
                        inimigoI.exeRolagemResultadoAtaque = resultado;
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
        }
        return resultado;
    }

    function ImporCombateInimigosExeRolagemResultadoSorte(idInimigo: number, resultado: EResultadoDados) {
        if (combateInimigos && combateInimigos[idInimigo] && combateInimigos[idInimigo].exeRolagemResultadoSorte !== resultado) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (idInimigo === indiceI) {
                        inimigoI.exeRolagemResultadoSorte = resultado;
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
        }
        return resultado;
    }

    function ImporCombateInimigosExeSerieDeAtaqueVencidoConsecutivo(idInimigo: number, ehIncremento: boolean) {
        if (combateInimigos && combateInimigos[idInimigo]) {
            setCombateInimigos((prevCombateInimigo) => {
                prevCombateInimigo = prevCombateInimigo.map((inimigoI, indiceI) => {
                    if (idInimigo === indiceI) {
                        if (ehIncremento) {
                            inimigoI.exeSerieDeAtaqueVencidoConsecutivo += 1;
                        } else {
                            inimigoI.exeSerieDeAtaqueVencidoConsecutivo = 0;
                        }
                    }
                    return inimigoI;
                });
                return prevCombateInimigo;
            });
        }
    }

    function IrParaOTopoDaPaginaViaScroll() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};

export default ContextoPagina;
