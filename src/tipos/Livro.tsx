import { RefObject } from "react";
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
}

export interface IEfeitoExecucao extends IEfeito {
    exeProcessoEfeito: EProcesso;
    exeIdEfeito: number;
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

export interface IHistoriaExecucao extends IHistoria {
    efeitos: IEfeitoExecucao[];
    exeProcessoHistoria: EProcesso;
    exeProcessoTexto: EProcesso;
    exeProcessoEfeito: EProcesso;
}

export interface IHistoriasExecutor {
    historias: IHistoriaExecucao[];
    processoHistorias: EProcesso;
    indiceHistoria: number;
    efeitosAtuais: IEfeitoExecucao[];
}

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

export interface IInimigoExecucao extends IInimigo {
    exeEnergiaAtual: number;
    exePosturaInimigo: EPosturaInimigo;
    exeSerieDeAtaqueVencidoConsecutivo: number;
    exeIdRolagemCombate: number;
}

export interface IAliado {
    aliado: string;
    habilidade: number;
    energia: number;
}

export interface IAliadoExecucao extends IAliado {
    exeEnergiaAtual: number;
}

export interface ICombate {
    inimigos: IInimigo[];
    aliado: IAliado;
    textosDerrota: string[];
    aprovacaoDerrota: string;
    combateMultiplo_2osApoio: boolean;
}

export interface ICombateExecutor extends ICombate {
    inimigos: IInimigoExecucao[];
    aliado: IAliadoExecucao;
    processoCombate: EProcesso;
    serieDeAtaqueAtual: number;
    processoSerieDeAtaque: EProcesso;
    resultadoCombate: EResultadoCombate;
    idPaginaDestinoDerrota: number;
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

export interface IDestinosExecutor {
    destinos: IDestinoExecucao[];
    processoDestinos: EProcesso;
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

export interface IPaginaExecutor extends IPagina {
    exeEhJogoCarregado: boolean;
    exeProcessoPagina: EProcesso;
    exeIdPaginaDestino: number;
    exeIdCapituloDestino: ECampanhaCapitulo;
    exeEstado: EPaginaExecutorEstado;
}

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

export function RetornarHistoriasExecutorViaPagina(pagina: IPagina, ehJogoCarregado: boolean): IHistoriasExecutor {
    const _historiasExecutor: IHistoriasExecutor = {
        historias: [],
        processoHistorias: EProcesso._ZERO,
        indiceHistoria: 0,
        efeitosAtuais: [],
    };
    if (pagina.historias && pagina.historias.length) {
        _historiasExecutor.historias = pagina.historias.map<IHistoriaExecucao>((historiaI) => {
            const _historiaExecucao: IHistoriaExecucao = {
                textosHistoria: historiaI.textosHistoria,
                efeitos: [],
                imagem: historiaI.imagem,
                exeProcessoHistoria: EProcesso._ZERO,
                exeProcessoTexto: EProcesso._ZERO,
                exeProcessoEfeito: ehJogoCarregado ? EProcesso.CONCLUIDO : EProcesso._ZERO,
            };
            if (historiaI.efeitos && historiaI.efeitos.length) {
                _historiaExecucao.efeitos = historiaI.efeitos.map<IEfeitoExecucao>((efeitoI) => {
                    const _efeitoExecucaoI: IEfeitoExecucao = {
                        ...efeitoI,
                        exeProcessoEfeito: EProcesso._ZERO,
                        exeIdEfeito: Math.ceil(Math.random() * 1000),
                    };
                    return { ..._efeitoExecucaoI };
                });
            }
            return { ..._historiaExecucao };
        });
    }
    return _historiasExecutor;
}

export function RetornarCombateExecutorViaPagina(pagina: IPagina): ICombateExecutor {
    const _combateExecutor: ICombateExecutor = {
        inimigos: null!,
        aliado: null!,
        textosDerrota: null!,
        aprovacaoDerrota: null!,
        combateMultiplo_2osApoio: null!,
        processoCombate: EProcesso._ZERO,
        serieDeAtaqueAtual: 0,
        processoSerieDeAtaque: EProcesso._ZERO,
        resultadoCombate: EResultadoCombate._COMBATENDO,
        idPaginaDestinoDerrota: PAGINA_ZERADA.idPagina,
    };
    if (pagina.combate) {
        if (pagina.combate.inimigos && pagina.combate.inimigos.length) {
            _combateExecutor.inimigos = pagina.combate.inimigos.map<IInimigoExecucao>((inimigoI) => {
                const _inimigoExecucao: IInimigoExecucao = {
                    ...inimigoI,
                    exeEnergiaAtual: inimigoI.energia,
                    exePosturaInimigo: EPosturaInimigo._AGUARDANDO,
                    exeSerieDeAtaqueVencidoConsecutivo: 0,
                    exeIdRolagemCombate: Math.ceil(Math.random() * 1000),
                };
                return { ..._inimigoExecucao };
            });
        }
        if (pagina.combate.aliado) {
            _combateExecutor.aliado = {
                ...pagina.combate.aliado,
                exeEnergiaAtual: pagina.combate.aliado.energia,
            };
        }
    }
    return _combateExecutor;
}

export function RetornarDestinosExecutorViaPagina(pagina: IPagina, padraoCapitulo: ECampanhaCapitulo, ehJogoCarregado: boolean): IDestinosExecutor {
    const _destinosExecutor: IDestinosExecutor = {
        destinos: [],
        processoDestinos: EProcesso._ZERO,
    };
    if (pagina.destinos && pagina.destinos.length) {
        _destinosExecutor.destinos = pagina.destinos.map<IDestinoExecucao>((destinoI) => ({
            ...destinoI,
            exeProcessoEfeito: EProcesso._ZERO,
            idCapitulo: destinoI.idCapitulo && destinoI.idCapitulo !== ECampanhaCapitulo._NULO ? destinoI.idCapitulo : padraoCapitulo,
        }));
    }
    return _destinosExecutor;
}

export function RetornarPaginaExecutorViaPagina(pagina: IPagina, padraoCapitulo: ECampanhaCapitulo, ehJogoCarregado: boolean): IPaginaExecutor {
    const _paginaExecutor: IPaginaExecutor = {
        idPagina: pagina.idPagina,
        idCapitulo: padraoCapitulo,
        titulo: pagina.titulo,
        historias: pagina.historias,
        combate: pagina.combate,
        destinos: pagina.destinos,
        exeEhJogoCarregado: ehJogoCarregado,
        exeProcessoPagina: EProcesso._ZERO,
        exeIdPaginaDestino: PAGINA_ZERADA.idPagina,
        exeIdCapituloDestino: PAGINA_ZERADA.idCapitulo,
        exeEstado: EPaginaExecutorEstado.INICIALIZADO,
    };
    return _paginaExecutor;
}

export function RetornarCombateExecutorNoProcessoInicial(combate: ICombateExecutor, ehJogoCarregado: boolean) {
    if (!combate.inimigos || !combate.inimigos.length) {
        combate.processoCombate = EProcesso.CONCLUIDO;
        return combate;
    }
    if (ehJogoCarregado) {
        combate.inimigos = combate.inimigos.map((inimigoI) => {
            inimigoI.exePosturaInimigo = EPosturaInimigo.MORTO;
            inimigoI.exeEnergiaAtual = 0;
            return inimigoI;
        });
        combate.processoCombate = EProcesso.CONCLUIDO;
        return combate;
    }
    combate.processoCombate = EProcesso.INICIANDO;
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
