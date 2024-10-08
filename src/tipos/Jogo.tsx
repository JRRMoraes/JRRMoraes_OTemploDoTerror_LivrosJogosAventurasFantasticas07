export interface IPanilhaItem {
    idItem: string;
    quantidade: number;
}

export interface IPanilha {
    jogador: string;
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
}

export interface IJogo {
    idJogo: number;
    panilha?: IPanilha;
    campanhaCapitulo: "PAGINAS_INICIAIS" | "PAGINAS_CAMPANHA";
    campanhaIndice: number;
    dataCriacao: Date;
    dataSalvo: Date;
}

export function CriarJogoNulo(idJogo: number): IJogo {
    let retorno: IJogo = {
        idJogo: idJogo,
        panilha: undefined,
        campanhaCapitulo: "PAGINAS_INICIAIS",
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

export function CriarPanilhaViaRolagens(totaisRolados: ITotaisRoladosParaPanilhaNova): IPanilha {
    return {
        jogador: "",
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
    };
}

export const COR_HABILIDADE = "#87ceeb";
export const COR_ENERGIA = "#008000";
export const COR_SORTE = "#800080";
