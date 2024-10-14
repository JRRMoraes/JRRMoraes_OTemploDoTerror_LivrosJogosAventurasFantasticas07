import { SubstituirTexto, TextosIguais } from "../uteis";
import { IEfeito, PAGINA_INICIAL, PAGINA_ZERADA } from "./Livro";

export interface IItem {
    idItem: string;
    quantidade: number;
}

export enum EJogoNivel {
    _NORMAL,
    FACIL,
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
    encantos: string[];
    itens: IItem[];
    auxEfeitos: IEfeito[];
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
        encantos: [],
        itens: [],
        auxEfeitos: [],
    };
}

export function RetornarPanilhaEncantosAtualizados(encantos: string[], efeito: IEfeito): string[] {
    const _encantoNome = SubstituirTexto(efeito.sobre, "ENCANTOS:", "", true);
    if (!_encantoNome) {
        return encantos;
    }
    if (encantos.find((encantoI) => TextosIguais(encantoI, _encantoNome))) {
        encantos = encantos.map((encantoI) => {
            if (TextosIguais(encantoI, _encantoNome)) {
                return efeito.quantidade >= 1 ? _encantoNome : "";
            }
            return encantoI;
        });
    } else if (efeito.quantidade > 0) {
        encantos = [...encantos, _encantoNome];
    }
    return encantos.filter((encantoI) => !TextosIguais(encantoI, ""));
}

export function RetornarPanilhaItensAtualizados(itens: IItem[], efeito: IEfeito): IItem[] {
    const _itemNome = SubstituirTexto(efeito.sobre, "ITENS:", "", true);
    if (!_itemNome) {
        return itens;
    }
    if (itens.find((itemI) => TextosIguais(itemI.idItem, _itemNome))) {
        itens = itens.map((itemI) => {
            if (TextosIguais(itemI.idItem, _itemNome)) {
                return { ...itemI, quantidade: Math.max(0, itemI.quantidade + efeito.quantidade) };
            }
            return itemI;
        });
    } else if (efeito.quantidade > 0) {
        itens = [...itens, { idItem: _itemNome, quantidade: efeito.quantidade }];
    }
    return itens.filter((itemI) => itemI.quantidade > 0);
}
