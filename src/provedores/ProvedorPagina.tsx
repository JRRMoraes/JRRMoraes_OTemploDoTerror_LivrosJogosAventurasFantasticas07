import { useRef, useState, MutableRefObject } from "react";
import {
    IPagina,
    ECampanhaCapitulo,
    EPaginaExecutorEstado,
    IHistoriaTextoExecucao,
    IHistoriaEfeitoExecucao,
    IEfeitoExecucao,
    IEfeitoInimigoExecucao,
    IInimigoExecucao,
    IAliadoExecucao,
    EResultadoCombate,
    IDestino,
    IDestinoExecucao,
    PAGINA_ZERADA,
} from "../tipos";
import { ContextoBasePagina } from "../contextos";
import { IChildrenProps, EProcesso } from "../uteis";
import { DieContainerRef } from "react-dice-complete/dist/DiceContainer";

export const ProvedorPagina = ({ children }: IChildrenProps) => {
    const [pagina, setPagina] = useState<IPagina>(null!);

    const [paginaEstado, setPaginaEstado] = useState<EPaginaExecutorEstado>(EPaginaExecutorEstado._NULO);
    const [paginaEhJogoCarregado, setPaginaEhJogoCarregado] = useState(false);
    const [paginaIdPaginaDestino, setPaginaIdPaginaDestino] = useState(PAGINA_ZERADA.idPagina);
    const [paginaIdCapituloDestino, setPaginaIdCapituloDestino] = useState<ECampanhaCapitulo>(PAGINA_ZERADA.idCapitulo);

    const [historiaTextos, setHistoriaTextos] = useState<IHistoriaTextoExecucao[]>([]);
    const [historiaEfeitos, setHistoriaEfeitos] = useState<IHistoriaEfeitoExecucao[]>([]);
    const [historiaImagens, setHistoriaImagens] = useState<string[]>([]);
    const [historiaProcesso, setHistoriaProcesso] = useState<EProcesso>(EProcesso._ZERO);
    const [historiaIndice, setHistoriaIndice] = useState(0);
    const [historiaProcessoIndice, setHistoriaProcessoIndice] = useState<EProcesso>(EProcesso._ZERO);
    const [combateInimigos, setCombateInimigos] = useState<IInimigoExecucao[]>([]);
    const [combateInimigosEfeitosAplicados, setCombateInimigosEfeitosAplicados] = useState<IEfeitoInimigoExecucao[]>([]);
    const [combateAliado, setCombateAliado] = useState<IAliadoExecucao>(null!);
    const [combateAliadoEfeitosAplicados, setCombateAliadoEfeitosAplicados] = useState<IEfeitoExecucao[]>([]);
    const [combateTextosDerrota, setCombateTextosDerrota] = useState<string[]>([]);
    const [combateAprovacaoDerrota, setCombateAprovacaoDerrota] = useState<string>("");
    const [combateMultiplo_2osApoio, setCombateMultiplo_2osApoio] = useState<boolean>(false);
    const [combateProcesso, setCombateProcesso] = useState<EProcesso>(EProcesso._ZERO);
    const [combateSerieDeAtaqueAtual, setCombateSerieDeAtaqueAtual] = useState(0);
    const [combateProcessoSerieDeAtaque, setCombateProcessoSerieDeAtaque] = useState<EProcesso>(EProcesso._ZERO);
    const [combateResultadoSerieDeAtaque, setCombateResultadoSerieDeAtaque] = useState<EResultadoCombate>(EResultadoCombate._COMBATENDO);
    const [combateResultadoFinal, setCombateResultadoFinal] = useState<EResultadoCombate>(EResultadoCombate._COMBATENDO);
    const [combateIdPaginaDestinoDerrota, setCombateIdPaginaDestinoDerrota] = useState(PAGINA_ZERADA.idPagina);
    const [combateDadosJogadorRef, setCombateDadosJogadorRef] = useState<MutableRefObject<DieContainerRef | null>[]>(CriarCombateDadosRef());
    const [combateDadosInimigoRef, setCombateDadosInimigoRef] = useState<MutableRefObject<DieContainerRef | null>[]>(CriarCombateDadosRef());
    const [combateDadosSorteRef, setCombateDadosSorteRef] = useState<MutableRefObject<DieContainerRef | null>[]>(CriarCombateDadosRef());

    const [destinoItens, setDestinoItens] = useState<IDestinoExecucao[]>([]);
    const [destinoProcesso, setDestinoProcesso] = useState<EProcesso>(EProcesso._ZERO);
    const [destinoProcessoRolagem, setDestinoProcessoRolagem] = useState<EProcesso>(EProcesso._ZERO);
    const [destinoRolagemTotal, setDestinoRolagemTotal] = useState(0);
    const [destinoRolagemDestino, setDestinoRolagemDestino] = useState<IDestino>(null!);
    const [destinoDadosRef, setDestinoDadosRef] = useState<MutableRefObject<DieContainerRef | null>>(useRef<DieContainerRef>(null));

    return (
        <ContextoBasePagina.Provider
            value={{
                pagina,
                setPagina,
                paginaEstado,
                setPaginaEstado,
                paginaEhJogoCarregado,
                setPaginaEhJogoCarregado,
                paginaIdPaginaDestino,
                setPaginaIdPaginaDestino,
                paginaIdCapituloDestino,
                setPaginaIdCapituloDestino,
                historiaTextos,
                setHistoriaTextos,
                historiaEfeitos,
                setHistoriaEfeitos,
                historiaImagens,
                setHistoriaImagens,
                historiaProcesso,
                setHistoriaProcesso,
                historiaIndice,
                setHistoriaIndice,
                historiaProcessoIndice,
                setHistoriaProcessoIndice,
                combateInimigos,
                setCombateInimigos,
                combateInimigosEfeitosAplicados,
                setCombateInimigosEfeitosAplicados,
                combateAliado,
                setCombateAliado,
                combateAliadoEfeitosAplicados,
                setCombateAliadoEfeitosAplicados,
                combateTextosDerrota,
                setCombateTextosDerrota,
                combateAprovacaoDerrota,
                setCombateAprovacaoDerrota,
                combateMultiplo_2osApoio,
                setCombateMultiplo_2osApoio,
                combateProcesso,
                setCombateProcesso,
                combateSerieDeAtaqueAtual,
                setCombateSerieDeAtaqueAtual,
                combateProcessoSerieDeAtaque,
                setCombateProcessoSerieDeAtaque,
                combateResultadoSerieDeAtaque,
                setCombateResultadoSerieDeAtaque,
                combateResultadoFinal,
                setCombateResultadoFinal,
                combateIdPaginaDestinoDerrota,
                setCombateIdPaginaDestinoDerrota,
                combateDadosJogadorRef,
                setCombateDadosJogadorRef,
                combateDadosInimigoRef,
                setCombateDadosInimigoRef,
                combateDadosSorteRef,
                setCombateDadosSorteRef,
                destinoItens,
                setDestinoItens,
                destinoProcesso,
                setDestinoProcesso,
                destinoProcessoRolagem,
                setDestinoProcessoRolagem,
                destinoRolagemTotal,
                setDestinoRolagemTotal,
                destinoRolagemDestino,
                setDestinoRolagemDestino,
                destinoDadosRef,
                setDestinoDadosRef,
            }}
        >
            {children}
        </ContextoBasePagina.Provider>
    );

    function CriarCombateDadosRef() {
        const _combateDadosRef: MutableRefObject<DieContainerRef | null>[] = [];
        for (var dadoI = 1; dadoI <= 10; dadoI++) {
            _combateDadosRef.push(useRef<DieContainerRef>(null));
        }
        return _combateDadosRef;
    }
};

export default ProvedorPagina;
