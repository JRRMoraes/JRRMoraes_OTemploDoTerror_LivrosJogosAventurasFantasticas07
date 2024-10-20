import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ILivro, IAudioExecutor } from "../tipos";
import { IChildrenProps } from "../uteis";
import { ContextoBaseLivro } from "../contextos";

export const ProvedorLivro = ({ children }: IChildrenProps) => {
    const [livro, setLivro] = useState<ILivro>(null!);

    const [audioExecutor, setAudioExecutor] = useState<IAudioExecutor>({
        audioRef: useRef<HTMLAudioElement>(null),
        mudo: false,
        volume: 0.4,
        musicaAtual: "/The Storyteller.mp3",
        tipoAtual: "audio/mpeg",
        loopAtual: true,
    });

    useEffect(() => {
        if (!livro) {
            axios.get("/LJAF07_OTemploDoTerror/LJAF07_OTemploDoTerror__Teste.json").then((resultado) => {
                setLivro(resultado.data);
            });
        }
    }, [livro]);

    return (
        <ContextoBaseLivro.Provider
            value={{
                livro,
                setLivro,
                audioExecutor,
                setAudioExecutor,
            }}
        >
            {children}
        </ContextoBaseLivro.Provider>
    );
};
