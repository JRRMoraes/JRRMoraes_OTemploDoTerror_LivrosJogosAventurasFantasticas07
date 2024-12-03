import { useEffect } from "react";
import { ContextoLivro } from "../contextos";
import { EAudioMomentoMusica } from "../tipos";
import { Botao } from "./Botao";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";

export const ReprodutorAudio = () => {
    const { audioExecutor, setAudioExecutor, audioMusica, audioEfeitos, setAudioEfeitos, ImporAudioMusicaViaMomento, ExcluirNoAudioEfeitosPrimeiroItem } = ContextoLivro();

    const AUDIO_TIPO = "audio/mpeg";

    useEffect(() => {
        if (!audioExecutor.audioMusicaRef.current || !audioMusica || audioMusica.momento === EAudioMomentoMusica._NULO) {
            return;
        }
        audioExecutor.audioMusicaRef.current.volume = audioExecutor.volumeMusica;
        TocarMusica();

        async function TocarMusica() {
            try {
                if (audioExecutor.audioMusicaRef.current) {
                    await audioExecutor.audioMusicaRef.current.play();
                }
            } catch (_erro) {
                console.error("Reprodução de áudio da música interrompida:", _erro);
            }
        }
    }, [audioExecutor, audioMusica]);

    useEffect(() => {
        if (!audioExecutor.audioEfeitoRef.current || !audioEfeitos || !audioEfeitos.length) {
            return;
        }
        audioExecutor.audioEfeitoRef.current.volume = audioExecutor.volumeEfeito;
        TocarEfeito();

        async function TocarEfeito() {
            try {
                if (audioExecutor.audioEfeitoRef.current && audioEfeitos && audioEfeitos.length) {
                    await audioExecutor.audioEfeitoRef.current.play();
                    if (!audioEfeitos[0].tocando) {
                        setAudioEfeitos((prevAudioEfeitos) => {
                            prevAudioEfeitos = prevAudioEfeitos.map((efeitoI, indiceI) => {
                                if (indiceI === 0) {
                                    efeitoI.tocando = true;
                                }
                                return efeitoI;
                            });
                            return [...prevAudioEfeitos];
                        });
                    }
                }
            } catch (_erro) {
                console.error("Reprodução de áudio do efeito interrompida:", _erro);
            }
        }
    }, [audioExecutor, audioEfeitos]);

    return (
        <div>
            {MontarRetorno_Controles()}
            <audio
                ref={audioExecutor.audioMusicaRef}
                muted={audioExecutor.mudo}
                onEnded={AoTerminarMusica}
                controls={false}
            >
                {audioMusica && audioMusica.atual && (
                    <source
                        src={audioMusica.atual}
                        type={AUDIO_TIPO}
                    />
                )}
                <span>Seu navegador não suporta o elemento de áudio.</span>
            </audio>
            <audio
                ref={audioExecutor.audioEfeitoRef}
                muted={audioExecutor.mudo}
                onEnded={AoTerminarEfeitoSonoro}
                controls={false}
            >
                {audioEfeitos && audioEfeitos[0] && audioEfeitos[0].atual && (
                    <source
                        src={audioEfeitos[0].atual}
                        type={AUDIO_TIPO}
                    />
                )}
            </audio>
        </div>
    );

    function MontarRetorno_Controles() {
        if (audioExecutor.mudo) {
            return (
                <Botao
                    aoClicar={AoOuvirAudio}
                    dica="Ouvir música e efeitos sonoros"
                >
                    <VolumeUpOutlinedIcon />
                </Botao>
            );
        } else {
            return (
                <Botao
                    aoClicar={AoMutarAudio}
                    dica="Mudo"
                >
                    <VolumeOffOutlinedIcon />
                </Botao>
            );
        }
    }

    function AoOuvirAudio() {
        setAudioExecutor((prevAudioExecutor) => {
            return { ...prevAudioExecutor, mudo: false };
        });
    }

    function AoMutarAudio() {
        setAudioExecutor((prevAudioExecutor) => {
            return { ...prevAudioExecutor, mudo: true };
        });
    }

    function AoTerminarMusica() {
        ImporAudioMusicaViaMomento(audioMusica.momento, true);
    }

    function AoTerminarEfeitoSonoro() {
        ExcluirNoAudioEfeitosPrimeiroItem();
    }
};

export default ReprodutorAudio;
