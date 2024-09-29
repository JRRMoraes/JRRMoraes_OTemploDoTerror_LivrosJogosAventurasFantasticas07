import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { TLivro } from "../tipos";

export type TContextoBaseLivro = {
    livro: TLivro;
    setLivro: Dispatch<SetStateAction<TLivro>>;
};

export const ContextoBaseLivro = createContext<TContextoBaseLivro>(null!);
ContextoBaseLivro.displayName = "Livro";

export const ContextoLivro = () => {
    const { livro, setLivro } = useContext(ContextoBaseLivro);

    return {
        livro,
        setLivro,
    };
};
