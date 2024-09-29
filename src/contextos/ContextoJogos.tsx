import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { TJogo } from "../tipos";

export type TContextoBaseJogos = {
    jogos: TJogo[];
    setJogos: Dispatch<SetStateAction<TJogo[]>>;
    jogoAtual: TJogo;
    setJogoAtual: Dispatch<SetStateAction<TJogo>>;
};

export const ContextoBaseJogos = createContext<TContextoBaseJogos>(null!);
ContextoBaseJogos.displayName = "Jogos";

export const ContextoJogos = () => {
    const { jogos, setJogos, jogoAtual, setJogoAtual } =
        useContext(ContextoBaseJogos);

    return {
        jogos,
        setJogos,
        jogoAtual,
        setJogoAtual,
    };
};
