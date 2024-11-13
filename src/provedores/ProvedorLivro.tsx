import { useState, useEffect, useRef } from "react";
import { ILivro, IAudioExecutor } from "../tipos";
import { IChildrenProps } from "../uteis";
import { ContextoBaseLivro } from "../contextos";
import axios from "axios";

export const ProvedorLivro = ({ children }: IChildrenProps) => {
    const [livro, setLivro] = useState<ILivro>(null!);

    const [audioExecutor, setAudioExecutor] = useState<IAudioExecutor>({
        audioRef: useRef<HTMLAudioElement>(null),
        inicializado: false,
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

export default ProvedorLivro;
