import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IJogo, ILivro, IPagina, ECampanhaCapitulo, PAGINA_ZERADA } from "../tipos";

export type TContextoBaseLivro = {
    livro: ILivro;
    setLivro: Dispatch<SetStateAction<ILivro>>;
};

export const ContextoBaseLivro = createContext<TContextoBaseLivro>(null!);
ContextoBaseLivro.displayName = "Livro";

export const ContextoLivro = () => {
    const { livro, setLivro } = useContext(ContextoBaseLivro);

    function ObterPagina(jogo: IJogo): IPagina {
        if (!livro || !livro.paginasIniciais || !livro.paginasCampanha) {
            return PAGINA_ZERADA;
        }
        if (!jogo) {
            return PAGINA_ZERADA;
        }
        if (!jogo.campanhaCapitulo) {
            jogo.campanhaCapitulo = ECampanhaCapitulo.PAGINAS_INICIAIS;
            jogo.campanhaIndice = 1;
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
        _pagina.auxIdCapitulo = jogo.campanhaCapitulo;
        return _pagina;
    }

    function CaminhoImagem(imagem: string) {
        return CAMINHO_IMAGEM + imagem;
    }

    return {
        livro,
        setLivro,
        ObterPagina,
        CaminhoImagem,
    };
};

export default ContextoLivro;

export const CAMINHO_IMAGEM = "src/assets/LJAF07_OTemploDoTerror/imagens/";
