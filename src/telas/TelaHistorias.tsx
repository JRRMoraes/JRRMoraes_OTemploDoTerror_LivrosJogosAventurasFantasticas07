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
    const { jogoAtual, paginaCampanha, setPaginaCampanha, AplicarEfeitosDaHistoria } = ContextoJogos();

    const VELOCIDADES = { normal: 20, rapido: 1 };
    const [velocidade, setVelocidade] = useState(VELOCIDADES.normal);
    const [exibeBotao, setExibeBotao] = useState(true);

    const [conclusoes, setConclusoes] = useState<ITelaHistoriasConclusao[]>([]);
    const [indiceConclusao, setIndiceConclusao] = useState(0);
    const [todosConcluidos, setTodosConcluidos] = useState(false);

    useEffect(() => {
        if (!jogoAtual || !paginaCampanha || !paginaCampanha.historias || !paginaCampanha.historias.length) {
            setIndiceConclusao(0);
            setConclusoes([]);
            setTodosConcluidos(false);
            setVelocidade(VELOCIDADES.normal);
            setExibeBotao(true);
        } else if (paginaCampanha.historias.length && (!conclusoes || !conclusoes.length)) {
            if (paginaCampanha.ehJogoCarregado) {
                setVelocidade(VELOCIDADES.rapido);
                setExibeBotao(false);
            }
            paginaCampanha.historias.forEach((historiaI, indiceI) => {
                setConclusoes((prevConclusoes) => {
                    return [
                        ...prevConclusoes,
                        {
                            processo: EProcesso._ZERO,
                            processoTexto: EProcesso._ZERO,
                            processoEfeito: paginaCampanha.ehJogoCarregado ? EProcesso.CONCLUIDO : EProcesso._ZERO,
                        },
                    ];
                });
            });
        }
    }, [paginaCampanha, conclusoes]);

    useEffect(() => {
        if (!jogoAtual || !paginaCampanha || !paginaCampanha.historias || !paginaCampanha.historias.length || !conclusoes || !conclusoes.length) {
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
                            !paginaCampanha.ehJogoCarregado &&
                            paginaCampanha.estado === EPaginaCampanhaEstado.HISTORIAS &&
                            paginaCampanha.historias[indiceConclusao].efeitos &&
                            paginaCampanha.historias[indiceConclusao].efeitos.length
                        ) {
                            AplicarEfeitosDaHistoria(paginaCampanha.historias[indiceConclusao].efeitos);
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
            setTodosConcluidos(true);
        }
    }, [indiceConclusao, conclusoes]);

    useEffect(() => {
        if (todosConcluidos && paginaCampanha.estado === EPaginaCampanhaEstado.HISTORIAS) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, estado: EPaginaCampanhaEstado.DESTINOS };
            });
        }
    }, [todosConcluidos, paginaCampanha]);

    if (!jogoAtual) {
        return <></>;
    }
    if (!paginaCampanha || !paginaCampanha.historias || !paginaCampanha.historias.length) {
        return <></>;
    }
    if (!conclusoes || !conclusoes.length) {
        return <></>;
    }
    return <>{MontarRetorno()}</>;

    function MontarRetorno() {
        return (
            <div className={styles.historias}>
                {paginaCampanha.historias.map((historiaI, indiceI) => {
                    if (conclusoes[indiceI] && [EProcesso.PROCESSANDO, EProcesso.CONCLUIDO].includes(conclusoes[indiceI].processo)) {
                        return (
                            <div key={indiceI}>
                                <TextosDatilografados
                                    textos={historiaI.textos}
                                    velocidade={velocidade}
                                    aoConcluir={() => FuncaoAoConcluirTexto()}
                                />
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
    }

    function MontarRetorno_Botao(conclusao: ITelaHistoriasConclusao) {
        if (conclusao.processoTexto !== EProcesso.CONCLUIDO && exibeBotao) {
            return <Botao aoClicar={() => FinalizarHistoria()}>Finalizar história</Botao>;
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Efeitos(conclusao: ITelaHistoriasConclusao, efeitos: IEfeito[]) {
        if (conclusao.processoTexto === EProcesso.CONCLUIDO && conclusao.processoEfeito !== EProcesso._ZERO) {
            return (
                <div>
                    {efeitos?.map((efeitoI, indiceI) => {
                        return (
                            <div
                                key={indiceI}
                                className={styles.historias_efeito}
                            >
                                <h5>{efeitoI.texto}</h5>
                                <h6>{efeitoI.valor + "  " + efeitoI.sobre}</h6>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <></>;
        }
    }

    function FinalizarHistoria() {
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
