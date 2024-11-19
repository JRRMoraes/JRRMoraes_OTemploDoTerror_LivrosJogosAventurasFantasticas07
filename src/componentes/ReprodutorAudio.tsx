import { ContextoLivro } from "../contextos";
import { Botao } from "./Botao";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import { useEffect } from "react";

export const ReprodutorAudio = () => {
    const { audioExecutor, setAudioExecutor } = ContextoLivro();

    useEffect(() => {
        if (!audioExecutor.audioRef.current) {
            return;
        }
        if (!audioExecutor.inicializado) {
            audioExecutor.audioRef.current.play();
            audioExecutor.inicializado = true;
        }
        if (!audioExecutor.audioRef.current.played && audioExecutor.inicializado) {
            audioExecutor.inicializado = false;
        }
    }, [audioExecutor]);

    return (
        <div>
            {MontarRetorno_Controles()}
            <audio
                ref={audioExecutor.audioRef}
                muted={audioExecutor.mudo}
                loop={audioExecutor.loopAtual}
                //autoPlay={true}
            >
                <source
                    src={audioExecutor.musicaAtual}
                    type={audioExecutor.tipoAtual}
                />
                Seu navegador não suporta o elemento de áudio.
            </audio>
        </div>
    );

    function MontarRetorno_Controles() {
        if (audioExecutor.mudo) {
            return (
                <Botao
                    aoClicar={OuvirAudio}
                    dica="Ouvir música e efeitos sonoros"
                >
                    <VolumeUpOutlinedIcon />
                </Botao>
            );
        } else {
            return (
                <Botao
                    aoClicar={MutarAudio}
                    dica="Mudo"
                >
                    <VolumeOffOutlinedIcon />
                </Botao>
            );
        }
    }

    function OuvirAudio() {
        setAudioExecutor((prevAudioExecutor) => {
            return { ...prevAudioExecutor, mudo: false };
        });
    }

    function MutarAudio() {
        setAudioExecutor((prevAudioExecutor) => {
            return { ...prevAudioExecutor, mudo: true };
        });
    }
};

export default ReprodutorAudio;
