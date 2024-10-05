import styles from "./TelaHistorias.module.scss";
import { useState, useEffect } from "react";
import { IPagina, IHistoria, IEfeito, PAGINA_ZERADA, HISTORIA_ZERADA } from "../tipos";
import { ContextoJogos } from "../contextos";
import { Botao } from "../componentes";

interface ITelaHistoriasProps {
    paginaAtual: IPagina;
}

export const TelaHistorias = ({ paginaAtual }: ITelaHistoriasProps) => {
    const { jogoAtual } = ContextoJogos();
    const [idPagina, setIdPagina] = useState(PAGINA_ZERADA.idPagina);
    const [historias, setHistorias] = useState<IHistoria[]>([]);
    const [concluido, setConcluido] = useState(false);
    const TEMPO_CHAR = { normal: 20, rapido: 2 };
    const TEMPO_TEXTO = { normal: 100, rapido: 10 };
    const [tempoChar, setTempoChar] = useState(TEMPO_CHAR.normal);
    const [tempoTexto, setTempoTexto] = useState(TEMPO_TEXTO.normal);
    const [indiceHistoria, setIndiceHistoria] = useState(0);
    const [indiceTexto, setIndiceTexto] = useState(0);
    const [indiceTextoChar, setIndiceTextoChar] = useState(0);
    const [indiceEfeito, setIndiceEfeito] = useState(0);
    const [indiceEfeitoChar, setIndiceEfeitoChar] = useState(0);

    function HistoriaAtual(): IHistoria {
        if (paginaAtual.historias[indiceHistoria]) {
            return paginaAtual.historias[indiceHistoria];
        } else {
            return HISTORIA_ZERADA;
        }
    }

    function IncrementarHistoriaTextoDoIndice(char: string) {
        if (!historias[indiceHistoria].textos[indiceTexto]) {
            historias[indiceHistoria].textos = [...historias[indiceHistoria].textos, ""];
        }
        historias[indiceHistoria].textos[indiceTexto] += char;
    }

    function IncrementarHistoriaEfeitoDoIndice(char: string) {
        if (!historias[indiceHistoria].efeitos![indiceEfeito]) {
            historias[indiceHistoria].efeitos = [
                ...historias[indiceHistoria].efeitos!,
                {
                    texto: "",
                    sobre: HistoriaAtual().efeitos![indiceEfeito].sobre,
                    valor: HistoriaAtual().efeitos![indiceEfeito].valor,
                },
            ];
        }
        historias[indiceHistoria].efeitos![indiceEfeito].texto += char;
    }

    function TestarReinicio() {
        let idPaginaL = PAGINA_ZERADA.idPagina;
        if (paginaAtual && paginaAtual.idPagina >= 0) idPaginaL = paginaAtual.idPagina;
        if (idPagina !== idPaginaL) Reiniciar(idPaginaL);
    }

    function Reiniciar(idPagina: number) {
        setIdPagina(idPagina);
        setHistorias([]);
        setConcluido(false);
        setTempoChar(TEMPO_CHAR.normal);
        setTempoTexto(TEMPO_TEXTO.normal);
        setIndiceHistoria(0);
        setIndiceTexto(0);
        setIndiceTextoChar(0);
        setIndiceEfeito(0);
        setIndiceEfeitoChar(0);
    }

    function MontarRetorno_Textos() {
        return (
            <div>
                {historias.map((historiaI: IHistoria) => {
                    return historiaI.textos?.map((textoI: string) => {
                        return <p className={styles.historias_texto}>{textoI}</p>;
                    });
                })}
            </div>
        );
    }

    function MontarRetorno_Efeitos() {
        return (
            <div>
                {historias.map((historiaI: IHistoria) => {
                    return historiaI.efeitos?.map((efeitoI: IEfeito) => {
                        return (
                            <div className={styles.historias_efeito}>
                                <h5>{efeitoI.texto}</h5>
                                <h6>{efeitoI.valor + "  " + efeitoI.sobre}</h6>
                            </div>
                        );
                    });
                })}
            </div>
        );
    }

    function MontarRetorno_BotaoFinalizarHistoria() {
        if (!concluido) {
            return (
                <div className={styles.historias_finalizarHistoria}>
                    <Botao aoClicar={() => FinalizarHistoria()}>Finalizar história</Botao>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function FinalizarHistoria() {
        setTempoChar(TEMPO_CHAR.rapido);
        setTempoTexto(TEMPO_TEXTO.rapido);
    }

    useEffect(() => {
        if (!jogoAtual) return;
        if (!paginaAtual || !paginaAtual.historias || !paginaAtual.historias.length) return;

        //TestarReinicio();
        if (indiceHistoria >= paginaAtual.historias.length) {
            setConcluido(true);
            return;
        }
        if (!historias[indiceHistoria]) {
            setHistorias((prevHistorias) => [...prevHistorias, HISTORIA_ZERADA]);
        }

        function Datilografar() {
            if (HistoriaAtual().textos && indiceTexto < HistoriaAtual().textos.length) {
                if (indiceTextoChar < HistoriaAtual().textos[indiceTexto].length) {
                    IncrementarHistoriaTextoDoIndice(HistoriaAtual().textos[indiceTexto][indiceTextoChar]);
                    setIndiceTextoChar((prevIndiceTextoChar) => prevIndiceTextoChar + 1);
                } else {
                    setTimeout(() => {
                        setIndiceTexto((prevIndiceTexto) => prevIndiceTexto + 1);
                        setIndiceTextoChar(0);
                    }, tempoTexto);
                }
            } else if (HistoriaAtual().efeitos && indiceEfeito < HistoriaAtual().efeitos!.length) {
                if (indiceEfeitoChar < HistoriaAtual().efeitos![indiceEfeito].texto.length) {
                    IncrementarHistoriaEfeitoDoIndice(HistoriaAtual().efeitos![indiceEfeito].texto[indiceEfeitoChar]);
                    setIndiceEfeitoChar((prevIndiceEfeitoChar) => prevIndiceEfeitoChar + 1);
                } else {
                    setTimeout(() => {
                        setIndiceEfeito((prevIndiceEfeito) => prevIndiceEfeito + 1);
                        setIndiceEfeitoChar(0);
                    }, tempoTexto);
                }
            } else {
                setIndiceHistoria((prevIndiceHistoria) => prevIndiceHistoria + 1);
            }
        }

        const timer = setTimeout(Datilografar, tempoChar);
        return () => clearTimeout(timer);
    }, [jogoAtual, paginaAtual, historias, indiceHistoria, indiceTexto, indiceTextoChar, indiceEfeito, indiceEfeitoChar, tempoTexto, tempoChar]);

    if (!jogoAtual) return <></>;
    if (!paginaAtual || !paginaAtual.historias || !paginaAtual.historias.length) return <></>;
    if (!historias || !historias.length) return <></>;
    return (
        <div className={styles.historias}>
            {MontarRetorno_Textos()}
            {MontarRetorno_Efeitos()}
            {MontarRetorno_BotaoFinalizarHistoria()}
        </div>
    );
};

export default TelaHistorias;
