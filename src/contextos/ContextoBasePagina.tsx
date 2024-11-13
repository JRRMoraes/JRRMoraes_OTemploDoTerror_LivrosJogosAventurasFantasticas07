import { createContext, Dispatch, SetStateAction, MutableRefObject } from "react";
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
} from "../tipos";
import { EProcesso } from "../uteis";
import { DieContainerRef } from "react-dice-complete/dist/DiceContainer";

export type TContextoBasePagina = {
    pagina: IPagina;
    setPagina: Dispatch<SetStateAction<IPagina>>;
    paginaEstado: EPaginaExecutorEstado;
    setPaginaEstado: Dispatch<SetStateAction<EPaginaExecutorEstado>>;
    paginaEhJogoCarregado: boolean;
    setPaginaEhJogoCarregado: Dispatch<SetStateAction<boolean>>;
    paginaIdPaginaDestino: number;
    setPaginaIdPaginaDestino: Dispatch<SetStateAction<number>>;
    paginaIdCapituloDestino: ECampanhaCapitulo;
    setPaginaIdCapituloDestino: Dispatch<SetStateAction<ECampanhaCapitulo>>;
    historiaTextos: IHistoriaTextoExecucao[];
    setHistoriaTextos: Dispatch<SetStateAction<IHistoriaTextoExecucao[]>>;
    historiaEfeitos: IHistoriaEfeitoExecucao[];
    setHistoriaEfeitos: Dispatch<SetStateAction<IHistoriaEfeitoExecucao[]>>;
    historiaImagens: string[];
    setHistoriaImagens: Dispatch<SetStateAction<string[]>>;
    historiaProcesso: EProcesso;
    setHistoriaProcesso: Dispatch<SetStateAction<EProcesso>>;
    historiaIndice: number;
    setHistoriaIndice: Dispatch<SetStateAction<number>>;
    historiaProcessoIndice: EProcesso;
    setHistoriaProcessoIndice: Dispatch<SetStateAction<EProcesso>>;
    combateInimigos: IInimigoExecucao[];
    setCombateInimigos: Dispatch<SetStateAction<IInimigoExecucao[]>>;
    combateInimigosEfeitosAplicados: IEfeitoInimigoExecucao[];
    setCombateInimigosEfeitosAplicados: Dispatch<SetStateAction<IEfeitoInimigoExecucao[]>>;
    combateAliado: IAliadoExecucao;
    setCombateAliado: Dispatch<SetStateAction<IAliadoExecucao>>;
    combateAliadoEfeitosAplicados: IEfeitoExecucao[];
    setCombateAliadoEfeitosAplicados: Dispatch<SetStateAction<IEfeitoExecucao[]>>;
    combateProcesso: EProcesso;
    setCombateProcesso: Dispatch<SetStateAction<EProcesso>>;
    combateTextosDerrota: string[];
    setCombateTextosDerrota: Dispatch<SetStateAction<string[]>>;
    combateAprovacaoDerrota: string;
    setCombateAprovacaoDerrota: Dispatch<SetStateAction<string>>;
    combateMultiplo_2osApoio: boolean;
    setCombateMultiplo_2osApoio: Dispatch<SetStateAction<boolean>>;
    combateSerieDeAtaqueAtual: number;
    setCombateSerieDeAtaqueAtual: Dispatch<SetStateAction<number>>;
    combateProcessoSerieDeAtaque: EProcesso;
    setCombateProcessoSerieDeAtaque: Dispatch<SetStateAction<EProcesso>>;
    combateResultadoSerieDeAtaque: EResultadoCombate;
    setCombateResultadoSerieDeAtaque: Dispatch<SetStateAction<EResultadoCombate>>;
    combateResultadoFinal: EResultadoCombate;
    setCombateResultadoFinal: Dispatch<SetStateAction<EResultadoCombate>>;
    combateIdPaginaDestinoDerrota: number;
    setCombateIdPaginaDestinoDerrota: Dispatch<SetStateAction<number>>;
    combateDadosJogadorRef: MutableRefObject<DieContainerRef | null>[];
    setCombateDadosJogadorRef: Dispatch<SetStateAction<MutableRefObject<DieContainerRef | null>[]>>;
    combateDadosInimigoRef: MutableRefObject<DieContainerRef | null>[];
    setCombateDadosInimigoRef: Dispatch<SetStateAction<MutableRefObject<DieContainerRef | null>[]>>;
    combateDadosSorteRef: MutableRefObject<DieContainerRef | null>[];
    setCombateDadosSorteRef: Dispatch<SetStateAction<MutableRefObject<DieContainerRef | null>[]>>;
    destinoItens: IDestinoExecucao[];
    setDestinoItens: Dispatch<SetStateAction<IDestinoExecucao[]>>;
    destinoProcesso: EProcesso;
    setDestinoProcesso: Dispatch<SetStateAction<EProcesso>>;
    destinoProcessoRolagem: EProcesso;
    setDestinoProcessoRolagem: Dispatch<SetStateAction<EProcesso>>;
    destinoRolagemTotal: number;
    setDestinoRolagemTotal: Dispatch<SetStateAction<number>>;
    destinoRolagemDestino: IDestino;
    setDestinoRolagemDestino: Dispatch<SetStateAction<IDestino>>;
    destinoDadosRef: MutableRefObject<DieContainerRef | null>;
    setDestinoDadosRef: Dispatch<SetStateAction<MutableRefObject<DieContainerRef | null>>>;
};

export const ContextoBasePagina = createContext<TContextoBasePagina>(null!);
ContextoBasePagina.displayName = "Página";

export default ContextoBasePagina;
