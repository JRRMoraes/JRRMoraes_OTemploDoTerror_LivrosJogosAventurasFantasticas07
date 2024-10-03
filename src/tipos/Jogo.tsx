export interface IPanilha {
    jogador: string;
    habilidade: number;
    habilidadeInicial: number;
    energia: number;
    energiaInicial: number;
    sorte: number;
    sorteInicial: number;
}

export interface IJogo {
    idJogo: number;
    panilha?: IPanilha;
    campanhaCapitulo: "PAGINAS_INICIAIS" | "PAGINAS_CAMPANHA";
    campanhaIndice: number;
    dataSalvo: Date;
}

export function CriarJogoNulo(idJogo: number): IJogo {
    let retorno: IJogo = {
        idJogo: idJogo,
        panilha: undefined,
        campanhaCapitulo: "PAGINAS_INICIAIS",
        campanhaIndice: 0,
        dataSalvo: null!,
    };
    return retorno;
}
