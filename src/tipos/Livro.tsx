import { RefObject } from "react";
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
}

export interface IEfeitoExecutor extends IEfeito {
    exeProcessoEfeito: EProcesso;
}

export interface IHistoria {
    textosHistoria: string[];
    efeitos: IEfeito[];
    imagem: string;
}

export interface IHistoriaExecutor extends IHistoria {
    exeProcessoHistoria: EProcesso;
}

export const HISTORIA_ZERADA: IHistoria = {
    textosHistoria: [],
    efeitos: [],
    imagem: "",
};

export enum EPosturaInimigo {
    _AGUARDANDO = "Aguardando",
    ATACANTE = "Atacante",
    APOIO = "Apoio",
    MORTO = "Morto",
}

export enum EResultadoCombate {
    _COMBATENDO,
    VITORIA,
    DERROTA,
}

export interface IInimigo {
    inimigo: string;
    habilidade: number;
    energia: number;
}

export interface IInimigoExecutor extends IInimigo {
    exeEnergiaAtual: number;
    exePosturaInimigo: EPosturaInimigo;
    exeSerieDeAtaqueVencidosConsecutivos: number;
}

export interface ICombate {
    inimigos: IInimigo[];
    aliado: IInimigo;
    textosDerrota: string[];
    aprovacaoDerrota: string;
    combateMultiplo_2osApoio: boolean;
}

export interface ICombateExecutor extends ICombate {
    inimigos: IInimigoExecutor[];
    aliado: IInimigoExecutor;
    exeIdPaginaDestinoDerrota: number;
    exeSerieDeAtaqueAtual: number;
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

export interface IDestinoExecutor extends IDestino {}

export interface IPagina {
    idPagina: number;
    idCapitulo: ECampanhaCapitulo;
    titulo: string;
    historias: IHistoria[];
    combate: ICombate;
    destinos: IDestino[];
}

export interface IPaginaExecutor extends IPagina {
    historias: IHistoriaExecutor[];
    combate: ICombateExecutor;
    destinos: IDestinoExecutor[];
    exeEhJogoCarregado: boolean;
    exeIdPaginaDestino: number;
    exeIdCapituloDestino: ECampanhaCapitulo;
    exeEstado: EPaginaCampanhaEstado;
    exeProcessoHistorias: EProcesso;
    exeProcessoCombate: EProcesso;
    exeProcessoDestinos: EProcesso;
    exeEfeitosAtuais: IEfeitoExecutor[];
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
    _NULO = "_",
    INICIALIZADO = "INICIALIZADO",
    HISTORIAS = "HISTORIAS",
    COMBATE = "COMBATE",
    DESTINOS = "DESTINOS",
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

export function RetornarPaginaCampanhaCombateInicial(combate: ICombateExecutor, ehJogoCarregado: boolean) {
    if (ehJogoCarregado) {
        combate.inimigos = combate.inimigos.map((inimigoI) => {
            inimigoI.exePosturaInimigo = EPosturaInimigo.MORTO;
            return inimigoI;
        });
        return combate;
    }
    combate.inimigos = combate.inimigos.map((inimigoI) => {
        inimigoI.exePosturaInimigo = EPosturaInimigo._AGUARDANDO;
        return inimigoI;
    });
    combate.inimigos = combate.inimigos.map((inimigoI, indiceI) => {
        if (indiceI === 0) {
            inimigoI.exePosturaInimigo = EPosturaInimigo.ATACANTE;
        } else {
            if (combate.combateMultiplo_2osApoio) {
                inimigoI.exePosturaInimigo = EPosturaInimigo.APOIO;
            }
        }
        return inimigoI;
    });
    return combate;
}

export function AvaliarResultadoCombateDaPaginaCampanhaCombate(combate: ICombateExecutor, panilha: IPanilha) {
    if (!combate.inimigos.find((inimigoI) => inimigoI.exePosturaInimigo !== EPosturaInimigo.MORTO)) {
        return EResultadoCombate.VITORIA;
    }
    switch (combate.aprovacaoDerrota) {
        case "SerieDeAtaqueEhMaiorOuIgualAHabilidade":
            if (combate.exeSerieDeAtaqueAtual >= panilha.habilidade) {
                return EResultadoCombate.DERROTA;
            }
            break;
        case "InimigoComSeriesDeAtaqueVencidosConsecutivos_2":
            if (combate.inimigos.find((inimigoI) => inimigoI.exeSerieDeAtaqueVencidosConsecutivos >= 2)) {
                return EResultadoCombate.DERROTA;
            }
            break;
    }
    return EResultadoCombate._COMBATENDO;
}
