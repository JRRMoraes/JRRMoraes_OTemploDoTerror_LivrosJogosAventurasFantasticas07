import { EProcesso } from "../uteis";
import { ECampanhaCapitulo } from "./Jogo";

export interface IApresentacao {
    textosApresentacao: string[];
}

export enum EAtributo {
    _FUNCAO = "FUNCAO",
    HABILIDADE = "HABILIDADE",
    ENERGIA = "ENERGIA",
    SORTE = "SORTE",
    OURO = "OURO",
    PROVISAO = "PROVISAO",
    ENCANTOS = "ENCANTOS",
    ITENS = "ITENS",
}

export enum EComparacao {
    _POSSUIR = "POSSUIR",
    NAO_POSSUIR = "NAO_POSSUIR",
    MAIOR_IGUAL = "MAIOR_IGUAL",
    MAIOR = "MAIOR",
    MENOR_IGUAL = "MENOR_IGUAL",
    MENOR = "MENOR",
}

export interface IEfeito {
    textoEfeito: string;
    atributoEfeito: EAtributo;
    nomeEfeito: string;
    quantidade: number;
    auxProcessoEfeito: EProcesso;
}

export interface IHistoria {
    textosHistoria: string[];
    efeitos: IEfeito[];
    imagem: string;
}

export const HISTORIA_ZERADA: IHistoria = {
    textosHistoria: [],
    efeitos: [],
    imagem: "",
};

export interface IInimigoCombate {
    inimigo: string;
    habilidade: number;
    energia: number;
}

export interface ICombate {
    inimigos: IInimigoCombate[];
    textoDerrota: string;
    aprovacaoDerrota: string;
}

export interface IAprovacaoDestino {
    atributoAprovacao: EAtributo;
    nomeAprovacao: string;
    comparacao: EComparacao;
    quantidade: number;
}

export enum EAtributoDestinoTeste {
    _NULO = "_",
    HABILIDADE = "HABILIDADE",
    SORTE = "SORTE",
}

export interface IDestino {
    idPagina: number;
    idCapitulo: ECampanhaCapitulo;
    textoDestino: string;
    textosDestino: string[];
    aprovacoes: IAprovacaoDestino[];
    testeAtributo: EAtributoDestinoTeste;
    testeSomarDados: number;
    idPaginaAzar: number;
}

export interface IPagina {
    idPagina: number;
    idCapitulo: ECampanhaCapitulo;
    titulo: string;
    historias: IHistoria[];
    combate: ICombate;
    destinos: IDestino[];
}

export const PAGINA_ZERADA: IPagina = {
    idPagina: -999,
    idCapitulo: ECampanhaCapitulo._NULO,
    titulo: "",
    historias: [],
    combate: null!,
    destinos: [],
};

export const PAGINA_INICIAL: IPagina = {
    idPagina: 1,
    idCapitulo: ECampanhaCapitulo.PAGINAS_INICIAIS,
    titulo: "No início",
    historias: [],
    combate: null!,
    destinos: [],
};

export const PAGINA_DETONADO: IPagina = {
    idPagina: 9999,
    idCapitulo: ECampanhaCapitulo.PAGINAS_CAMPANHA,
    titulo: "Parabéns",
    historias: [],
    combate: null!,
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
    _INICIO = "INICIO",
    HISTORIAS = "HISTORIAS",
    COMBATES = "COMBATES",
    DESTINOS = "DESTINOS",
}

export interface IPaginaCampanha extends IPagina {
    ehJogoCarregado: boolean;
    estado: EPaginaCampanhaEstado;
    idPaginaDestino: number;
    idCapituloDestino: ECampanhaCapitulo;
}
