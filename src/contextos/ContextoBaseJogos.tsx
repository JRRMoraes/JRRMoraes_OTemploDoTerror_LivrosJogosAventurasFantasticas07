import { createContext, Dispatch, SetStateAction } from "react";
import { IJogo, ECampanhaCapitulo, IEfeitoExecucao } from "../tipos";

export type TContextoBaseJogos = {
    jogoSalvo1: IJogo;
    setJogoSalvo1: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo2: IJogo;
    setJogoSalvo2: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo3: IJogo;
    setJogoSalvo3: Dispatch<SetStateAction<IJogo>>;
    jogoAtual: IJogo;
    setJogoAtual: Dispatch<SetStateAction<IJogo>>;
    padraoCapitulo: ECampanhaCapitulo;
    setPadraoCapitulo: Dispatch<SetStateAction<ECampanhaCapitulo>>;
    jogadorEfeitosAplicados: IEfeitoExecucao[];
    setJogadorEfeitosAplicados: Dispatch<SetStateAction<IEfeitoExecucao[]>>;
};

export const ContextoBaseJogos = createContext<TContextoBaseJogos>(null!);
ContextoBaseJogos.displayName = "Jogos";

export default ContextoBaseJogos;
