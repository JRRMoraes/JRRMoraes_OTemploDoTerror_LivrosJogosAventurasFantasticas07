import styles from "./TelaHistorias.module.scss";
import { useState, useEffect } from "react";
import { EPaginaCampanhaEstado, IHistoriaExecutor } from "../tipos";
import { ContextoJogos } from "../contextos";
import { Botao, TextosDatilografados } from "../componentes";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO } from "../globais/Constantes";

export const TelaHistorias = () => {
    const {
        jogoAtual,
        paginaExecutor,
        AplicarEfeitosDaHistoria,
        ImporProcessoHistoriasNaPaginaCampanha,
        ImporPaginaCampanhaHistoriasExecutoresViaIndice,
        ImporEIncrementarPaginaCampanhaExeIndiceHistoria,
    } = ContextoJogos();

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
            ImporProcessoHistoriasNaPaginaCampanha(EProcesso.PROCESSANDO);
            return;
        }
        if (paginaExecutor.exeProcessoHistorias === EProcesso.PROCESSANDO) {
            if (ObterHistoriaAtual()) {
                if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso._ZERO) {
                    ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso.INICIANDO, EProcesso.INICIANDO, EProcesso._ZERO);
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.INICIANDO) {
                    ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso.PROCESSANDO, EProcesso.PROCESSANDO, EProcesso._ZERO);
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.PROCESSANDO) {
                    if (ObterHistoriaAtual().exeProcessoTexto === EProcesso.CONCLUIDO) {
                        if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso._ZERO) {
                            ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.INICIANDO);
                        } else if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso.INICIANDO) {
                            if (
                                !paginaExecutor.exeEhJogoCarregado &&
                                paginaExecutor.exeEstado === EPaginaCampanhaEstado.HISTORIAS &&
                                ObterHistoriaAtual().efeitos &&
                                ObterHistoriaAtual().efeitos.length
                            ) {
                                AplicarEfeitosDaHistoria(ObterHistoriaAtual().efeitos);
                                ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.PROCESSANDO);
                                setTimeout(() => {
                                    ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.CONCLUIDO);
                                }, TEMPO_ANIMACAO);
                            } else {
                                ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso._ZERO, EProcesso.CONCLUIDO);
                            }
                        } else if (ObterHistoriaAtual().exeProcessoEfeito === EProcesso.CONCLUIDO) {
                            ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso.CONCLUIDO, EProcesso.DESTRUIDO, EProcesso.DESTRUIDO);
                        }
                    }
                } else if (ObterHistoriaAtual().exeProcessoHistoria === EProcesso.CONCLUIDO) {
                    ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso.DESTRUIDO, EProcesso._ZERO, EProcesso._ZERO);
                    ImporEIncrementarPaginaCampanhaExeIndiceHistoria();
                }
            } else {
                ImporProcessoHistoriasNaPaginaCampanha(EProcesso.CONCLUIDO);
            }
            return;
        }
    }, [paginaExecutor]);

    if (ContextosReprovados(true)) {
        return <></>;
    }
    return (
        <div className={styles.historias}>
            {paginaExecutor.historias.map((historiaI, indiceI) => {
                if ([EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaExecutor.historias[indiceI].exeProcessoHistoria)) {
                    return (
                        <div key={indiceI}>
                            <div className={styles.historias_texto}>
                                <TextosDatilografados
                                    textos={historiaI.textosHistoria}
                                    velocidade={velocidade}
                                    aoConcluir={() => FuncaoAoConcluirTexto()}
                                />
                            </div>
                            {MontarRetorno_Botao(historiaI)}
                            {MontarRetorno_Efeitos(historiaI)}
                        </div>
                    );
                } else {
                    return <div key={indiceI}></div>;
                }
            })}
        </div>
    );

    function ContextosReprovados(processoIniciandoReprova: boolean) {
        let _reprovado =
            !jogoAtual ||
            !paginaExecutor ||
            !paginaExecutor.historias ||
            !paginaExecutor.historias.length ||
            ![EPaginaCampanhaEstado.HISTORIAS, EPaginaCampanhaEstado.COMBATE, EPaginaCampanhaEstado.DESTINOS].includes(paginaExecutor.exeEstado);
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

    function MontarRetorno_Botao(historia: IHistoriaExecutor) {
        if (historia.exeProcessoTexto !== EProcesso.DESTRUIDO && exibeBotao) {
            return (
                <div className={styles.historias_pularHistoria}>
                    <Botao aoClicar={() => PularHistoria()}>Pular História</Botao>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Efeitos(historia: IHistoriaExecutor) {
        if (historia.exeProcessoTexto === EProcesso.DESTRUIDO && historia.exeProcessoEfeito !== EProcesso._ZERO) {
            return (
                <div>
                    {historia.efeitos.map((efeitoI, indiceI) => {
                        let _className = efeitoI.quantidade >= 1 ? styles.historias_efeito_bom : styles.historias_efeito_ruim;
                        return (
                            <p
                                key={indiceI}
                                className={_className}
                            >
                                {efeitoI.textoEfeito}
                            </p>
                        );
                    })}
                </div>
            );
        } else {
            return <></>;
        }
    }

    function PularHistoria() {
        setVelocidade(VELOCIDADES.rapido);
        setExibeBotao(false);
    }

    function FuncaoAoConcluirTexto() {
        ImporPaginaCampanhaHistoriasExecutoresViaIndice(EProcesso._ZERO, EProcesso.CONCLUIDO, EProcesso._ZERO);
    }
};

export default TelaHistorias;
