import { ECampanhaCapitulo } from "./Jogo";

export interface IApresentacao {
    textos: string[];
}

export interface IEfeito {
    texto: string;
    sobre: string;
    valor: number;
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
    nome: string;
    habilidade: number;
    energia: number;
}

export interface IDestino {
    idPagina: number;
    idPaginaAzar: number;
    idCapitulo: ECampanhaCapitulo;
    destino: string;
    //auxDestinoFuncao: () => void;
    bloqueioOperacao: string;
    bloqueioNegado: boolean;
    testaSorte: boolean;
}

export interface IPagina {
    idPagina: number;
    auxIdCapitulo: ECampanhaCapitulo;
    titulo: string;
    historias: IHistoria[];
    combates: ICombate[];
    destinos: IDestino[];
}

export const PAGINA_ZERADA: IPagina = {
    idPagina: -999,
    auxIdCapitulo: ECampanhaCapitulo.PAGINAS_INICIAIS,
    titulo: "",
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
