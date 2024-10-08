import { useState, useEffect } from "react";
import { ContextoJogos } from "../contextos";
import { Botao } from "../componentes";
import { PAGINA_ZERADA } from "../tipos";
import { EProcesso } from "../uteis";

export const TelaDestinos = () => {
    const { jogoAtual, paginaCampanha, ImporPaginaCampanhaEJogoAtualViaDestino, SalvarJogoAtualNoSalvo } = ContextoJogos();

    const [salvando, setSalvando] = useState(EProcesso.AGUARDANDO);

    function MontarRetorno() {
        switch (salvando) {
            case EProcesso.AGUARDANDO:
                setSalvando(EProcesso.INICIANDO);
                return <></>;
            case (EProcesso.INICIANDO, EProcesso.PROCESSANDO):
                return <>{MontarRetorno_SalvarJogoAtual()}</>;
            case EProcesso.CONCLUIDO:
                return <>{MontarRetorno_Destinos()}</>;
            default:
                return <></>;
        }
    }

    function MontarRetorno_SalvarJogoAtual() {
        return <div>SALVANDO JOGO</div>;
    }

    function MontarRetorno_Destinos() {
        return (
            <div>
                {paginaCampanha.destinos.map((destinoI, indiceI) => {
                    return (
                        <div key={indiceI}>
                            <Botao aoClicar={() => destinoI.funcao()}>{destinoI.destino + " - " + destinoI.idPagina}</Botao>
                        </div>
                    );
                })}
            </div>
        );
    }

    useEffect(() => {
        if (!jogoAtual || !paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
            return;
        }
        if (paginaCampanha.idPaginaDestino === PAGINA_ZERADA.idPagina) {
            return;
        } else {
            ImporPaginaCampanhaEJogoAtualViaDestino(paginaCampanha.idPaginaDestino);
        }
    }, [paginaCampanha]);

    useEffect(() => {
        if (salvando === EProcesso.INICIANDO) {
            if (!paginaCampanha.ehJogoCarregado) {
                setSalvando(EProcesso.PROCESSANDO);
                SalvarJogoAtualNoSalvo();
                setTimeout(() => {
                    setSalvando(EProcesso.CONCLUIDO);
                }, 2000);
            } else {
                setSalvando(EProcesso.CONCLUIDO);
            }
        }
    }, [salvando]);

    if (!jogoAtual) {
        return <></>;
    }
    if (!paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
        return <></>;
    }
    if (paginaCampanha.estado !== "DESTINOS") {
        return <></>;
    }
    return <div>{MontarRetorno()}</div>;
};

export default TelaDestinos;
