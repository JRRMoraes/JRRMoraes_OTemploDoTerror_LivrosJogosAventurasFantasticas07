import { useEffect, useState } from "react";
import axios from "axios";
import { TLivro } from "../tipos";
import { ContextoBaseLivro } from "../contextos";
import { IPropsChildren } from "../uteis";

export const ProvedorLivro = ({ children }: IPropsChildren) => {
    const [livro, setLivro] = useState<TLivro>(null!);

    useEffect(() => {
        axios
            .get(
                "src/assets/LJAF07_OTemploDoTerror/LJAF07_OTemploDoTerror__Teste.json"
            )
            .then((resultado) => {
                setLivro(resultado.data);
            });
    }, [setLivro]);

    return (
        <ContextoBaseLivro.Provider
            value={{
                livro,
                setLivro,
            }}
        >
            {children}
        </ContextoBaseLivro.Provider>
    );
};
