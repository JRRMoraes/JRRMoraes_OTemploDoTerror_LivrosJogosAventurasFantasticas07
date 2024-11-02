import { useState, useEffect } from "react";
import { EPaginaExecutorEstado, IHistoriaExecucao } from "../tipos";
import { ContextoJogos } from "../contextos";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";

export const ControleHistorias = () => {
    const { jogoAtual, paginaExecutor, historiasExecutor, setHistoriasExecutor, AplicarEfeitosAtuaisDaHistoria } = ContextoJogos();

    const VELOCIDADES = { normal: 20, rapido: 0 };
    const [velocidade, setVelocidade] = useState(VELOCIDADES.normal);
    const [exibeBotao, setExibeBotao] = useState(true);

    useEffect(() => {
        if (ContextosReprovados(false)) {
            setVelocidade(VELOCIDADES.normal);
            setExibeBotao(true);
            return;
        }
        if (historiasExecutor.processoHistorias === EProcesso.INICIANDO) {
            if (paginaExecutor.exeEhJogoCarregado) {
                setVelocidade(VELOCIDADES.rapido);
                setExibeBotao(false);
            }
            ImporProcessoNoHistoriasExecutor(EProcesso.PROCESSANDO);
            return;
        }
        if (historiasExecutor.processoHistorias === EProcesso.PROCESSANDO) {
            if (ObterHistoriaAtual()) {
                if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso._ZERO) {
                    ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso.INICIANDO, EProcesso.INICIANDO, EProcesso._ZERO);
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.INICIANDO) {
                    ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso.PROCESSANDO, EProcesso.PROCESSANDO, EProcesso._ZERO);
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.PROCESSANDO) {
                    if (ObterHistoriaAtual().exeProcessoTexto === EProcesso.CONCLUIDO) {
                        if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso._ZERO) {
                            ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.INICIANDO);
                        } else if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso.INICIANDO) {
                            if (
                                !paginaExecutor.exeEhJogoCarregado &&
                                paginaExecutor.exeEstado === EPaginaExecutorEstado.HISTORIAS &&
                                ObterHistoriaAtual().efeitos &&
                                ObterHistoriaAtual().efeitos.length
                            ) {
                                AplicarEfeitosAtuaisDaHistoria(ObterHistoriaAtual().efeitos);
                                ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.PROCESSANDO);
                                setTimeout(() => {
                                    ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.CONCLUIDO);
                                }, TEMPO_ANIMACAO_NORMAL);
                            } else {
                                ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.CONCLUIDO);
                            }
                        } else if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso.CONCLUIDO) {
                            ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso.CONCLUIDO, EProcesso.DESTRUIDO, EProcesso.DESTRUIDO);
                        }
                    }
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.CONCLUIDO) {
                    ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso.DESTRUIDO, EProcesso._ZERO, EProcesso._ZERO);
                    ImporEIncrementarIndiceDoHistoriasExecutor();
                }
            } else {
                ImporProcessoNoHistoriasExecutor(EProcesso.CONCLUIDO);
            }
            return;
        }
    }, [historiasExecutor]);

    return {
        historiasExecutor,
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
            !historiasExecutor ||
            !historiasExecutor.historias ||
            !historiasExecutor.historias.length ||
            ![EPaginaExecutorEstado.HISTORIAS, EPaginaExecutorEstado.COMBATE, EPaginaExecutorEstado.DESTINOS].includes(paginaExecutor.exeEstado);
        if (processoIniciandoReprova) {
            _reprovado ||= ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historiasExecutor.processoHistorias);
        } else {
            _reprovado ||= ![EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historiasExecutor.processoHistorias);
        }
        return _reprovado;
    }

    function ObterHistoriaAtual() {
        return historiasExecutor.historias[historiasExecutor.indiceHistoria];
    }

    function ImporProcessoNoHistoriasExecutor(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaExecutor.exeEstado === EPaginaExecutorEstado.HISTORIAS) {
            if (historiasExecutor.processoHistorias === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setHistoriasExecutor((prevHistoriasExecutor) => {
                    return { ...prevHistoriasExecutor, processoHistorias: EProcesso.PROCESSANDO };
                });
            } else if (historiasExecutor.processoHistorias === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setHistoriasExecutor((prevHistoriasExecutor) => {
                    return { ...prevHistoriasExecutor, processoHistorias: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporExeProcessosDoHistoriasExecutorViaIndice(processoHistoria: EProcesso, processoTexto: EProcesso, processoEfeito: EProcesso) {
        if (ObterHistoriaAtual()) {
            setHistoriasExecutor((prevHistoriasExecutor) => {
                prevHistoriasExecutor.historias = prevHistoriasExecutor.historias.map((historiaI, indiceI) => {
                    if (indiceI === prevHistoriasExecutor.indiceHistoria) {
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
                return { ...prevHistoriasExecutor };
            });
        }
    }

    function ImporEIncrementarIndiceDoHistoriasExecutor() {
        setHistoriasExecutor((prevHistoriasExecutor) => {
            prevHistoriasExecutor.indiceHistoria += 1;
            return { ...prevHistoriasExecutor };
        });
    }

    function AprovarExeProcessoHistoria(historia: IHistoriaExecucao) {
        return [EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historia.exeProcessoHistoria);
    }

    function AprovarBotaoPularHistoria(historia: IHistoriaExecucao) {
        return ![EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historia.exeProcessoTexto) && exibeBotao;
    }

    function AprovarEfeitos(historia: IHistoriaExecucao) {
        return historia.efeitos && historia.efeitos.length && [EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historia.exeProcessoTexto) && historia.exeProcessoEfeito !== EProcesso._ZERO;
    }

    function PularHistoria() {
        setVelocidade(VELOCIDADES.rapido);
        setExibeBotao(false);
    }

    function FuncaoAoConcluirTexto() {
        ImporExeProcessosDoHistoriasExecutorViaIndice(EProcesso._ZERO, EProcesso.CONCLUIDO, EProcesso._ZERO);
    }
};

export default ControleHistorias;
