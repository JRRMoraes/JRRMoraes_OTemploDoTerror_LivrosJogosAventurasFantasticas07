import { useEffect, useState } from "react";
import { ContextoJogos } from "../contextos";
import { Botao } from "../componentes";
import { PAGINA_ZERADA } from "../tipos";

export const TelaDestinos = () => {
    const { jogoAtual, setJogoAtual, paginaCampanha, setPaginaCampanha } = ContextoJogos();

    const [paginaDestino, setPaginaDestino] = useState(PAGINA_ZERADA.idPagina);

    function MontarRetorno_Destinos() {
        return (
            <div>
                {paginaCampanha.destinos.map((destinoI, indiceI) => {
                    if (destinoI.funcao) {
                        return (
                            <div key={indiceI}>
                                <Botao aoClicar={() => destinoI.funcao()}>{destinoI.destino + " - " + destinoI.idPagina}</Botao>
                            </div>
                        );
                    } else {
                        return <div key={indiceI}>{destinoI.destino + " - " + destinoI.idPagina}</div>;
                    }
                })}
            </div>
        );
    }

    useEffect(() => {
        if (!jogoAtual || !paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
            setPaginaDestino(PAGINA_ZERADA.idPagina);
        } else if (paginaCampanha.destinos.length) {
            paginaCampanha.destinos.forEach((destinoI, indiceI) => {
                paginaCampanha.destinos[indiceI].funcao = () => {
                    setPaginaDestino(paginaCampanha.destinos[indiceI].idPagina);
                };
            });
        }
    }, [jogoAtual, paginaCampanha]);

    useEffect(() => {
        if (!jogoAtual || !paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
            return;
        }
        if (paginaDestino === PAGINA_ZERADA.idPagina) {
            return;
        } else {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, estado: "" };
            });
            setJogoAtual((prevJogoAtual) => {
                return { ...prevJogoAtual, campanhaIndice: paginaDestino };
            });
        }
    }, [paginaCampanha, paginaDestino]);

    if (!jogoAtual) {
        return <></>;
    }
    if (!paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
        return <></>;
    }
    return <div>{MontarRetorno_Destinos()}</div>;
};

export default TelaDestinos;
