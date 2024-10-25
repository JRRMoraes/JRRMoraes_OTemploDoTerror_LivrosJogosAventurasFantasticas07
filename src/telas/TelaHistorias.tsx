import styles from "./TelaHistorias.module.scss";
import { useState, useEffect } from "react";
import { IEfeito, EPaginaCampanhaEstado } from "../tipos";
import { ContextoJogos } from "../contextos";
import { Botao, TextosDatilografados } from "../componentes";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO } from "../globais/Constantes";

interface ITelaHistoriasConclusao {
    processo: EProcesso;
    processoTexto: EProcesso;
    processoEfeito: EProcesso;
}

export const TelaHistorias = () => {
    const { jogoAtual, paginaExecutor, AplicarEfeitosDaHistoria, ImporProcessoHistoriasNaPaginaCampanha } = ContextoJogos();

    const VELOCIDADES = { normal: 20, rapido: 0 };
    const [velocidade, setVelocidade] = useState(VELOCIDADES.normal);
    const [exibeBotao, setExibeBotao] = useState(true);

    const [conclusoes, setConclusoes] = useState<ITelaHistoriasConclusao[]>([]);
    const [indiceConclusao, setIndiceConclusao] = useState(0);

    useEffect(() => {
        if (ContextosReprovados(false)) {
            setIndiceConclusao(0);
            setConclusoes([]);
            setVelocidade(VELOCIDADES.normal);
            setExibeBotao(true);
            return;
        }
        if (paginaExecutor.exeProcessoHistorias === EProcesso.INICIANDO) {
            if (paginaExecutor.historias.length && (!conclusoes || !conclusoes.length)) {
                if (paginaExecutor.exeEhJogoCarregado) {
                    setVelocidade(VELOCIDADES.rapido);
                    setExibeBotao(false);
                }
                paginaExecutor.historias.forEach((historiaI, indiceI) => {
                    setConclusoes((prevConclusoes) => {
                        return [
                            ...prevConclusoes,
                            {
                                processo: EProcesso._ZERO,
                                processoTexto: EProcesso._ZERO,
                                processoEfeito: paginaExecutor.exeEhJogoCarregado ? EProcesso.CONCLUIDO : EProcesso._ZERO,
                            },
                        ];
                    });
                });
            }
            ImporProcessoHistoriasNaPaginaCampanha(EProcesso.PROCESSANDO);
            return;
        }
    }, [paginaExecutor, conclusoes]);

    useEffect(() => {
        if (ContextosReprovados(true)) {
            return;
        }
        if (conclusoes[indiceConclusao]) {
            if (conclusoes[indiceConclusao].processo === EProcesso._ZERO) {
                setConclusoes((prevConclusoes) => {
                    return prevConclusoes.map((conclusaoI, indiceI) => {
                        if (indiceI === indiceConclusao) {
                            return { ...conclusaoI, processo: EProcesso.INICIANDO };
                        }
                        return conclusaoI;
                    });
                });
            } else if (conclusoes[indiceConclusao].processo === EProcesso.INICIANDO) {
                setConclusoes((prevConclusoes) => {
                    return prevConclusoes.map((conclusaoI, indiceI) => {
                        if (indiceI === indiceConclusao) {
                            return { ...conclusaoI, processo: EProcesso.PROCESSANDO, processoTexto: EProcesso.PROCESSANDO };
                        }
                        return conclusaoI;
                    });
                });
            } else if (conclusoes[indiceConclusao].processo === EProcesso.PROCESSANDO) {
                if (conclusoes[indiceConclusao].processoTexto === EProcesso.CONCLUIDO) {
                    if (conclusoes[indiceConclusao].processoEfeito === EProcesso._ZERO) {
                        setConclusoes((prevConclusoes) => {
                            return prevConclusoes.map((conclusaoI, indiceI) => {
                                if (indiceI === indiceConclusao) {
                                    return { ...conclusaoI, processoEfeito: EProcesso.INICIANDO };
                                }
                                return conclusaoI;
                            });
                        });
                    } else if (conclusoes[indiceConclusao].processoEfeito === EProcesso.INICIANDO) {
                        if (
                            !paginaExecutor.exeEhJogoCarregado &&
                            paginaExecutor.exeEstado === EPaginaCampanhaEstado.HISTORIAS &&
                            paginaExecutor.historias[indiceConclusao].efeitos &&
                            paginaExecutor.historias[indiceConclusao].efeitos.length
                        ) {
                            AplicarEfeitosDaHistoria(paginaExecutor.historias[indiceConclusao].efeitos);
                            setConclusoes((prevConclusoes) => {
                                return prevConclusoes.map((conclusaoI, indiceI) => {
                                    if (indiceI === indiceConclusao) {
                                        return { ...conclusaoI, processoEfeito: EProcesso.PROCESSANDO };
                                    }
                                    return conclusaoI;
                                });
                            });
                        } else {
                            setConclusoes((prevConclusoes) => {
                                return prevConclusoes.map((conclusaoI, indiceI) => {
                                    if (indiceI === indiceConclusao) {
                                        return { ...conclusaoI, processoEfeito: EProcesso.CONCLUIDO };
                                    }
                                    return conclusaoI;
                                });
                            });
                        }
                    } else if (conclusoes[indiceConclusao].processoEfeito === EProcesso.PROCESSANDO) {
                        setTimeout(() => {
                            setConclusoes((prevConclusoes) => {
                                return prevConclusoes.map((conclusaoI, indiceI) => {
                                    if (indiceI === indiceConclusao) {
                                        return { ...conclusaoI, processoEfeito: EProcesso.CONCLUIDO };
                                    }
                                    return conclusaoI;
                                });
                            });
                        }, TEMPO_ANIMACAO);
                    } else if (conclusoes[indiceConclusao].processoEfeito === EProcesso.CONCLUIDO) {
                        setConclusoes((prevConclusoes) => {
                            return prevConclusoes.map((conclusaoI, indiceI) => {
                                if (indiceI === indiceConclusao) {
                                    return { ...conclusaoI, processo: EProcesso.CONCLUIDO };
                                }
                                return conclusaoI;
                            });
                        });
                    }
                }
            } else if (conclusoes[indiceConclusao].processo === EProcesso.CONCLUIDO) {
                setIndiceConclusao((prevIndiceConclusao) => prevIndiceConclusao + 1);
            }
        } else {
            ImporProcessoHistoriasNaPaginaCampanha(EProcesso.CONCLUIDO);
        }
    }, [indiceConclusao, conclusoes]);

    if (ContextosReprovados(true)) {
        return <></>;
    }
    if (!conclusoes || !conclusoes.length) {
        return <></>;
    }
    return (
        <div className={styles.historias}>
            {paginaExecutor.historias.map((historiaI, indiceI) => {
                if (conclusoes[indiceI] && [EProcesso.PROCESSANDO, EProcesso.CONCLUIDO].includes(conclusoes[indiceI].processo)) {
                    return (
                        <div key={indiceI}>
                            <div className={styles.historias_texto}>
                                <TextosDatilografados
                                    textos={historiaI.textosHistoria}
                                    velocidade={velocidade}
                                    aoConcluir={() => FuncaoAoConcluirTexto()}
                                />
                            </div>
                            {MontarRetorno_Botao(conclusoes[indiceI])}
                            {MontarRetorno_Efeitos(conclusoes[indiceI], historiaI.efeitos!)}
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

    function MontarRetorno_Botao(conclusao: ITelaHistoriasConclusao) {
        if (conclusao.processoTexto !== EProcesso.CONCLUIDO && exibeBotao) {
            return (
                <div className={styles.historias_pularHistoria}>
                    <Botao aoClicar={() => PularHistoria()}>Pular História</Botao>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Efeitos(conclusao: ITelaHistoriasConclusao, efeitos: IEfeito[]) {
        if (conclusao.processoTexto === EProcesso.CONCLUIDO && conclusao.processoEfeito !== EProcesso._ZERO) {
            return (
                <div>
                    {efeitos?.map((efeitoI, indiceI) => {
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
        if (conclusoes[indiceConclusao]) {
            setConclusoes((prevConclusoes) => {
                return prevConclusoes.map((conclusaoI, indiceI) => {
                    if (indiceI === indiceConclusao) {
                        return { ...conclusaoI, processoTexto: EProcesso.CONCLUIDO, processoEfeito: EProcesso.INICIANDO };
                    }
                    return conclusaoI;
                });
            });
        }
    }
};

export default TelaHistorias;
