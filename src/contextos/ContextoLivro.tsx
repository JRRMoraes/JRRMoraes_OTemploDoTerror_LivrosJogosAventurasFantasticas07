import { createContext, Dispatch, SetStateAction, useContext, ReactElement } from "react";
import { IJogo, ILivro, IPagina, PAGINA_ZERADA } from "../tipos";

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
            jogo.campanhaCapitulo = "PAGINAS_INICIAIS";
            jogo.campanhaIndice = 1;
        }
        if (jogo.campanhaCapitulo === "PAGINAS_INICIAIS") {
            if (jogo.campanhaIndice !== 999) {
                return livro.paginasIniciais.find((paginaI) => paginaI.idPagina === jogo.campanhaIndice)!;
            } else {
                jogo.campanhaCapitulo = "PAGINAS_CAMPANHA";
                jogo.campanhaIndice = 0;
            }
        }
        if (jogo.campanhaCapitulo === "PAGINAS_CAMPANHA") {
            return livro.paginasCampanha.find((paginaI) => paginaI.idPagina === jogo.campanhaIndice)!;
        }
        return PAGINA_ZERADA;
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

export const CAMINHO_IMAGEM = "src/assets/LJAF07_OTemploDoTerror/imagens/";
