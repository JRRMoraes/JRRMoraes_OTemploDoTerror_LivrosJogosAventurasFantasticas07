import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { IJogo, ILivro, IPagina, ECampanhaCapitulo, PAGINA_ZERADA, PAGINA_INICIAL } from "../tipos";

export type TContextoBaseLivro = {
    livro: ILivro;
    setLivro: Dispatch<SetStateAction<ILivro>>;
    audioMusica: string;
    setAudioMusica: Dispatch<SetStateAction<string>>;
};

export const ContextoBaseLivro = createContext<TContextoBaseLivro>(null!);
ContextoBaseLivro.displayName = "Livro";

export const ContextoLivro = () => {
    const { livro, setLivro, audioMusica, setAudioMusica } = useContext(ContextoBaseLivro);
    //setAudioMusica("public/The Storyteller.mp3");

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
        return CAMINHO_IMAGEM + imagem;
    }

    return {
        livro,
        setLivro,
        audioMusica,
        setAudioMusica,
        ObterPagina,
        CaminhoImagem,
    };
};

export default ContextoLivro;

export const CAMINHO_IMAGEM = "src/assets/LJAF07_OTemploDoTerror/imagens/";
