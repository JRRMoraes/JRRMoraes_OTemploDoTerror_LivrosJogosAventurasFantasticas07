import { useState, useEffect, useRef } from "react";
import { ILivro, IAudioExecutor, IAudioMusica, EAudioMomentoMusica, IAudioEfeito } from "../tipos";
import { IChildrenProps } from "../uteis";
import { ContextoBaseLivro } from "../contextos";
import axios from "axios";

export const ProvedorLivro = ({ children }: IChildrenProps) => {
    const [livro, setLivro] = useState<ILivro>(null!);

    const [audioExecutor, setAudioExecutor] = useState<IAudioExecutor>({
        mudo: false,
        audioMusicaRef: useRef<HTMLAudioElement>(null),
        volumeMusica: 0.5,
        audioEfeitoRef: useRef<HTMLAudioElement>(null),
        volumeEfeito: 1,
    });

    const [audioMusica, setAudioMusica] = useState<IAudioMusica>({
        momento: EAudioMomentoMusica._NULO,
        atual: "",
    });

    const [audioEfeitos, setAudioEfeitos] = useState<IAudioEfeito[]>([]);

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
                audioMusica,
                setAudioMusica,
                audioEfeitos,
                setAudioEfeitos,
            }}
        >
            {children}
        </ContextoBaseLivro.Provider>
    );
};

export default ProvedorLivro;
