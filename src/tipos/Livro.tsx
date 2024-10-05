export interface IEfeito {
    texto: string;
    sobre: string;
    valor: number;
}

export interface IHistoria {
    textos: string[];
    efeitos?: IEfeito[];
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
    destino: string;
    funcao: () => void;
}

export interface IPagina {
    idPagina: number;
    titulo?: string;
    historias: IHistoria[];
    combates: ICombate[];
    destinos: IDestino[];
}

export const PAGINA_ZERADA: IPagina = {
    idPagina: -999,
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
    resumoInicial: string[];
    paginasIniciais: IPagina[];
    paginasCampanha: IPagina[];
}
