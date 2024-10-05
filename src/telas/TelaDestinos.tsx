import { useEffect } from "react";
import { ContextoJogos } from "../contextos";
import { Botao } from "../componentes";

export const TelaDestinos = () => {
    const { jogoAtual, setJogoAtual, paginaCampanha } = ContextoJogos();

    function CriarFuncoesDosDestinos() {
        if (!paginaCampanha.destinos) {
            return;
        }
        paginaCampanha.destinos.forEach((destinoI) => {
            destinoI.funcao = () => {
                setJogoAtual((prevJogoAtual) => {
                    return { ...prevJogoAtual, campanhaIndice: destinoI.idPagina };
                });
            };
        });
    }

    function MontarRetorno_Destinos() {
        return (
            <div>
                {paginaCampanha.destinos.map((destinoI, indiceI) => {
                    if (destinoI.funcao) {
                        return (
                            <div key={indiceI}>
                                <Botao aoClicar={() => destinoI.funcao()}>{destinoI.destino}</Botao>
                            </div>
                        );
                    } else {
                        return <></>;
                    }
                })}
            </div>
        );
    }

    useEffect(() => {
        CriarFuncoesDosDestinos();
    }, [paginaCampanha]);

    if (!jogoAtual) {
        return <></>;
    }
    if (!paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
        return <></>;
    }
    return <div>{MontarRetorno_Destinos()}</div>;
};

export default TelaDestinos;
