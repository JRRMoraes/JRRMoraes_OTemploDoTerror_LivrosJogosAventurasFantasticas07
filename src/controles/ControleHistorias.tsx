import { useState, useEffect } from "react";
import { EPaginaExecutorEstado, IHistoriaExecutor } from "../tipos";
import { ContextoJogos } from "../contextos";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";

export const ControleHistorias = () => {
    const { jogoAtual, paginaExecutor, setPaginaExecutor, AplicarEfeitosDaHistoria } = ContextoJogos();

    const VELOCIDADES = { normal: 20, rapido: 0 };
    const [velocidade, setVelocidade] = useState(VELOCIDADES.normal);
    const [exibeBotao, setExibeBotao] = useState(true);

    useEffect(() => {
        if (ContextosReprovados(false)) {
            setVelocidade(VELOCIDADES.normal);
            setExibeBotao(true);
            return;
        }
        if (paginaExecutor.exeProcessoHistorias === EProcesso.INICIANDO) {
            if (paginaExecutor.exeEhJogoCarregado) {
                setVelocidade(VELOCIDADES.rapido);
                setExibeBotao(false);
            }
            ImporProcessoHistoriasNaPaginaExecutor(EProcesso.PROCESSANDO);
            return;
        }
        if (paginaExecutor.exeProcessoHistorias === EProcesso.PROCESSANDO) {
            if (ObterHistoriaAtual()) {
                if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso._ZERO) {
                    ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso.INICIANDO, EProcesso.INICIANDO, EProcesso._ZERO);
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.INICIANDO) {
                    ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso.PROCESSANDO, EProcesso.PROCESSANDO, EProcesso._ZERO);
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.PROCESSANDO) {
                    if (ObterHistoriaAtual().exeProcessoTexto === EProcesso.CONCLUIDO) {
                        if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso._ZERO) {
                            ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.INICIANDO);
                        } else if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso.INICIANDO) {
                            if (
                                !paginaExecutor.exeEhJogoCarregado &&
                                paginaExecutor.exeEstado === EPaginaExecutorEstado.HISTORIAS &&
                                ObterHistoriaAtual().efeitos &&
                                ObterHistoriaAtual().efeitos.length
                            ) {
                                AplicarEfeitosDaHistoria(ObterHistoriaAtual().efeitos);
                                ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.PROCESSANDO);
                                setTimeout(() => {
                                    ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.CONCLUIDO);
                                }, TEMPO_ANIMACAO_NORMAL);
                            } else {
                                ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.CONCLUIDO);
                            }
                        } else if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso.CONCLUIDO) {
                            ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso.CONCLUIDO, EProcesso.DESTRUIDO, EProcesso.DESTRUIDO);
                        }
                    }
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.CONCLUIDO) {
                    ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso.DESTRUIDO, EProcesso._ZERO, EProcesso._ZERO);
                    ImporEIncrementarPaginaExecutorExeIndiceHistoria();
                }
            } else {
                ImporProcessoHistoriasNaPaginaExecutor(EProcesso.CONCLUIDO);
            }
            return;
        }
    }, [paginaExecutor]);

    return {
        paginaExecutor,
        velocidade,
        exibeBotao,
        ContextosReprovados,
        AprovarExeProcessoHistoria,
        AprovarBotaoPularHistoria,
        AprovarEfeitos,
        PularHistoria,
        FuncaoAoConcluirTexto,
    };

    function ContextosReprovados(processoIniciandoReprova: boolean) {
        let _reprovado =
            !jogoAtual ||
            !paginaExecutor ||
            !paginaExecutor.historias ||
            !paginaExecutor.historias.length ||
            ![EPaginaExecutorEstado.HISTORIAS, EPaginaExecutorEstado.COMBATE, EPaginaExecutorEstado.DESTINOS].includes(paginaExecutor.exeEstado);
        if (processoIniciandoReprova) {
            _reprovado ||= ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaExecutor.exeProcessoHistorias);
        } else {
            _reprovado ||= ![EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaExecutor.exeProcessoHistorias);
        }
        return _reprovado;
    }

    function ObterHistoriaAtual() {
        return paginaExecutor.historias[paginaExecutor.exeIndiceHistoria];
    }

    function ImporProcessoHistoriasNaPaginaExecutor(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaExecutor.exeEstado === EPaginaExecutorEstado.HISTORIAS) {
            if (paginaExecutor.exeProcessoHistorias === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoHistorias: EProcesso.PROCESSANDO };
                });
            } else if (paginaExecutor.exeProcessoHistorias === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoHistorias: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporPaginaExecutorHistoriasExecutoresViaIndice(processoHistoria: EProcesso, processoTexto: EProcesso, processoEfeito: EProcesso) {
        if (paginaExecutor.historias[paginaExecutor.exeIndiceHistoria]) {
            setPaginaExecutor((prevPaginaExecutor) => {
                prevPaginaExecutor.historias = prevPaginaExecutor.historias.map((historiaI, indiceI) => {
                    if (indiceI === paginaExecutor.exeIndiceHistoria) {
                        if (processoHistoria !== EProcesso._ZERO) {
                            historiaI.exeProcessoHistoria = processoHistoria;
                        }
                        if (processoTexto !== EProcesso._ZERO) {
                            historiaI.exeProcessoTexto = processoTexto;
                        }
                        if (processoEfeito !== EProcesso._ZERO) {
                            historiaI.exeProcessoEfeito = processoEfeito;
                        }
                    }
                    return historiaI;
                });
                return { ...prevPaginaExecutor };
            });
        }
    }

    function ImporEIncrementarPaginaExecutorExeIndiceHistoria() {
        setPaginaExecutor((prevPaginaExecutor) => {
            prevPaginaExecutor.exeIndiceHistoria += 1;
            return { ...prevPaginaExecutor };
        });
    }

    function AprovarExeProcessoHistoria(historia: IHistoriaExecutor) {
        return [EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historia.exeProcessoHistoria);
    }

    function AprovarBotaoPularHistoria(historia: IHistoriaExecutor) {
        return ![EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historia.exeProcessoTexto) && exibeBotao;
    }

    function AprovarEfeitos(historia: IHistoriaExecutor) {
        return (
            historia.efeitos &&
            historia.efeitos.length &&
            [EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historia.exeProcessoTexto) &&
            ![EProcesso._ZERO, EProcesso.DESTRUIDO].includes(historia.exeProcessoEfeito)
        );
    }

    function PularHistoria() {
        setVelocidade(VELOCIDADES.rapido);
        setExibeBotao(false);
    }

    function FuncaoAoConcluirTexto() {
        ImporPaginaExecutorHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso.CONCLUIDO, EProcesso._ZERO);
    }
};

export default ControleHistorias;
