import { useEffect } from "react";
import { ContextoLivro, ContextoJogos, ContextoPagina } from "../contextos";
import { EAudioMomentoMusica } from "../tipos";

export const ControlePaginaLivroJogo = () => {
    const { audioMusica, ImporAudioMusicaViaMomento } = ContextoLivro();

    const { jogoAtual, ResetarJogo } = ContextoJogos();

    const { pagina } = ContextoPagina();

    useEffect(() => {
        if ([EAudioMomentoMusica._NULO, EAudioMomentoMusica.ABERTURA].includes(audioMusica.momento)) {
            ImporAudioMusicaViaMomento(EAudioMomentoMusica.CAMPANHA);
        }

        window.addEventListener("beforeunload", ProcessarRefresh);
        return () => {
            window.removeEventListener("beforeunload", ProcessarRefresh);
        };
    }, []);

    return { ContextosReprovados, AprovarJogoAtualPanilha };

    function ContextosReprovados() {
        return !jogoAtual || !pagina;
    }

    function AprovarJogoAtualPanilha() {
        return jogoAtual && jogoAtual.panilha;
    }

    function ProcessarRefresh(evento: BeforeUnloadEvent) {
        evento.preventDefault();
        ResetarJogo();
    }
};

export default ControlePaginaLivroJogo;
