import { RefObject, useRef } from "react";
import { EProcesso } from "../uteis";
import { ECampanhaCapitulo, IPanilha } from "./Jogo";

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

export enum EPosturaInimigo {
    _PARADO = "Parado",
    ATACANTE = "Atacante",
    DEFENSOR = "Defensor",
    MORTO = "Morto",
}

export enum EResultadoCombate {
    _COMBATENDO,
    VITORIA,
    DERROTA,
}

export interface IInimigoCombate {
    inimigo: string;
    habilidade: number;
    energia: number;
    auxPosturaInimigo: EPosturaInimigo;
    auxSeriesDeAtaqueVencidosConsecutivos: number;
}

export interface ICombate {
    inimigos: IInimigoCombate[];
    textosDerrota: string[];
    aprovacaoDerrota: string;
    destinoDerrota: number;
    auxSerieDeAtaqueAtual: number;
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
    idPagina: -99999,
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
    idPagina: 99999,
    idCapitulo: ECampanhaCapitulo.PAGINAS_CAMPANHA,
    titulo: "Parabéns",
    historias: [],
    combate: null!,
    destinos: [],
};

export const PAGINA_FIM_DE_JOGO: IPagina = {
    idPagina: 99444,
    idCapitulo: ECampanhaCapitulo.PAGINAS_CAMPANHA,
    titulo: "Fim de jogo",
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
    COMBATE = "COMBATE",
    DESTINOS = "DESTINOS",
}

export interface IPaginaCampanha extends IPagina {
    ehJogoCarregado: boolean;
    idPaginaDestino: number;
    idCapituloDestino: ECampanhaCapitulo;
    estado: EPaginaCampanhaEstado;
    processoHistorias: EProcesso;
    processoCombate: EProcesso;
    processoDestinos: EProcesso;
}

export interface IAudioExecutor {
    audioRef: RefObject<HTMLAudioElement>;
    inicializado: boolean;
    mudo: boolean;
    volume: number;
    musicaAtual: string;
    tipoAtual: string;
    loopAtual: boolean;
}

export function RetornarPaginaCampanhaDestinosPadronizados(paginaCampanha: IPaginaCampanha, padraoCapitulo: ECampanhaCapitulo) {
    return paginaCampanha.destinos.map<IDestino>((destinoI) => {
        if (!destinoI.idCapitulo || destinoI.idCapitulo === ECampanhaCapitulo._NULO) {
            destinoI.idCapitulo = padraoCapitulo;
        }
        return destinoI;
    });
}

export function RetornarPaginaCampanhaCombateInicial(combate: ICombate, ehJogoCarregado: boolean) {
    if (ehJogoCarregado) {
        combate.inimigos = combate.inimigos.map<IInimigoCombate>((inimigoI) => {
            inimigoI.auxPosturaInimigo = EPosturaInimigo.MORTO;
            return inimigoI;
        });
        return combate;
    }
    combate.inimigos = combate.inimigos.map<IInimigoCombate>((inimigoI) => {
        inimigoI.auxPosturaInimigo = EPosturaInimigo._PARADO;
        return inimigoI;
    });
    switch (combate.aprovacaoDerrota) {
        case "CombateMultiplo_1oAtacante_2oDefensor":
            combate.inimigos = combate.inimigos.map<IInimigoCombate>((inimigoI, indiceI) => {
                if (indiceI === 0) {
                    inimigoI.auxPosturaInimigo = EPosturaInimigo.ATACANTE;
                } else {
                    inimigoI.auxPosturaInimigo = EPosturaInimigo.DEFENSOR;
                }
                return inimigoI;
            });
            break;
        default:
            combate.inimigos = combate.inimigos.map<IInimigoCombate>((inimigoI, indiceI) => {
                if (indiceI === 0) {
                    inimigoI.auxPosturaInimigo = EPosturaInimigo.ATACANTE;
                }
                return inimigoI;
            });
            break;
    }
    return combate;
}

export function AvaliarResultadoCombateDaPaginaCampanhaCombate(combate: ICombate, panilha: IPanilha) {
    if (!combate.inimigos.find((inimigoI) => inimigoI.auxPosturaInimigo !== EPosturaInimigo.MORTO)) {
        return EResultadoCombate.VITORIA;
    }
    switch (combate.aprovacaoDerrota) {
        case "SerieDeAtaqueEhMaiorOuIgualAHabilidade":
            if (combate.auxSerieDeAtaqueAtual >= panilha.habilidade) {
                return EResultadoCombate.DERROTA;
            }
            break;
        case "InimigoComSeriesDeAtaqueVencidosConsecutivos_2":
            if (combate.inimigos.find((inimigoI) => inimigoI.auxSeriesDeAtaqueVencidosConsecutivos >= 2)) {
                return EResultadoCombate.DERROTA;
            }
            break;
    }
    return EResultadoCombate._COMBATENDO;
}
