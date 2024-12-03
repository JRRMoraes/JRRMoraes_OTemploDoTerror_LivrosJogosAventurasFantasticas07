import { useContext } from "react";
import { IJogo, IPagina, ECampanhaCapitulo, PAGINA_ZERADA, PAGINA_INICIAL, EAudioMomentoMusica, EAudioMomentoEfeitoSonoro } from "../tipos";
import { ContextoBaseLivro } from ".";

export const ContextoLivro = () => {
    const { livro, setLivro, audioExecutor, setAudioExecutor, audioMusica, setAudioMusica, audioEfeitos, setAudioEfeitos } = useContext(ContextoBaseLivro);

    const AUDIO_DIRETORIO = "/audios/";

    const MUSICAS_POR_MOMEMTO: { [key in EAudioMomentoMusica]: string[] } = {
        [EAudioMomentoMusica._NULO]: [""],
        [EAudioMomentoMusica.ABERTURA]: ["The Storyteller.mp3"],
        [EAudioMomentoMusica.CAMPANHA]: ["The Storyteller.mp3", "Only the Braves - FiftySounds.mp3"],
        [EAudioMomentoMusica.COMBATE]: ["The Storyteller.mp3", "Only the Braves - FiftySounds.mp3"],
        [EAudioMomentoMusica.VITORIA_COMBATE]: ["sfx-victory1.mp3"],
        [EAudioMomentoMusica.VITORIA_JOGO]: ["sword-sound-effect-1-234987.mp3"],
        [EAudioMomentoMusica.DERROTA_COMBATE]: ["The Storyteller.mp3", "Only the Braves - FiftySounds.mp3"],
        [EAudioMomentoMusica.DERROTA_JOGO]: ["The Storyteller.mp3", "Only the Braves - FiftySounds.mp3"],
    };

    const EFEITOS_SONOROS_POR_MOMEMTO: { [key in EAudioMomentoEfeitoSonoro]: string[] } = {
        [EAudioMomentoEfeitoSonoro.ROLANDO_DADOS]: ["075220_2d6-rolling-dice-35981.mp3"],
        [EAudioMomentoEfeitoSonoro.MUDANDO_PAGINA]: ["sfx-paperflip1.mp3"],
        [EAudioMomentoEfeitoSonoro.VITORIA_SOBRE_INIMIGO]: ["shield-guard-6963.mp3"],
        [EAudioMomentoEfeitoSonoro.VITORIA_SOBRE_SERIE_ATAQUE]: ["shield-guard-6963.mp3"],
        [EAudioMomentoEfeitoSonoro.DERROTA_SOBRE_SERIE_ATAQUE]: ["shield-guard-6963.mp3"],
    };

    return {
        livro,
        setLivro,
        audioExecutor,
        setAudioExecutor,
        audioMusica,
        setAudioMusica,
        audioEfeitos,
        setAudioEfeitos,
        ObterPagina,
        CaminhoImagem,
        ImporAudioMusicaViaMomento,
        AdicionarNoAudioEfeitosViaMomento,
        ExcluirNoAudioEfeitosPrimeiroItem,
    };

    function ObterPagina(jogo: IJogo): IPagina {
        if (!livro || !livro.paginasIniciais || !livro.paginasCampanha) {
            return PAGINA_ZERADA;
        }
        if (!jogo) {
            return PAGINA_ZERADA;
        }
        if (!jogo.campanhaCapitulo || jogo.campanhaCapitulo === ECampanhaCapitulo._NULO) {
            jogo.campanhaCapitulo = PAGINA_INICIAL.idCapitulo;
            jogo.campanhaIndice = PAGINA_INICIAL.idPagina;
        }
        let _pagina = PAGINA_ZERADA;
        if (jogo.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_INICIAIS) {
            _pagina = livro.paginasIniciais.find((paginaI) => paginaI.idPagina === jogo.campanhaIndice)!;
        } else if (jogo.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_CAMPANHA) {
            _pagina = livro.paginasCampanha.find((paginaI) => paginaI.idPagina === jogo.campanhaIndice)!;
        }
        if (!_pagina || _pagina === PAGINA_ZERADA) {
            console.log("ContextoLivro.ObterPagina:::  Não foi possível encontrar a página " + jogo.campanhaIndice + " da " + jogo.campanhaCapitulo);
            return PAGINA_ZERADA;
        }
        if (!_pagina.idCapitulo || _pagina.idCapitulo === ECampanhaCapitulo._NULO) {
            _pagina.idCapitulo = jogo.campanhaCapitulo;
        }
        return _pagina;
    }

    function CaminhoImagem(imagem: string) {
        return IMAGEM_CAMINHO + imagem + IMAGEM_EXTENSAO;
    }

    function ImporAudioMusicaViaMomento(momentoMusica: EAudioMomentoMusica, quandoTerminar: boolean = false) {
        if (!quandoTerminar && audioMusica.momento === momentoMusica) {
            return;
        }
        let _indice = 0;
        if (MUSICAS_POR_MOMEMTO[momentoMusica].length > 1) {
            _indice = Math.floor(Math.random() * MUSICAS_POR_MOMEMTO[momentoMusica].length);
        }
        setAudioMusica((prevAudioMusica) => {
            prevAudioMusica.momento = momentoMusica;
            prevAudioMusica.atual = AUDIO_DIRETORIO + MUSICAS_POR_MOMEMTO[momentoMusica][_indice];
            return { ...prevAudioMusica };
        });
    }

    function AdicionarNoAudioEfeitosViaMomento(momentoEfeitoSonoro: EAudioMomentoEfeitoSonoro) {
        let _indice = 0;
        if (EFEITOS_SONOROS_POR_MOMEMTO[momentoEfeitoSonoro].length > 1) {
            _indice = Math.floor(Math.random() * EFEITOS_SONOROS_POR_MOMEMTO[momentoEfeitoSonoro].length);
        }
        setAudioEfeitos((prevAudioEfeitos) => {
            prevAudioEfeitos.push({ momento: momentoEfeitoSonoro, atual: AUDIO_DIRETORIO + EFEITOS_SONOROS_POR_MOMEMTO[momentoEfeitoSonoro][_indice], tocando: false });
            return [...prevAudioEfeitos];
        });
    }

    function ExcluirNoAudioEfeitosPrimeiroItem() {
        setAudioEfeitos((prevAudioEfeitos) => {
            prevAudioEfeitos.shift();
            return [...prevAudioEfeitos];
        });
    }
};

export default ContextoLivro;

export const IMAGEM_CAMINHO = "/LJAF07_OTemploDoTerror/imagens/";
export const IMAGEM_EXTENSAO = ".png";
