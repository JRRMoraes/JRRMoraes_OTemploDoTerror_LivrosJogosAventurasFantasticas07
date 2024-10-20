import { ContextoLivro } from "../contextos";
import { Botao } from "./Botao";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";

export const ReprodutorAudio = () => {
    const { audioExecutor, setAudioExecutor } = ContextoLivro();

    return (
        <div>
            {MontarRetorno_Controles()}
            <audio
                ref={audioExecutor.audioRef}
                muted={audioExecutor.mudo}
                loop={audioExecutor.loopAtual}
                autoPlay={true}
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
                <Botao aoClicar={() => OuvirAudio()}>
                    <VolumeUpOutlinedIcon />
                </Botao>
            );
        } else {
            return (
                <Botao aoClicar={() => MutarAudio()}>
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
