import styles from "./TelaHistorias.module.scss";
import { useState, useEffect } from "react";
import {
    IPagina,
    IHistoria,
    IEfeito,
    PAGINA_ZERADA,
    HISTORIA_ZERADA,
} from "../tipos";
import { ContextoJogos } from "../contextos";
import { Botao } from "../componentes";

interface ITelaHistoriasProps {
    paginaAtual: IPagina;
}

interface IEstadoTelaHistorias {
    processando: boolean;
    concluido: boolean;
    idPagina: number;
}

export const TelaHistorias = ({ paginaAtual }: ITelaHistoriasProps) => {
    if (!paginaAtual || !paginaAtual.historias || !paginaAtual.historias.length)
        return;

    const { jogoAtual } = ContextoJogos();
    if (!jogoAtual) return <></>;

    const [historias, setHistorias] = useState<IHistoria[]>([]);

    let indiceHistoria: number;
    let indiceTexto: number;
    let indiceTextoChar: number;
    let indiceEfeito: number;
    let indiceEfeitoChar: number;
    let tempo: number;
    let timer: NodeJS.Timeout;

    const [estado, setEstado] = useState<IEstadoTelaHistorias>({
        processando: false,
        concluido: false,
        idPagina: PAGINA_ZERADA.idPagina,
    });

    function HistoriaAtual() {
        if (paginaAtual.historias[indiceHistoria]) {
            return paginaAtual.historias[indiceHistoria];
        } else {
            return HISTORIA_ZERADA;
        }
    }

    function IncrementarHistoriaTextoDoIndice(char: string) {
        //setHistorias(
        //    [...historias].map((historiaI, indiceI) => {
        //        if (indiceI === indiceHistoria)
        //            historiaI.textos[indiceTexto] += char;
        //        return historiaI;
        //     })
        // );

        historias[indiceHistoria].textos[indiceTexto] += char;
        //setHistorias([...historias]);
    }

    function IncrementarHistoriaEfeitoDoIndice(char: string) {
        setHistorias(
            [...historias].map((historiaI, indiceI) => {
                if (indiceI === indiceHistoria) {
                    if (!historiaI.efeitos) {
                        historiaI.efeitos![indiceEfeito].texto += char;
                    }
                }
                return historiaI;
            })
        );
    }

    function FinalizarHistoria() {
        tempo = 4;
        clearInterval(timer);
        timer = setInterval(() => {
            Datilografar();
        }, tempo);
    }

    function ExecutarDatilografia() {
        if (estado.processando) return <></>;
        setEstado({ ...estado, processando: true });
        indiceHistoria = 0;
        indiceTexto = 0;
        indiceTextoChar = -1;
        indiceEfeito = 0;
        indiceEfeitoChar = -1;
        tempo = 20;
        timer = setInterval(() => {
            Datilografar();
        }, tempo);
        return <></>;
    }

    function Datilografar() {
        while (indiceHistoria < paginaAtual.historias.length) {
            if (!historias[indiceHistoria]) return;
            if (HistoriaAtual().textos) {
                while (indiceTexto < HistoriaAtual().textos.length) {
                    if (!historias[indiceHistoria].textos[indiceTexto])
                        historias[indiceHistoria].textos = [
                            ...historias[indiceHistoria].textos,
                            "",
                        ];
                    indiceTextoChar++;
                    if (
                        indiceTextoChar <
                        HistoriaAtual().textos[indiceTexto].length
                    ) {
                        IncrementarHistoriaTextoDoIndice(
                            HistoriaAtual().textos[indiceTexto][indiceTextoChar]
                        );
                    } else {
                        indiceTextoChar = -1;
                        indiceTexto++;
                    }
                }
            }

            if (HistoriaAtual().efeitos) {
                while (indiceEfeito < HistoriaAtual().efeitos!.length) {
                    if (!historias[indiceHistoria].efeitos![indiceEfeito])
                        historias[indiceHistoria].efeitos = [
                            ...historias[indiceHistoria].efeitos!,
                            {
                                texto: "",
                                sobre: HistoriaAtual().efeitos![indiceEfeito]
                                    .sobre,
                                valor: HistoriaAtual().efeitos![indiceEfeito]
                                    .valor,
                            },
                        ];
                    indiceEfeitoChar++;
                    if (
                        indiceEfeitoChar <
                        HistoriaAtual().efeitos![indiceEfeito].texto.length
                    ) {
                        IncrementarHistoriaEfeitoDoIndice(
                            HistoriaAtual().efeitos![indiceEfeito].texto[
                                indiceEfeitoChar
                            ]
                        );
                    } else {
                        indiceEfeitoChar = -1;
                        indiceEfeito++;
                    }
                }
            }

            indiceHistoria++;
            if (indiceHistoria >= paginaAtual.historias.length) {
                clearInterval(timer);
                setEstado({ ...estado, concluido: true });
            }
        }
    }

    function TestarReinicio() {
        let idPaginaL = PAGINA_ZERADA.idPagina;
        if (paginaAtual && paginaAtual.idPagina >= 0)
            idPaginaL = paginaAtual.idPagina;
        if (estado.idPagina !== idPaginaL) Reiniciar(idPaginaL);
        return <></>;
    }

    function Reiniciar(idPagina: number) {
        clearInterval(timer);
        setHistorias([]);
        if (paginaAtual && paginaAtual.historias)
            setHistorias(paginaAtual.historias);

        //    paginaAtual.historias.forEach((historiaI, indiceI) => {
        //        setHistorias((prevHistorias) => [
        //            ...prevHistorias,
        //            HISTORIA_ZERADA,
        //        ]);
        //    });
        setEstado({
            ...estado,
            processando: false,
            concluido: false,
            idPagina: idPagina,
        });
    }

    //   useEffect(() => {
    //       TestarReinicio();
    //      Datilografar();
    //return () => {
    //    clearInterval(timer);
    //};
    //  }, []);

    function MontarRetorno_Textos() {
        return (
            <div>
                {
                    !historias.map((historiaI: IHistoria) => {
                        historiaI.textos?.map((textoI: string) => {
                            return (
                                <>
                                    {"a1"}
                                    <p className={styles.historias_texto}>
                                        {textoI + "     a2"}
                                    </p>
                                </>
                            );
                        });
                    })
                }
            </div>
        );
    }

    function MontarRetorno_Efeitos() {
        return (
            <div>
                {
                    !historias.map((historiaI: IHistoria) => {
                        historiaI.efeitos?.map((efeitoI: IEfeito) => {
                            return (
                                <div className={styles.historias_efeito}>
                                    <h5>{efeitoI.texto}</h5>
                                    <h6>
                                        {efeitoI.valor + "  " + efeitoI.sobre}
                                    </h6>
                                </div>
                            );
                        });
                    })
                }
            </div>
        );
    }

    function MontarRetorno() {
        TestarReinicio();
        //ExecutarDatilografia();
        if (!historias || !historias.length) return <></>;
        return (
            <div>
                aaaa
                {MontarRetorno_Textos()}
                bbbb
                {MontarRetorno_Efeitos()}
                cccc
                {
                    !historias?.map((historiaI: IHistoria) => {
                        historiaI.textos?.map(
                            (textoI: string, indiceI: number) => {
                                {
                                    console.log("aaaaa " + textoI);
                                }
                                return (
                                    <p key={indiceI}>{textoI + "   a333"}</p>
                                );
                            }
                        );
                    })
                }
                <Botao aoClicar={() => FinalizarHistoria()}>Todo texto</Botao>
            </div>
        );
    }

    return <>{MontarRetorno()}</>;
};

export default TelaHistorias;
