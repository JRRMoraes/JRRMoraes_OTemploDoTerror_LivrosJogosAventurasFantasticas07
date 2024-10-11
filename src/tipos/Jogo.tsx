import { EProcesso, SubstituirTexto, TextosIguais } from "../uteis";
import { IEfeito } from "./Livro";

export interface IPanilhaItem {
    idItem: string;
    quantidade: number;
}

export interface IPanilha {
    habilidade: number;
    habilidadeInicial: number;
    energia: number;
    energiaInicial: number;
    sorte: number;
    sorteInicial: number;
    ouro: number;
    provisao: number;
    encantos: string[];
    itens: IPanilhaItem[];
    auxEfeitos: IEfeito[];
    auxProcessoEfeito: EProcesso;
}

export enum ECampanhaCapitulo {
    _NULO = "_",
    PAGINAS_INICIAIS = "Iníciais",
    PAGINAS_CAMPANHA = "Campanha",
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
        campanhaCapitulo: ECampanhaCapitulo.PAGINAS_INICIAIS,
        campanhaIndice: 0,
        dataCriacao: null!,
        dataSalvo: null!,
    };
    return retorno;
}

export interface IRolagensParaPanilhaNova {
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

export const COR_HABILIDADE = "#87ceeb";
export const COR_ENERGIA = "#008000";
export const COR_SORTE = "#800080";

export function CriarPanilhaViaRolagens(totaisRolados: ITotaisRoladosParaPanilhaNova): IPanilha {
    return {
        habilidade: totaisRolados.habilidade,
        habilidadeInicial: totaisRolados.habilidade,
        energia: totaisRolados.energia,
        energiaInicial: totaisRolados.energia,
        sorte: totaisRolados.sorte,
        sorteInicial: totaisRolados.sorte,
        ouro: 0,
        provisao: 0,
        encantos: [],
        itens: [],
        auxEfeitos: null!,
        auxProcessoEfeito: EProcesso._ZERO,
    };
}

export const RetornarPanilhaEncantosAtualizados = (encantos: string[], efeito: IEfeito): string[] => {
    let _encantoNome = SubstituirTexto(efeito.sobre, "ENCANTOS:", "", true);
    if (!_encantoNome) {
        return encantos;
    }
    const _encantos = encantos.map((encantoI) => {
        if (TextosIguais(encantoI, _encantoNome)) {
            return efeito.valor >= 1 ? _encantoNome : "";
        }
        return encantoI;
    });
    return _encantos.filter((encantoI) => !TextosIguais(encantoI, ""));
};

export const RetornarPanilhaItensAtualizados = (itens: IPanilhaItem[], efeito: IEfeito): IPanilhaItem[] => {
    let _itemNome = SubstituirTexto(efeito.sobre, "ITENS:", "", true);
    if (!_itemNome) {
        return itens;
    }
    const _itens = itens.map((itemI) => {
        if (TextosIguais(itemI.idItem, _itemNome)) {
            return { ...itemI, quantidade: Math.max(0, itemI.quantidade + efeito.valor) };
        }
        return itemI;
    });
    return _itens.filter((itemI) => itemI.quantidade > 0);
};
