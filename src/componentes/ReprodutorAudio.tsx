import React, { useEffect, useState } from "react";
import { Botao } from "./Botao";

interface IReprodutorAudioProps {
    audio: string;
    tipo?: string;
    volume?: number;
}

export const ReprodutorAudio = ({ audio, tipo = "audio/mpeg", volume = 50 }: IReprodutorAudioProps) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const [executando, setExecutando] = useState(true);

    const [minimizado, setMinimizado] = useState(true);

    useEffect(() => {
        if (executando && audioRef.current) {
            audioRef.current.play();
        } else if (!executando && audioRef.current) {
            audioRef.current.pause();
        }
    }, [executando]);

    return (
        <div>
            {MontarRetorno_Controles()}
            <audio
                ref={audioRef}
                autoPlay={true}
            >
                <source
                    src={audio}
                    type={tipo}
                />
                Seu navegador não suporta o elemento de áudio.
            </audio>
        </div>
    );

    function MontarRetorno_Controles() {
        //if (minimizado) {
        return <div>{MontarRetorno_BotoesReprodutor()}</div>;
        //}
    }

    function MontarRetorno_BotoesReprodutor() {
        if (executando) {
            return <Botao aoClicar={() => PararAudio()}>II</Botao>;
        } else {
            return <Botao aoClicar={() => ReproduzirAudio()}>&gt;</Botao>;
        }
    }

    function ReproduzirAudio() {
        setExecutando(true);
    }

    function PararAudio() {
        setExecutando(false);
    }
};

export default ReprodutorAudio;
