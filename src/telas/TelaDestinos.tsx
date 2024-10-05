import { useEffect, useState } from "react";
import { ContextoJogos } from "../contextos";
import { IDestino, IPagina, PAGINA_ZERADA } from "../tipos";
import { Botao } from "../componentes";

interface ITelaHistoriasProps {
    paginaAtual: IPagina;
}

export const TelaDestinos = ({ paginaAtual }: ITelaHistoriasProps) => {
    const { jogoAtual, setJogoAtual } = ContextoJogos();
    const [idPagina, setIdPagina] = useState(PAGINA_ZERADA.idPagina);
    const [destinos, setDestinos] = useState<IDestino[]>([]);

    function CriarFuncoesDosDestinos() {
        setDestinos(paginaAtual.destinos);
        destinos.forEach((destinoI) => {
            destinoI.funcao = () => {
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.campanhaIndice = destinoI.idPagina;
                    return prevJogoAtual;
                });
            };
        });
    }

    function MontarRetorno_Destinos() {
        return (
            <div>
                {destinos.map((destinoI, indiceI) => {
                    if (destinoI.funcao) {
                        return (
                            <div key={indiceI}>
                                <Botao aoClicar={() => destinoI.funcao!()}>{destinoI.destino}</Botao>
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
    }, [paginaAtual]);

    if (!jogoAtual) return <></>;
    if (!paginaAtual || !paginaAtual.destinos || !paginaAtual.destinos.length) return <></>;
    return <div>{MontarRetorno_Destinos()}</div>;
};

export default TelaDestinos;
