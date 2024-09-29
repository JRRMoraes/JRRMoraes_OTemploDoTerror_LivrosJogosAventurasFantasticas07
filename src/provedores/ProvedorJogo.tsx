import { useEffect, useState } from "react";
import { TJogo } from "../tipos";
import { ContextoBaseJogos } from "../contextos";
import { IPropsChildren, CriarStateComLocalStorage } from "../uteis";

const LOCALSTORAGE_JOGOS = "JRRMoraes_LJAF07_OTemploDoTerror__Jogos";

const JOGOS_ZERADOS: TJogo[] = [
    {
        idJogo: 1,
        ativo: false,
    },
    {
        idJogo: 2,
        ativo: false,
    },
    {
        idJogo: 3,
        ativo: false,
    },
];

export const ProvedorJogos = ({ children }: IPropsChildren) => {
    const [jogos, setJogos] = CriarStateComLocalStorage<TJogo[]>(
        LOCALSTORAGE_JOGOS,
        JOGOS_ZERADOS
    );

    const [jogoAtual, setJogoAtual] = useState<TJogo>(null!);

    useEffect(() => {
        if (jogos && jogos["length"] === 0) setJogos(JOGOS_ZERADOS);
    }, [jogos, setJogos]);

    return (
        <ContextoBaseJogos.Provider
            value={{
                jogos,
                setJogos,
                jogoAtual,
                setJogoAtual,
            }}
        >
            {children}
        </ContextoBaseJogos.Provider>
    );
};
