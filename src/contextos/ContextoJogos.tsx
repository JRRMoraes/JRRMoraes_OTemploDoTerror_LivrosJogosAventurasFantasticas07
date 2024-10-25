import { Dispatch, SetStateAction, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    IJogo,
    IPagina,
    IPaginaExecutor,
    IEfeito,
    IEfeitoExecutor,
    EJogoNivel,
    EAtributo,
    PAGINA_ZERADA,
    CriarJogoNulo,
    AjustarSeForNovoJogo,
    ITotaisRoladosParaPanilhaNova,
    CriarPanilhaViaRolagens,
    ECampanhaCapitulo,
    EPaginaCampanhaEstado,
    RetornarPanilhaEncantosAtualizados,
    RetornarPanilhaItensAtualizados,
    RetornarPaginaCampanhaCombateInicial,
    EPosturaInimigo,
} from "../tipos";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO } from "../globais/Constantes";

export type TContextoBaseJogos = {
    jogoSalvo1: IJogo;
    setJogoSalvo1: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo2: IJogo;
    setJogoSalvo2: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo3: IJogo;
    setJogoSalvo3: Dispatch<SetStateAction<IJogo>>;
    jogoAtual: IJogo;
    setJogoAtual: Dispatch<SetStateAction<IJogo>>;
    paginaExecutor: IPaginaExecutor;
    setPaginaExecutor: Dispatch<SetStateAction<IPaginaExecutor>>;
    padraoCapitulo: ECampanhaCapitulo;
    setPadraoCapitulo: Dispatch<SetStateAction<ECampanhaCapitulo>>;
};

export const ContextoBaseJogos = createContext<TContextoBaseJogos>(null!);
ContextoBaseJogos.displayName = "Jogos";

export const ContextoJogos = () => {
    const { jogoSalvo1, setJogoSalvo1, jogoSalvo2, setJogoSalvo2, jogoSalvo3, setJogoSalvo3, jogoAtual, setJogoAtual, paginaExecutor, setPaginaExecutor, padraoCapitulo, setPadraoCapitulo } =
        useContext(ContextoBaseJogos);

    const navegador = useNavigate();

    useEffect(() => {
        if (
            jogoAtual &&
            jogoAtual.panilha &&
            paginaExecutor &&
            paginaExecutor.exeEfeitosAtuais &&
            paginaExecutor.exeEfeitosAtuais.length &&
            paginaExecutor.exeEfeitosAtuais.find((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.PROCESSANDO)
        ) {
            setPaginaExecutor((prevPaginaExecutor) => {
                prevPaginaExecutor.exeEfeitosAtuais = prevPaginaExecutor.exeEfeitosAtuais.map((efeitoI, indiceI) => {
                    if (efeitoI.exeProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.exeProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.INICIANDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            setPaginaExecutor((prevPaginaExecutor2) => {
                                prevPaginaExecutor2.exeEfeitosAtuais = prevPaginaExecutor2.exeEfeitosAtuais.map((efeitoI2, indiceI2) => {
                                    if (indiceI === indiceI2 && efeitoI2.exeProcessoEfeito === EProcesso.PROCESSANDO) {
                                        efeitoI2.exeProcessoEfeito = EProcesso.CONCLUIDO;
                                    }
                                    return efeitoI2;
                                });
                                return { ...prevPaginaExecutor2 };
                            });
                        }, TEMPO_ANIMACAO);
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.CONCLUIDO) {
                        ImporEfeitoEmJogoAtualNoConcluido(efeitoI);
                        efeitoI.exeProcessoEfeito = EProcesso.DESTRUIDO;
                    }
                    return efeitoI;
                });
                prevPaginaExecutor.exeEfeitosAtuais = prevPaginaExecutor.exeEfeitosAtuais.filter((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.DESTRUIDO);
                return { ...prevPaginaExecutor };
            });
        }
    }, [paginaExecutor]);

    return {
        jogoSalvo1,
        setJogoSalvo1,
        jogoSalvo2,
        setJogoSalvo2,
        jogoSalvo3,
        setJogoSalvo3,
        jogoAtual,
        setJogoAtual,
        paginaExecutor,
        setPaginaExecutor,
        ResetarJogoAtual,
        NavegarParaPaginaLivroJogoComJogoSalvo,
        CarregarJogoSalvoOuNovo,
        SalvarJogoAtualNoSalvo,
        ExcluirJogoSalvo,
        ImporPaginaAtualECampanha,
        ImporPaginaCampanhaEJogoAtualViaDestino,
        ImporPaginaCampanhaViaAtual,
        CriarPanilhaNoJogoAtualViaRolagens,
        AplicarEfeitosDaHistoria,
        AplicarPenalidadeDeTestarSorte,
        ObterEfeitoAtualDoAtributo,
        ImporPaginaCampanhaViaDestino,
        ImporProcessoHistoriasNaPaginaCampanha,
        ImporProcessoCombateNaPaginaCampanha,
        ImporProcessoDestinosNaPaginaCampanha,
        ImporPaginaCampanhaCombateDoProcessoZeroDaSerieDeAtaque,
    };

    function ResetarJogoAtual() {
        setPaginaExecutor(null!);
        setJogoAtual(null!);
        setPadraoCapitulo(ECampanhaCapitulo.PAGINAS_INICIAIS);
    }

    function NavegarParaPaginaLivroJogoComJogoSalvo(jogoSalvo: IJogo) {
        ResetarJogoAtual();
        navegador("/" + jogoSalvo.idJogo);
    }

    function CarregarJogoSalvoOuNovo(idJogoSalvo: string) {
        ResetarJogoAtual();
        if (idJogoSalvo === "1") {
            setJogoAtual(JSON.parse(JSON.stringify(AjustarSeForNovoJogo(jogoSalvo1))));
            ProcessarEImporPadraoCapitulo(jogoSalvo1);
            return !!(jogoSalvo1 && jogoSalvo1.panilha);
        } else if (idJogoSalvo === "2") {
            setJogoAtual(JSON.parse(JSON.stringify(AjustarSeForNovoJogo(jogoSalvo2))));
            ProcessarEImporPadraoCapitulo(jogoSalvo2);
            return !!(jogoSalvo2 && jogoSalvo2.panilha);
        } else if (idJogoSalvo === "3") {
            setJogoAtual(JSON.parse(JSON.stringify(AjustarSeForNovoJogo(jogoSalvo3))));
            ProcessarEImporPadraoCapitulo(jogoSalvo3);
            return !!(jogoSalvo3 && jogoSalvo3.panilha);
        } else if (!idJogoSalvo) {
            return false;
        } else {
            setJogoAtual(null!);
            navegador("/");
            return false;
        }
    }

    function ProcessarEImporPadraoCapitulo(jogo: IJogo) {
        if (jogo.campanhaCapitulo && jogo.campanhaCapitulo !== ECampanhaCapitulo._NULO) {
            setPadraoCapitulo(jogo.campanhaCapitulo);
        }
    }

    function ExcluirJogoSalvo(idJogoSalvo: string) {
        setPaginaExecutor(null!);
        if (idJogoSalvo === "1") {
            setJogoSalvo1(CriarJogoNulo(1));
        } else if (idJogoSalvo === "2") {
            setJogoSalvo2(CriarJogoNulo(2));
        } else if (idJogoSalvo === "3") {
            setJogoSalvo3(CriarJogoNulo(3));
        }
        setJogoAtual(null!);
    }

    function SalvarJogoAtualNoSalvo() {
        if (!jogoAtual) {
            return;
        }
        jogoAtual.dataSalvo = new Date();
        if (jogoAtual.idJogo === 1) {
            setJogoSalvo1(JSON.parse(JSON.stringify(jogoAtual)));
        } else if (jogoAtual.idJogo === 2) {
            setJogoSalvo2(JSON.parse(JSON.stringify(jogoAtual)));
        } else if (jogoAtual.idJogo === 3) {
            setJogoSalvo3(JSON.parse(JSON.stringify(jogoAtual)));
        }
    }

    function ImporPaginaAtualECampanha(pagina: IPagina, jogoCarregado: boolean) {
        if (!pagina || (pagina.idPagina === PAGINA_ZERADA.idPagina && pagina.idCapitulo === PAGINA_ZERADA.idCapitulo)) {
            setPaginaExecutor(null!);
            return jogoCarregado;
        } else if (paginaExecutor && paginaExecutor.idPagina === pagina.idPagina && paginaExecutor.idCapitulo === pagina.idCapitulo) {
            return jogoCarregado;
        } else {
            if (pagina.idCapitulo && pagina.idCapitulo !== padraoCapitulo) {
                setPadraoCapitulo(pagina.idCapitulo);
            }
            setPaginaExecutor(null!);
            setPaginaExecutor({
                idPagina: pagina.idPagina,
                idCapitulo: padraoCapitulo,
                titulo: pagina.titulo,
                exeEhJogoCarregado: jogoCarregado,
                exeIdPaginaDestino: PAGINA_ZERADA.idPagina,
                exeIdCapituloDestino: PAGINA_ZERADA.idCapitulo,
                exeEstado: EPaginaCampanhaEstado._NULO,
                exeProcessoHistorias: EProcesso._ZERO,
                exeProcessoCombate: EProcesso._ZERO,
                exeProcessoDestinos: EProcesso._ZERO,
                historias: [],
                combate: null!,
                destinos: [],
                exeEfeitosAtuais: [],
            });
            setPaginaExecutor((prevPaginaExecutor) => {
                prevPaginaExecutor.exeEstado = EPaginaCampanhaEstado.INICIALIZADO;
                if (pagina.historias && pagina.historias.length) {
                    prevPaginaExecutor.historias = pagina.historias.map((historiaI) => ({
                        ...historiaI,
                        exeProcessoHistoria: EProcesso._ZERO,
                    }));
                }
                if (pagina.combate) {
                    prevPaginaExecutor.combate = {
                        inimigos: [],
                        aliado: null!,
                        textosDerrota: null!,
                        aprovacaoDerrota: null!,
                        combateMultiplo_2osApoio: null!,
                        exeIdPaginaDestinoDerrota: PAGINA_ZERADA.idPagina,
                        exeSerieDeAtaqueAtual: 0,
                    };
                    if (pagina.combate.inimigos && pagina.combate.inimigos.length) {
                        prevPaginaExecutor.combate.inimigos = pagina.combate.inimigos.map((inimigoI) => ({
                            ...inimigoI,
                            exeEnergiaAtual: inimigoI.energia,
                            exePosturaInimigo: EPosturaInimigo._AGUARDANDO,
                            exeSerieDeAtaqueVencidosConsecutivos: 0,
                        }));
                    }
                    if (pagina.combate.aliado) {
                        prevPaginaExecutor.combate.aliado = {
                            ...pagina.combate.aliado,
                            exeEnergiaAtual: pagina.combate.aliado.energia,
                            exePosturaInimigo: EPosturaInimigo.ATACANTE,
                            exeSerieDeAtaqueVencidosConsecutivos: 0,
                        };
                    }
                }
                if (pagina.destinos && pagina.destinos.length) {
                    prevPaginaExecutor.destinos = pagina.destinos.map((destinoI) => ({
                        ...destinoI,
                        exeProcessoEfeito: EProcesso._ZERO,
                        idCapitulo: destinoI.idCapitulo && destinoI.idCapitulo !== ECampanhaCapitulo._NULO ? destinoI.idCapitulo : padraoCapitulo,
                    }));
                }
                return { ...prevPaginaExecutor };
            });
            return false;
        }
    }

    function ImporPaginaCampanhaEJogoAtualViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        setPaginaExecutor(null!);
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, campanhaIndice: idPaginaDestino, campanhaCapitulo: idCapituloDestino };
        });
    }

    function ImporPaginaCampanhaViaAtual() {
        if (!paginaExecutor) {
            return;
        }
        if (paginaExecutor.exeEstado === EPaginaCampanhaEstado.INICIALIZADO) {
            setPaginaExecutor((prevPaginaExecutor) => {
                return { ...prevPaginaExecutor, exeEstado: EPaginaCampanhaEstado.HISTORIAS };
            });
        } else if (paginaExecutor.exeEstado === EPaginaCampanhaEstado.HISTORIAS) {
            if (paginaExecutor.exeProcessoHistorias === EProcesso._ZERO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoHistorias: EProcesso.INICIANDO };
                });
            } else if (paginaExecutor.exeProcessoHistorias === EProcesso.CONCLUIDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    prevPaginaExecutor.exeProcessoHistorias = EProcesso.DESTRUIDO;
                    prevPaginaExecutor.exeEstado = EPaginaCampanhaEstado.COMBATE;
                    return { ...prevPaginaExecutor };
                });
            }
        } else if (paginaExecutor.exeEstado === EPaginaCampanhaEstado.COMBATE) {
            if (paginaExecutor.exeProcessoCombate === EProcesso._ZERO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    prevPaginaExecutor.exeProcessoCombate = EProcesso.INICIANDO;
                    if (prevPaginaExecutor.combate && prevPaginaExecutor.combate.inimigos && prevPaginaExecutor.combate.inimigos.length) {
                        prevPaginaExecutor.combate = RetornarPaginaCampanhaCombateInicial(prevPaginaExecutor.combate, prevPaginaExecutor.exeEhJogoCarregado);
                    } else {
                        prevPaginaExecutor.exeProcessoCombate = EProcesso.CONCLUIDO;
                    }
                    return { ...prevPaginaExecutor };
                });
            } else if (paginaExecutor.exeProcessoCombate === EProcesso.CONCLUIDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    prevPaginaExecutor.exeProcessoCombate = EProcesso.DESTRUIDO;
                    prevPaginaExecutor.exeEstado = EPaginaCampanhaEstado.DESTINOS;
                    return { ...prevPaginaExecutor };
                });
            }
        } else if (paginaExecutor.exeEstado === EPaginaCampanhaEstado.DESTINOS) {
            if (paginaExecutor.exeProcessoDestinos === EProcesso._ZERO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoDestinos: EProcesso.INICIANDO };
                });
            } else if (paginaExecutor.exeProcessoDestinos === EProcesso.INICIANDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoDestinos: EProcesso.PROCESSANDO };
                });
            } else if (paginaExecutor.exeProcessoDestinos === EProcesso.CONCLUIDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoDestinos: EProcesso.DESTRUIDO };
                });
            }
        }
    }

    function CriarPanilhaNoJogoAtualViaRolagens(totaisRolados: ITotaisRoladosParaPanilhaNova, nome: string, nivel: EJogoNivel) {
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, panilha: CriarPanilhaViaRolagens(totaisRolados, nome, nivel) };
        });
    }

    function AplicarEfeitosDaHistoria(efeitos: IEfeito[]) {
        setPaginaExecutor((prevPaginaExecutor) => {
            efeitos.forEach((efeitoI) => (prevPaginaExecutor.exeEfeitosAtuais = [...prevPaginaExecutor.exeEfeitosAtuais, { ...efeitoI, exeProcessoEfeito: EProcesso._ZERO }]));
            return { ...prevPaginaExecutor };
        });
    }

    function ImporEfeitoEmJogoAtualNoConcluido(efeito: IEfeitoExecutor) {
        if (!efeito || efeito.exeProcessoEfeito !== EProcesso.CONCLUIDO) {
            return;
        }
        switch (efeito.atributoEfeito) {
            case EAtributo.HABILIDADE:
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.panilha.habilidade += efeito.quantidade;
                    prevJogoAtual.panilha.habilidade = Math.max(prevJogoAtual.panilha.habilidade, 0);
                    prevJogoAtual.panilha.habilidade = Math.min(prevJogoAtual.panilha.habilidade, prevJogoAtual.panilha.habilidadeInicial);
                    return { ...prevJogoAtual };
                });
                break;
            case EAtributo.ENERGIA:
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.panilha.energia += efeito.quantidade;
                    prevJogoAtual.panilha.energia = Math.max(prevJogoAtual.panilha.energia, 0);
                    prevJogoAtual.panilha.energia = Math.min(prevJogoAtual.panilha.energia, prevJogoAtual.panilha.energiaInicial);
                    return { ...prevJogoAtual };
                });
                break;
            case EAtributo.SORTE:
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.panilha.sorte += efeito.quantidade;
                    prevJogoAtual.panilha.sorte = Math.max(prevJogoAtual.panilha.sorte, 0);
                    prevJogoAtual.panilha.sorte = Math.min(prevJogoAtual.panilha.sorte, prevJogoAtual.panilha.sorteInicial);
                    return { ...prevJogoAtual };
                });
                break;
            case EAtributo.OURO:
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.panilha.ouro += efeito.quantidade;
                    prevJogoAtual.panilha.ouro = Math.max(prevJogoAtual.panilha.ouro, 0);
                    return { ...prevJogoAtual };
                });
                break;
            case EAtributo.PROVISAO:
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.panilha.provisao += efeito.quantidade;
                    prevJogoAtual.panilha.provisao = Math.max(prevJogoAtual.panilha.provisao, 0);
                    return { ...prevJogoAtual };
                });
                break;
            case EAtributo.ENCANTOS:
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.panilha.encantos = RetornarPanilhaEncantosAtualizados(prevJogoAtual.panilha.encantos, efeito);
                    return { ...prevJogoAtual };
                });
                break;
            case EAtributo.ITENS:
                setJogoAtual((prevJogoAtual) => {
                    prevJogoAtual.panilha.itens = RetornarPanilhaItensAtualizados(prevJogoAtual.panilha.itens, efeito);
                    return { ...prevJogoAtual };
                });
                break;
            case EAtributo._FUNCAO:
            default:
                break;
        }
    }

    function AplicarPenalidadeDeTestarSorte() {
        setJogoAtual((prevJogoAtual) => {
            prevJogoAtual.panilha.sorte = Math.max(prevJogoAtual.panilha.sorte - 1, 0);
            return { ...prevJogoAtual };
        });
    }

    function ObterEfeitoAtualDoAtributo(atributo: EAtributo): IEfeito {
        if (!paginaExecutor.exeEfeitosAtuais || !paginaExecutor.exeEfeitosAtuais.length) {
            return null!;
        }
        return paginaExecutor.exeEfeitosAtuais.find(
            (efeitoI) => efeitoI.atributoEfeito === atributo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.exeProcessoEfeito)
        )!;
    }

    function ImporPaginaCampanhaViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        setPaginaExecutor((prevPaginaExecutor) => {
            return {
                ...prevPaginaExecutor,
                exeIdPaginaDestino: idPaginaDestino,
                exeIdCapituloDestino: idCapituloDestino,
                exeEhJogoCarregado: false,
            };
        });
    }

    function ImporProcessoHistoriasNaPaginaCampanha(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaExecutor.exeEstado === EPaginaCampanhaEstado.HISTORIAS) {
            if (paginaExecutor.exeProcessoHistorias === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoHistorias: EProcesso.PROCESSANDO };
                });
            } else if (paginaExecutor.exeProcessoHistorias === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoHistorias: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporProcessoCombateNaPaginaCampanha(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaExecutor.exeEstado === EPaginaCampanhaEstado.COMBATE) {
            if (paginaExecutor.exeProcessoCombate === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoCombate: EProcesso.PROCESSANDO };
                });
            } else if (paginaExecutor.exeProcessoCombate === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoCombate: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporProcessoDestinosNaPaginaCampanha(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaExecutor.exeEstado === EPaginaCampanhaEstado.DESTINOS) {
            if (paginaExecutor.exeProcessoDestinos === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoDestinos: EProcesso.PROCESSANDO };
                });
            } else if (paginaExecutor.exeProcessoDestinos === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeProcessoDestinos: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporPaginaCampanhaCombateDoProcessoZeroDaSerieDeAtaque(serieDeAtaque: number) {
        if (paginaExecutor.combate.exeSerieDeAtaqueAtual !== serieDeAtaque) {
            setPaginaExecutor((prevPaginaExecutor) => {
                prevPaginaExecutor.combate.exeSerieDeAtaqueAtual = serieDeAtaque;
                return { ...prevPaginaExecutor };
            });
        }
        paginaExecutor.combate.inimigos.forEach((inimigoI, indiceI) => {
            const _temAtacante = inimigoI.exePosturaInimigo === EPosturaInimigo.ATACANTE;
            if (paginaExecutor.combate.combateMultiplo_2osApoio) {
                if (!_temAtacante && inimigoI.exePosturaInimigo === EPosturaInimigo.APOIO) {
                    setPaginaExecutor((prevPaginaExecutor) => {
                        prevPaginaExecutor.combate.inimigos = prevPaginaExecutor.combate.inimigos.map((inimigoI2, indiceI2) => {
                            if (indiceI === indiceI2) {
                                inimigoI2.exePosturaInimigo = EPosturaInimigo.ATACANTE;
                            }
                            return inimigoI2;
                        });
                        return { ...prevPaginaExecutor };
                    });
                    return;
                }
            } else {
                if (!_temAtacante && inimigoI.exePosturaInimigo === EPosturaInimigo._AGUARDANDO) {
                    setPaginaExecutor((prevPaginaExecutor) => {
                        prevPaginaExecutor.combate.inimigos = prevPaginaExecutor.combate.inimigos.map((inimigoI2, indiceI2) => {
                            if (indiceI === indiceI2) {
                                inimigoI2.exePosturaInimigo = EPosturaInimigo.ATACANTE;
                            }
                            return inimigoI2;
                        });
                        return { ...prevPaginaExecutor };
                    });
                    return;
                }
            }
        });
    }
};

export default ContextoJogos;
