import { RefObject } from "react";
import { EProcesso, TextosIguais } from "../uteis";
import { IEfeito, IDestino, PAGINA_INICIAL, PAGINA_ZERADA } from "./Livro";
import { DieContainerRef } from "react-dice-complete/dist/DiceContainer";

export interface IItem {
    idItem: string;
    quantidade: number;
}

export enum EJogoNivel {
    _NORMAL = "Normal",
    FACIL = "Fácil",
}

export interface IPanilha {
    nome: string;
    nivel: EJogoNivel;
    habilidade: number;
    habilidadeInicial: number;
    energia: number;
    energiaInicial: number;
    sorte: number;
    sorteInicial: number;
    ouro: number;
    provisao: number;
    itens: IItem[];
    encantos: string[];
}

export enum ECampanhaCapitulo {
    _NULO = "_",
    PAGINAS_INICIAIS = "PAGINAS_INICIAIS",
    PAGINAS_CAMPANHA = "PAGINAS_CAMPANHA",
}

export interface IJogo {
    idJogo: number;
    panilha: IPanilha;
    campanhaCapitulo: ECampanhaCapitulo;
    campanhaIndice: number;
    dataCriacao: Date;
    dataSalvo: Date;
}

export function CriarJogoNulo(idJogo: number): IJogo {
    let retorno: IJogo = {
        idJogo: idJogo,
        panilha: null!,
        campanhaCapitulo: PAGINA_ZERADA.idCapitulo,
        campanhaIndice: PAGINA_ZERADA.idPagina,
        dataCriacao: null!,
        dataSalvo: null!,
    };
    return retorno;
}

export interface IDadosRoladosParaPanilhaNova {
    habilidade1: number;
    energia1: number;
    energia2: number;
    sorte1: number;
}

export interface ITotaisRoladosParaPanilhaNova {
    habilidade: number;
    energia: number;
    sorte: number;
}

export interface IRolagemParaPanilhaNova {
    processoRolagem: EProcesso;
    rolagens: IDadosRoladosParaPanilhaNova;
    totais: ITotaisRoladosParaPanilhaNova;
}

export const ROLAGEM_PARA_PANILHA_NOVA_ZERADA: IRolagemParaPanilhaNova = {
    processoRolagem: EProcesso._ZERO,
    rolagens: {
        habilidade1: 0,
        energia1: 0,
        energia2: 0,
        sorte1: 0,
    },
    totais: {
        habilidade: 0,
        energia: 0,
        sorte: 0,
    },
};

export interface IRolagemParaDestino {
    processoRolagem: EProcesso;
    total: number;
    destino: IDestino;
}

export const ROLAGEM_PARA_DESTINO_ZERADA: IRolagemParaDestino = {
    processoRolagem: EProcesso._ZERO,
    total: 0,
    destino: null!,
};

export interface IRolagemParaCombate {
    exeIdRolagemCombate: number;
    exeProcessoRolagem: EProcesso;
    exeProcessoSorteConfirmacao: EProcesso;
    exeDadosJogadorRef: RefObject<DieContainerRef>;
    exeRolagemTotalJogador: number;
    exeDadosInimigoRef: RefObject<DieContainerRef>;
    exeRolagemTotalInimigo: number;
    exeDadosSorteRef: RefObject<DieContainerRef>;
    exeRolagemTotalSorte: number;
}

export function AjustarSeForNovoJogo(jogoSalvo: IJogo) {
    if (!jogoSalvo.dataCriacao) {
        jogoSalvo.dataCriacao = new Date();
        jogoSalvo.dataSalvo = jogoSalvo.dataCriacao;
    }
    if (!jogoSalvo.campanhaCapitulo) {
        jogoSalvo.campanhaCapitulo = PAGINA_INICIAL.idCapitulo;
        jogoSalvo.campanhaIndice = PAGINA_INICIAL.idPagina;
        jogoSalvo.panilha = null!;
    }
    if (jogoSalvo.campanhaCapitulo === PAGINA_INICIAL.idCapitulo && jogoSalvo.campanhaIndice < PAGINA_INICIAL.idPagina) {
        jogoSalvo.campanhaIndice = PAGINA_INICIAL.idPagina;
        jogoSalvo.panilha = null!;
    }
    return jogoSalvo;
}

export function CriarPanilhaViaRolagens(totaisRolados: ITotaisRoladosParaPanilhaNova, nome: string, nivel: EJogoNivel): IPanilha {
    return {
        nome: nome,
        nivel: nivel,
        habilidade: totaisRolados.habilidade,
        habilidadeInicial: totaisRolados.habilidade,
        energia: totaisRolados.energia,
        energiaInicial: totaisRolados.energia,
        sorte: totaisRolados.sorte,
        sorteInicial: totaisRolados.sorte,
        ouro: 0,
        provisao: 0,
        itens: [],
        encantos: [],
    };
}

export function RetornarPanilhaItensAtualizados(itens: IItem[], efeito: IEfeito): IItem[] {
    if (!efeito.nomeEfeito) {
        return itens;
    }
    if (itens.find((itemI) => TextosIguais(itemI.idItem, efeito.nomeEfeito))) {
        itens = itens.map((itemI) => {
            if (TextosIguais(itemI.idItem, efeito.nomeEfeito)) {
                return { ...itemI, quantidade: Math.max(0, itemI.quantidade + efeito.quantidade) };
            }
            return itemI;
        });
    } else if (efeito.quantidade > 0) {
        itens = [...itens, { idItem: efeito.nomeEfeito, quantidade: efeito.quantidade }];
    }
    return itens.filter((itemI) => itemI.quantidade > 0);
}

export function RetornarPanilhaEncantosAtualizados(encantos: string[], efeito: IEfeito): string[] {
    if (!efeito.nomeEfeito) {
        return encantos;
    }
    if (encantos.find((encantoI) => TextosIguais(encantoI, efeito.nomeEfeito))) {
        encantos = encantos.map((encantoI) => {
            if (TextosIguais(encantoI, efeito.nomeEfeito)) {
                return efeito.quantidade >= 1 ? efeito.nomeEfeito : "";
            }
            return encantoI;
        });
    } else if (efeito.quantidade > 0) {
        encantos = [...encantos, efeito.nomeEfeito];
    }
    return encantos.filter((encantoI) => !TextosIguais(encantoI, ""));
}
