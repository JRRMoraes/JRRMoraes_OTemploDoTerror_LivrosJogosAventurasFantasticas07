import styles from "./TelaHistorias.module.scss";
import { useState, useEffect } from "react";
import { IEfeito } from "../tipos";
import { ContextoJogos } from "../contextos";
import { Botao, TextosDatilografados } from "../componentes";

interface ITelaHistoriasConclusao {
    visivel: boolean;
    concluido: boolean;
    aoConcluir: () => void;
}

export const TelaHistorias = () => {
    const { jogoAtual, paginaCampanha, setPaginaCampanha } = ContextoJogos();

    const VELOCIDADES = { normal: 20, rapido: 2 };
    const [velocidade, setVelocidade] = useState(VELOCIDADES.normal);

    const [conclusoes, setConclusoes] = useState<ITelaHistoriasConclusao[]>([]);
    const [concluidor, setConcluidor] = useState(-1);
    const [todosConcluidos, setTodosConcluidos] = useState(false);

    function MontarRetorno() {
        return (
            <div className={styles.historias}>
                {paginaCampanha.historias.map((historiaI, indiceI) => {
                    if (conclusoes[indiceI] && conclusoes[indiceI].visivel) {
                        if (conclusoes[indiceI].concluido) {
                            return (
                                <div key={indiceI}>
                                    <TextosDatilografados
                                        textos={historiaI.textos}
                                        velocidade={velocidade}
                                        aoConcluir={() => conclusoes[indiceI].aoConcluir()}
                                    />
                                    {MontarRetorno_Efeitos(historiaI.efeitos!)}
                                </div>
                            );
                        } else {
                            return (
                                <div key={indiceI}>
                                    <TextosDatilografados
                                        textos={historiaI.textos}
                                        velocidade={velocidade}
                                        aoConcluir={() => conclusoes[indiceI].aoConcluir()}
                                    />
                                    <Botao aoClicar={() => FinalizarHistoria()}>Finalizar história</Botao>
                                </div>
                            );
                        }
                    } else {
                        return <></>;
                    }
                })}
            </div>
        );
    }

    function MontarRetorno_Efeitos(efeitos: IEfeito[]) {
        return (
            <div>
                {efeitos?.map((efeitoI, indiceI) => {
                    if (!paginaCampanha.ehJogoCarregado && paginaCampanha.estado === "HISTORIAS") {
                        //setJogoAtual  Panilha + efeito
                    }
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
    }

    function FinalizarHistoria() {
        setVelocidade(VELOCIDADES.rapido);
    }

    useEffect(() => {
        if (!jogoAtual || !paginaCampanha || !paginaCampanha.historias || !paginaCampanha.historias.length) {
            setConcluidor(-1);
            setConclusoes([]);
            setTodosConcluidos(false);
            setVelocidade(VELOCIDADES.normal);
        } else if (paginaCampanha.historias.length && (!conclusoes || !conclusoes.length)) {
            paginaCampanha.historias.forEach((historiaI, indiceI) => {
                setConclusoes((prevConclusoes) => {
                    return [
                        ...prevConclusoes,
                        {
                            visivel: indiceI === 0,
                            concluido: false,
                            aoConcluir: () => {
                                setConcluidor(indiceI);
                            },
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
        if (concluidor === -1) {
            return;
        }
        if (conclusoes[concluidor]) {
            conclusoes[concluidor].visivel = true;
            conclusoes[concluidor].concluido = true;
            if (conclusoes[concluidor + 1]) {
                conclusoes[concluidor + 1].visivel = true;
            } else {
                setTodosConcluidos(true);
            }
            setConcluidor(-1);
        }
    }, [concluidor]);

    useEffect(() => {
        if (todosConcluidos && paginaCampanha.estado === "HISTORIAS") {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, estado: "DESTINOS" };
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
};

export default TelaHistorias;
