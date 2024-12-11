import { useState, useEffect, useRef } from "react";
import { ILivro, IAudioExecutor, IAudioMusica, EAudioMomentoMusica, IAudioEfeito } from "../tipos";
import { IChildrenProps } from "../uteis";
import { ContextoBaseLivro } from "../contextos";
import { LIVRO_JOGO } from "../globais/ConstantesID";
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
            ConsultarJsonLivroJogo(LIVRO_JOGO);
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

    async function ConsultarJsonLivroJogo(jsonLivroJogo: string) {
        try {
            const resultado = await axios.get(jsonLivroJogo, {
                headers: {
                    "Content-Type": "application/json",
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });
            const resultadoJson = typeof resultado.data === "string" ? JSON.parse(resultado.data) : resultado.data;
            setLivro(resultadoJson);
        } catch (erro) {
            console.error("ConsultarJsonLivroJogo:: " + erro);
        }
    }
};

export default ProvedorLivro;
