import { useState, useEffect } from "react";
import { EPaginaExecutorEstado, IHistoriaTextoExecucao } from "../tipos";
import { ContextoPagina, ContextoJogos } from "../contextos";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";

export const ControleHistorias = () => {
    const {
        paginaEstado,
        setPaginaEstado,
        paginaEhJogoCarregado,
        historiaTextos,
        historiaEfeitos,
        historiaImagens,
        historiaProcesso,
        setHistoriaProcesso,
        historiaIndice,
        setHistoriaIndice,
        historiaProcessoIndice,
        setHistoriaProcessoIndice,
        ImporHistoriaTextosExeProcessoTexto,
        ImporHistoriaEfeitosExeProcessoEfeito,
    } = ContextoPagina();

    const { jogoAtual, AdicionarEmJogadorEfeitosAplicados } = ContextoJogos();

    const VELOCIDADES = { normal: 20, rapido: 0 };
    const [velocidade, setVelocidade] = useState(VELOCIDADES.normal);
    const [exibeBotao, setExibeBotao] = useState(true);

    let _unicoSetHistoriaIndice = true;

    useEffect(() => {
        if (!jogoAtual || !historiaTextos || !historiaTextos.length || paginaEstado !== EPaginaExecutorEstado.HISTORIAS) {
            return;
        }
        switch (historiaProcesso) {
            case EProcesso._ZERO:
                setHistoriaProcesso(EProcesso.INICIANDO);
                break;
            case EProcesso.INICIANDO:
                if (!paginaEhJogoCarregado) {
                    setVelocidade(VELOCIDADES.normal);
                    setExibeBotao(true);
                } else {
                    setVelocidade(VELOCIDADES.rapido);
                    setExibeBotao(false);
                }
                ImporHistoriaTextosExeProcessoTexto(historiaIndice, EProcesso._ZERO);
                ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso._ZERO);
                setHistoriaProcessoIndice(EProcesso._ZERO);
                setHistoriaProcesso(EProcesso.PROCESSANDO);
                _unicoSetHistoriaIndice = true;
                break;
            case EProcesso.CONCLUIDO:
                setHistoriaProcesso(EProcesso.DESTRUIDO);
                setPaginaEstado(EPaginaExecutorEstado.COMBATE);
                break;
        }
    }, [paginaEstado, historiaProcesso]);

    useEffect(() => {
        if (!jogoAtual || !historiaTextos || !historiaTextos.length || paginaEstado !== EPaginaExecutorEstado.HISTORIAS || historiaProcesso !== EProcesso.PROCESSANDO) {
            return;
        }
        if (!ObterHistoriaTextosAtuais()) {
            setHistoriaProcesso(EProcesso.CONCLUIDO);
            return;
        }
        switch (historiaProcessoIndice) {
            case EProcesso._ZERO:
                ImporHistoriaTextosExeProcessoTexto(historiaIndice, EProcesso.INICIANDO);
                ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso._ZERO);
                setHistoriaProcessoIndice(EProcesso.INICIANDO);
                break;
            case EProcesso.INICIANDO:
                ImporHistoriaTextosExeProcessoTexto(historiaIndice, EProcesso.PROCESSANDO);
                ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso._ZERO);
                setHistoriaProcessoIndice(EProcesso.PROCESSANDO);
                break;
            case EProcesso.PROCESSANDO:
                if (ObterHistoriaTextosAtuais().exeProcessoTexto === EProcesso.CONCLUIDO) {
                    if (ObterHistoriaEfeitosAtuais().exeProcessoEfeito === EProcesso._ZERO) {
                        ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso.INICIANDO);
                    } else if (ObterHistoriaEfeitosAtuais().exeProcessoEfeito === EProcesso.INICIANDO) {
                        if (!paginaEhJogoCarregado && ObterHistoriaEfeitosAtuais() && ObterHistoriaEfeitosAtuais().efeitos && ObterHistoriaEfeitosAtuais().efeitos.length) {
                            AdicionarEmJogadorEfeitosAplicados(ObterHistoriaEfeitosAtuais().efeitos);
                            ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso.PROCESSANDO);
                            setTimeout(() => {
                                ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso.CONCLUIDO);
                            }, TEMPO_ANIMACAO_NORMAL);
                        } else {
                            ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso.CONCLUIDO);
                        }
                    } else if (ObterHistoriaEfeitosAtuais().exeProcessoEfeito === EProcesso.CONCLUIDO) {
                        ImporHistoriaTextosExeProcessoTexto(historiaIndice, EProcesso.DESTRUIDO);
                        ImporHistoriaEfeitosExeProcessoEfeito(historiaIndice, EProcesso.DESTRUIDO);
                        setHistoriaProcessoIndice(EProcesso.CONCLUIDO);
                    }
                }
                break;
            case EProcesso.CONCLUIDO:
                if (_unicoSetHistoriaIndice) {
                    _unicoSetHistoriaIndice = false;
                    setHistoriaIndice((prevHistoriaIndice) => (prevHistoriaIndice += 1));
                    if (historiaTextos.length > historiaIndice + 1) {
                        setHistoriaProcessoIndice(EProcesso._ZERO);
                    } else {
                        setHistoriaProcessoIndice(EProcesso.DESTRUIDO);
                    }
                }
                break;
        }
    }, [historiaProcesso, historiaProcessoIndice, historiaTextos, historiaEfeitos, historiaIndice]);

    return {
        historiaTextos,
        historiaEfeitos,
        velocidade,
        exibeBotao,
        ContextosReprovados,
        AprovarExeProcessoHistoria,
        AprovarBotaoPularHistoria,
        AprovarEfeitos,
        PularHistoria,
        FuncaoAoConcluirTexto,
        ObterImagemDaHistoria,
    };

    function ContextosReprovados() {
        return (
            !jogoAtual ||
            !historiaTextos ||
            !historiaTextos.length ||
            ![EPaginaExecutorEstado.HISTORIAS, EPaginaExecutorEstado.COMBATE, EPaginaExecutorEstado.DESTINOS].includes(paginaEstado) ||
            ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historiaProcesso)
        );
    }

    function ObterHistoriaTextosAtuais() {
        return historiaTextos[historiaIndice];
    }

    function ObterHistoriaEfeitosAtuais() {
        return historiaEfeitos[historiaIndice];
    }

    function AprovarExeProcessoHistoria(historiaTexto: IHistoriaTextoExecucao) {
        return [EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historiaTexto.exeProcessoTexto);
    }

    function AprovarBotaoPularHistoria(historiaTexto: IHistoriaTextoExecucao) {
        return ![EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historiaTexto.exeProcessoTexto) && exibeBotao;
    }

    function AprovarEfeitos(historiaTexto: IHistoriaTextoExecucao, indice: number) {
        return (
            historiaEfeitos &&
            historiaEfeitos[indice] &&
            historiaEfeitos[indice].efeitos &&
            historiaEfeitos[indice].efeitos.length &&
            [EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(historiaTexto.exeProcessoTexto) &&
            historiaEfeitos[indice].exeProcessoEfeito !== EProcesso._ZERO
        );
    }

    function PularHistoria() {
        setVelocidade(VELOCIDADES.rapido);
        setExibeBotao(false);
    }

    function FuncaoAoConcluirTexto() {
        ImporHistoriaTextosExeProcessoTexto(historiaIndice, EProcesso.CONCLUIDO);
    }

    function ObterImagemDaHistoria(indice: number) {
        if (!historiaImagens || !historiaImagens[indice] || historiaImagens[indice].arquivo === "") {
            return null;
        }
        return historiaImagens[indice];
    }
};

export default ControleHistorias;
