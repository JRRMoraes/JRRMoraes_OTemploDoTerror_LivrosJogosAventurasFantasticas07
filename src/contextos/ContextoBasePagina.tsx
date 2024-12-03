import { Dispatch, SetStateAction, MutableRefObject, createContext } from "react";
import {
    IPagina,
    ECampanhaCapitulo,
    EPaginaExecutorEstado,
    IHistoriaTextoExecucao,
    IHistoriaEfeitoExecucao,
    IHistoriaImagemExecucao,
    IEfeitoExecucao,
    IEfeitoInimigoExecucao,
    IInimigoExecucao,
    IAliadoExecucao,
    EResultadoCombate,
    IDestino,
    IDestinoExecucao,
    EPosturaInimigo,
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
    historiaImagens: IHistoriaImagemExecucao[];
    setHistoriaImagens: Dispatch<SetStateAction<IHistoriaImagemExecucao[]>>;
    historiaProcesso: EProcesso;
    setHistoriaProcesso: Dispatch<SetStateAction<EProcesso>>;
    historiaIndice: number;
    setHistoriaIndice: Dispatch<SetStateAction<number>>;
    historiaProcessoIndice: EProcesso;
    setHistoriaProcessoIndice: Dispatch<SetStateAction<EProcesso>>;
    combateInimigos: IInimigoExecucao[];
    setCombateInimigos: Dispatch<SetStateAction<IInimigoExecucao[]>>;
    combateInimigos_PosturaInimigo: EPosturaInimigo[];
    setCombateInimigos_PosturaInimigo: Dispatch<SetStateAction<EPosturaInimigo[]>>;
    combateInimigos_ProcessoRolagemAtaque: EProcesso[];
    setCombateInimigos_ProcessoRolagemAtaque: Dispatch<SetStateAction<EProcesso[]>>;
    combateInimigos_ProcessoRolagemSorteConfirmacao: EProcesso[];
    setCombateInimigos_ProcessoRolagemSorteConfirmacao: Dispatch<SetStateAction<EProcesso[]>>;
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
    combateResultadoFinalDerrota: EResultadoCombate;
    setCombateResultadoFinalDerrota: Dispatch<SetStateAction<EResultadoCombate>>;
    combateResultadoFinalInimigos: EResultadoCombate;
    setCombateResultadoFinalInimigos: Dispatch<SetStateAction<EResultadoCombate>>;
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
