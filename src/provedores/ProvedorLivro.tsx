import { useState, useEffect } from "react";
import axios from "axios";
import { ILivro } from "../tipos";
import { IChildrenProps } from "../uteis";
import { ContextoBaseLivro } from "../contextos";

export const ProvedorLivro = ({ children }: IChildrenProps) => {
    const [livro, setLivro] = useState<ILivro>(null!);

    const [audioMusica, setAudioMusica] = useState<string>("");

    useEffect(() => {
        if (!livro) {
            axios.get("src/assets/LJAF07_OTemploDoTerror/LJAF07_OTemploDoTerror__Teste.json").then((resultado) => {
                setLivro(resultado.data);
            });
        }
    }, [livro]);

    return (
        <ContextoBaseLivro.Provider
            value={{
                livro,
                setLivro,
                audioMusica,
                setAudioMusica,
            }}
        >
            {children}
        </ContextoBaseLivro.Provider>
    );
};
