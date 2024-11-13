import { RefObject } from "react";
import { EProcesso } from "../uteis";
import { ECampanhaCapitulo } from "./Jogo";
import {
    ATAQUE_DANO_INIMIGO,
    ATAQUE_DANO_JOGADOR,
    MORTE_DANO_JOGADOR,
    SORTE_DERROTA_CURA_INIMIGO,
    SORTE_DERROTA_DANO_JOGADOR,
    SORTE_VITORIA_CURA_JOGADOR,
    SORTE_VITORIA_DANO_INIMIGO,
} from "../globais/Constantes";

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

export interface IEfeitoExecucao extends IEfeito {
    exeProcessoEfeito: EProcesso;
    exeIdEfeito: number;
}

export interface IEfeitoInimigoExecucao extends IEfeitoExecucao {
    exeIdInimigo: number;
}

export function ObterEfeitosExecucaoDeEnergia(idEfeito: number, texto: string, quantidade: number): IEfeitoExecucao[] {
    return [
        {
            atributoEfeito: EAtributo.ENERGIA,
            textoEfeito: texto,
            nomeEfeito: "",
            quantidade: quantidade,
            exeProcessoEfeito: EProcesso._ZERO,
            exeIdEfeito: idEfeito,
        },
    ];
}

export function EFEITO_MORTE_NO_JOGADOR(): IEfeitoExecucao[] {
    return ObterEfeitosExecucaoDeEnergia(99100, "MORTE!!!", MORTE_DANO_JOGADOR);
}

export function EFEITO_ATAQUE_NO_JOGADOR(): IEfeitoExecucao[] {
    return ObterEfeitosExecucaoDeEnergia(99101, "ATAQUE!!!", ATAQUE_DANO_JOGADOR);
}

export function EFEITO_SORTE_VITORIA_EM_DEFESA_DO_JOGADOR(): IEfeitoExecucao[] {
    return ObterEfeitosExecucaoDeEnergia(99102, "SORTE!!!", SORTE_VITORIA_CURA_JOGADOR);
}

export function EFEITO_SORTE_DERROTA_EM_DEFESA_DO_JOGADOR(): IEfeitoExecucao[] {
    return ObterEfeitosExecucaoDeEnergia(99103, "AZAR!!!", SORTE_DERROTA_DANO_JOGADOR);
}

export function ObterEfeitosInimigoExecucaoDeEnergia(idEfeito: number, idInimigo: number, texto: string, quantidade: number): IEfeitoInimigoExecucao[] {
    return [
        {
            atributoEfeito: EAtributo.ENERGIA,
            textoEfeito: texto,
            nomeEfeito: "",
            quantidade: quantidade,
            exeProcessoEfeito: EProcesso._ZERO,
            exeIdEfeito: idEfeito,
            exeIdInimigo: idInimigo,
        },
    ];
}

export function EFEITO_ATAQUE_NO_INIMIGO(idInimigo: number): IEfeitoInimigoExecucao[] {
    return ObterEfeitosInimigoExecucaoDeEnergia(99201, idInimigo, "ATAQUE!!!", ATAQUE_DANO_INIMIGO);
}

export function EFEITO_SORTE_VITORIA_EM_ATAQUE_NO_INIMIGO(idInimigo: number): IEfeitoInimigoExecucao[] {
    return ObterEfeitosInimigoExecucaoDeEnergia(99202, idInimigo, "SORTE!!!", SORTE_VITORIA_DANO_INIMIGO);
}

export function EFEITO_SORTE_DERROTA_EM_ATAQUE_NO_INIMIGO(idInimigo: number): IEfeitoInimigoExecucao[] {
    return ObterEfeitosInimigoExecucaoDeEnergia(99203, idInimigo, "AZAR!!!", SORTE_DERROTA_CURA_INIMIGO);
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

export interface IHistoriaTextoExecucao {
    textosHistoria: string[];
    exeProcessoTexto: EProcesso;
}

export interface IHistoriaEfeitoExecucao {
    efeitos: IEfeitoExecucao[];
    exeProcessoEfeito: EProcesso;
}

export enum EPosturaInimigo {
    _AGUARDANDO = "Aguardando",
    ATACANTE = "Atacante",
    APOIO = "Apoio",
    MORTO = "Morto",
}

export enum EResultadoCombate {
    _COMBATENDO = "Combatendo",
    VITORIA = "Vitória",
    DERROTA = "Derrota",
}

export enum EResultadoDados {
    _NULO = "_",
    VITORIA = "Vitória",
    DERROTA = "Derrota",
    EMPATE = "Empate",
}

export interface IInimigo {
    inimigo: string;
    habilidade: number;
    energia: number;
}

export interface IInimigoExecucao extends IInimigo {
    exeEnergiaAtual: number;
    exePosturaInimigo: EPosturaInimigo;
    exeSerieDeAtaqueVencidoConsecutivo: number;
    exeProcessoRolagemAtaque: EProcesso;
    exeProcessoRolagemSorteConfirmacao: EProcesso;
    exeRolagemTotalJogador: number;
    exeRolagemTotalInimigo: number;
    exeRolagemTotalSorte: number;
    exeRolagemResultadoAtaque: EResultadoDados;
    exeRolagemResultadoSorte: EResultadoDados;
}

export interface IAliado {
    aliado: string;
    habilidade: number;
    energia: number;
}

export interface IAliadoExecucao extends IAliado {
    exeEnergiaAtual: number;
    exeEhAliado: boolean;
    exeEstaVivo: boolean;
}

export interface ICombate {
    inimigos: IInimigo[];
    aliado: IAliado;
    textosDerrota: string[];
    aprovacaoDerrota: string;
    combateMultiplo_2osApoio: boolean;
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

export interface IDestinoExecucao extends IDestino {}

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

export enum EPaginaExecutorEstado {
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
