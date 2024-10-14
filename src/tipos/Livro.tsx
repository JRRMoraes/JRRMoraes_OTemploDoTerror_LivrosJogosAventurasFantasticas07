import { EProcesso } from "../uteis";
import { ECampanhaCapitulo } from "./Jogo";

export interface IApresentacao {
    textos: string[];
}

export interface IEfeito {
    texto: string;
    sobre: string;
    quantidade: number;
    auxProcessoEfeito: EProcesso;
}

export interface IHistoria {
    textos: string[];
    efeitos: IEfeito[];
}

export const HISTORIA_ZERADA: IHistoria = {
    textos: [],
    efeitos: [],
};

export interface ICombate {
    inimigo: string;
    habilidade: number;
    energia: number;
}

export interface IDestino {
    idPagina: number;
    idCapitulo: ECampanhaCapitulo;
    destino: string;
    auxDestinoFuncao: () => void;
    bloqueioOperacao: string;
    bloqueioNegado: boolean;
    testaSorte: boolean;
    idPaginaAzar: number;
}

export interface IPagina {
    idPagina: number;
    idCapitulo: ECampanhaCapitulo;
    titulo: string;
    historias: IHistoria[];
    combates: ICombate[];
    destinos: IDestino[];
}

export const PAGINA_ZERADA: IPagina = {
    idPagina: -999,
    idCapitulo: ECampanhaCapitulo._NULO,
    titulo: "",
    historias: [],
    combates: [],
    destinos: [],
};

export const PAGINA_INICIAL: IPagina = {
    idPagina: 1,
    idCapitulo: ECampanhaCapitulo.PAGINAS_INICIAIS,
    titulo: "No início",
    historias: [],
    combates: [],
    destinos: [],
};

export const PAGINA_DETONADO: IPagina = {
    idPagina: 9999,
    idCapitulo: ECampanhaCapitulo.PAGINAS_CAMPANHA,
    titulo: "Parabéns",
    historias: [],
    combates: [],
    destinos: [],
};

export interface ILivro {
    idLivroJogo: string;
    titulo: string;
    autor: string;
    ilustrador: string;
    isbn: string;
    capa: string;
    apresentacoes: IApresentacao[];
    paginasIniciais: IPagina[];
    paginasCampanha: IPagina[];
}

export enum EPaginaCampanhaEstado {
    _INICIO,
    HISTORIAS,
    COMBATES,
    DESTINOS,
}

export interface IPaginaCampanha extends IPagina {
    ehJogoCarregado: boolean;
    estado: EPaginaCampanhaEstado;
    idPaginaDestino: number;
    idCapituloDestino: ECampanhaCapitulo;
}
