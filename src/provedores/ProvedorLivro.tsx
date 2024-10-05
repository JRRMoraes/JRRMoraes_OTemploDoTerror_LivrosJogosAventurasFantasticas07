import { useEffect, useState } from "react";
import axios from "axios";
import { ILivro } from "../tipos";
import { ContextoBaseLivro } from "../contextos";
import { IChildrenProps } from "../uteis";

export const ProvedorLivro = ({ children }: IChildrenProps) => {
    const [livro, setLivro] = useState<ILivro>(null!);

    useEffect(() => {
        axios.get("src/assets/LJAF07_OTemploDoTerror/LJAF07_OTemploDoTerror__Teste.json").then((resultado) => {
            setLivro(resultado.data);
        });
    }, []);

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
