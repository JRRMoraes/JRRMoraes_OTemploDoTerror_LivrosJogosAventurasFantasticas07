import { createContext, Dispatch, SetStateAction } from "react";
import { ECampanhaCapitulo, ICombateExecutor, IDestinosExecutor, IHistoriasExecutor, IJogo, IPaginaExecutor } from "../tipos";

export type TContextoBaseJogos = {
    jogoSalvo1: IJogo;
    setJogoSalvo1: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo2: IJogo;
    setJogoSalvo2: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo3: IJogo;
    setJogoSalvo3: Dispatch<SetStateAction<IJogo>>;
    jogoAtual: IJogo;
    setJogoAtual: Dispatch<SetStateAction<IJogo>>;
    paginaExecutor: IPaginaExecutor;
    setPaginaExecutor: Dispatch<SetStateAction<IPaginaExecutor>>;
    historiasExecutor: IHistoriasExecutor;
    setHistoriasExecutor: Dispatch<SetStateAction<IHistoriasExecutor>>;
    combateExecutor: ICombateExecutor;
    setCombateExecutor: Dispatch<SetStateAction<ICombateExecutor>>;
    destinosExecutor: IDestinosExecutor;
    setDestinosExecutor: Dispatch<SetStateAction<IDestinosExecutor>>;
    padraoCapitulo: ECampanhaCapitulo;
    setPadraoCapitulo: Dispatch<SetStateAction<ECampanhaCapitulo>>;
};

export const ContextoBaseJogos = createContext<TContextoBaseJogos>(null!);
ContextoBaseJogos.displayName = "Jogos";

export default ContextoBaseJogos;
