import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { ILivro, IAudioExecutor, IJogo, IPagina, ECampanhaCapitulo, PAGINA_ZERADA, PAGINA_INICIAL } from "../tipos";

export type TContextoBaseLivro = {
    livro: ILivro;
    setLivro: Dispatch<SetStateAction<ILivro>>;
    audioExecutor: IAudioExecutor;
    setAudioExecutor: Dispatch<SetStateAction<IAudioExecutor>>;
};

export const ContextoBaseLivro = createContext<TContextoBaseLivro>(null!);
ContextoBaseLivro.displayName = "Livro";

export const ContextoLivro = () => {
    const { livro, setLivro, audioExecutor, setAudioExecutor } = useContext(ContextoBaseLivro);

    return {
        livro,
        setLivro,
        audioExecutor,
        setAudioExecutor,
        ObterPagina,
        CaminhoImagem,
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
        return CAMINHO_IMAGEM + imagem;
    }
};

export default ContextoLivro;

export const CAMINHO_IMAGEM = "/LJAF07_OTemploDoTerror/imagens/";
