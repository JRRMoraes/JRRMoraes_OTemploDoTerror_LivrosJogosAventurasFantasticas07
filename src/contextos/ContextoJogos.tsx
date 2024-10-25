import { Dispatch, SetStateAction, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    IJogo,
    IPagina,
    IPaginaCampanha,
    IEfeito,
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
    RetornarPaginaCampanhaDestinosPadronizados,
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
    paginaAtual: IPagina;
    setPaginaAtual: Dispatch<SetStateAction<IPagina>>;
    paginaCampanha: IPaginaCampanha;
    setPaginaCampanha: Dispatch<SetStateAction<IPaginaCampanha>>;
    padraoCapitulo: ECampanhaCapitulo;
    setPadraoCapitulo: Dispatch<SetStateAction<ECampanhaCapitulo>>;
    efeitosAtuais: IEfeito[];
    setEfeitosAtuais: Dispatch<SetStateAction<IEfeito[]>>;
};

export const ContextoBaseJogos = createContext<TContextoBaseJogos>(null!);
ContextoBaseJogos.displayName = "Jogos";

export const ContextoJogos = () => {
    const {
        jogoSalvo1,
        setJogoSalvo1,
        jogoSalvo2,
        setJogoSalvo2,
        jogoSalvo3,
        setJogoSalvo3,
        jogoAtual,
        setJogoAtual,
        paginaAtual,
        setPaginaAtual,
        paginaCampanha,
        setPaginaCampanha,
        padraoCapitulo,
        setPadraoCapitulo,
        efeitosAtuais,
        setEfeitosAtuais,
    } = useContext(ContextoBaseJogos);

    const navegador = useNavigate();

    useEffect(() => {
        if (jogoAtual && jogoAtual.panilha && efeitosAtuais && efeitosAtuais.length && efeitosAtuais.find((efeitoI) => efeitoI.auxProcessoEfeito !== EProcesso.PROCESSANDO)) {
            setEfeitosAtuais((prevEfeitosAtuais) => {
                prevEfeitosAtuais = prevEfeitosAtuais.map((efeitoI, indiceI) => {
                    if (efeitoI.auxProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.auxProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.auxProcessoEfeito === EProcesso.INICIANDO) {
                        efeitoI.auxProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            setEfeitosAtuais((prevEfeitosAtuais2) => {
                                prevEfeitosAtuais2 = prevEfeitosAtuais2.map((efeitoI2, indiceI2) => {
                                    if (indiceI === indiceI2 && efeitoI2.auxProcessoEfeito === EProcesso.PROCESSANDO) {
                                        efeitoI2.auxProcessoEfeito = EProcesso.CONCLUIDO;
                                    }
                                    return efeitoI2;
                                });
                                return [...prevEfeitosAtuais2];
                            });
                        }, TEMPO_ANIMACAO);
                    } else if (efeitoI.auxProcessoEfeito === EProcesso.CONCLUIDO) {
                        ImporEfeitoEmJogoAtualNoConcluido(efeitoI);
                        efeitoI.auxProcessoEfeito = EProcesso.DESTRUIDO;
                    }
                    return efeitoI;
                });
                prevEfeitosAtuais = prevEfeitosAtuais.filter((efeitoI) => efeitoI.auxProcessoEfeito !== EProcesso.DESTRUIDO);
                return [...prevEfeitosAtuais];
            });
        }
    }, [efeitosAtuais]);

    return {
        jogoSalvo1,
        setJogoSalvo1,
        jogoSalvo2,
        setJogoSalvo2,
        jogoSalvo3,
        setJogoSalvo3,
        jogoAtual,
        setJogoAtual,
        paginaAtual,
        setPaginaAtual,
        paginaCampanha,
        setPaginaCampanha,
        efeitosAtuais,
        setEfeitosAtuais,
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
        setPaginaAtual(null!);
        setPaginaCampanha(null!);
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
        setPaginaAtual(null!);
        setPaginaCampanha(null!);
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
            setPaginaAtual(null!);
            setPaginaCampanha(null!);
            return jogoCarregado;
        } else if (paginaAtual && paginaAtual.idPagina === pagina.idPagina && paginaAtual.idCapitulo === pagina.idCapitulo) {
            return jogoCarregado;
        } else {
            setPaginaAtual(pagina);
            if (pagina.idCapitulo && pagina.idCapitulo !== padraoCapitulo) {
                setPadraoCapitulo(pagina.idCapitulo);
            }
            setPaginaCampanha(null!);
            setPaginaCampanha({
                idPagina: pagina.idPagina,
                idCapitulo: padraoCapitulo,
                titulo: pagina.titulo,
                ehJogoCarregado: jogoCarregado,
                estado: EPaginaCampanhaEstado._INICIO,
                processoHistorias: EProcesso._ZERO,
                processoCombate: EProcesso._ZERO,
                processoDestinos: EProcesso._ZERO,
                idPaginaDestino: PAGINA_ZERADA.idPagina,
                idCapituloDestino: PAGINA_ZERADA.idCapitulo,
                historias: null!,
                combate: null!,
                destinos: null!,
            });
            return false;
        }
    }

    function ImporPaginaCampanhaEJogoAtualViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        setPaginaAtual(null!);
        setPaginaCampanha(null!);
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, campanhaIndice: idPaginaDestino, campanhaCapitulo: idCapituloDestino };
        });
    }

    function ImporPaginaCampanhaViaAtual() {
        if (!paginaAtual || !paginaCampanha) {
            return;
        }
        if (paginaCampanha.estado === EPaginaCampanhaEstado._INICIO) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, estado: EPaginaCampanhaEstado.HISTORIAS };
            });
        } else if (paginaCampanha.estado === EPaginaCampanhaEstado.HISTORIAS) {
            if (paginaCampanha.processoHistorias === EProcesso._ZERO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    prevPaginaCampanha.processoHistorias = EProcesso.INICIANDO;
                    prevPaginaCampanha.historias = paginaAtual.historias;
                    if (!prevPaginaCampanha.historias) {
                        prevPaginaCampanha.historias = [];
                    }
                    return { ...prevPaginaCampanha };
                });
            } else if (paginaCampanha.processoHistorias === EProcesso.CONCLUIDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    prevPaginaCampanha.processoHistorias = EProcesso.DESTRUIDO;
                    prevPaginaCampanha.estado = EPaginaCampanhaEstado.COMBATE;
                    return { ...prevPaginaCampanha };
                });
            }
        } else if (paginaCampanha.estado === EPaginaCampanhaEstado.COMBATE) {
            if (paginaCampanha.processoCombate === EProcesso._ZERO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    prevPaginaCampanha.processoCombate = EProcesso.INICIANDO;
                    prevPaginaCampanha.combate = paginaAtual.combate;
                    if (prevPaginaCampanha.combate && prevPaginaCampanha.combate.inimigos && prevPaginaCampanha.combate.inimigos.length) {
                        prevPaginaCampanha.combate = RetornarPaginaCampanhaCombateInicial(prevPaginaCampanha.combate, prevPaginaCampanha.ehJogoCarregado);
                    } else {
                        prevPaginaCampanha.processoCombate = EProcesso.CONCLUIDO;
                    }
                    return { ...prevPaginaCampanha };
                });
            } else if (paginaCampanha.processoCombate === EProcesso.CONCLUIDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    prevPaginaCampanha.processoCombate = EProcesso.DESTRUIDO;
                    prevPaginaCampanha.estado = EPaginaCampanhaEstado.DESTINOS;
                    return { ...prevPaginaCampanha };
                });
            }
        } else if (paginaCampanha.estado === EPaginaCampanhaEstado.DESTINOS) {
            if (paginaCampanha.processoDestinos === EProcesso._ZERO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    prevPaginaCampanha.processoDestinos = EProcesso.INICIANDO;
                    prevPaginaCampanha.destinos = paginaAtual.destinos;
                    if (!prevPaginaCampanha.destinos) {
                        prevPaginaCampanha.destinos = [];
                    }
                    prevPaginaCampanha.destinos = RetornarPaginaCampanhaDestinosPadronizados(prevPaginaCampanha, padraoCapitulo);
                    return { ...prevPaginaCampanha };
                });
            } else if (paginaCampanha.processoDestinos === EProcesso.INICIANDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoDestinos: EProcesso.PROCESSANDO };
                });
            } else if (paginaCampanha.processoDestinos === EProcesso.CONCLUIDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoDestinos: EProcesso.DESTRUIDO };
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
        setEfeitosAtuais((prevEfeitosAtuais) => {
            prevEfeitosAtuais = efeitos.map((efeitoI) => {
                efeitoI.auxProcessoEfeito = EProcesso._ZERO;
                return efeitoI;
            });
            return [...prevEfeitosAtuais];
        });
    }

    function ImporEfeitoEmJogoAtualNoConcluido(efeito: IEfeito) {
        if (!efeito || efeito.auxProcessoEfeito !== EProcesso.CONCLUIDO) {
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
        if (!efeitosAtuais || !efeitosAtuais.length) {
            return null!;
        }
        return efeitosAtuais.find((efeitoI) => efeitoI.atributoEfeito === atributo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.auxProcessoEfeito))!;
    }

    function ImporPaginaCampanhaViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        setPaginaCampanha((prevPaginaCampanha_Destino) => {
            return {
                ...prevPaginaCampanha_Destino,
                idPaginaDestino: idPaginaDestino,
                idCapituloDestino: idCapituloDestino,
                ehJogoCarregado: false,
            };
        });
    }

    function ImporProcessoHistoriasNaPaginaCampanha(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaCampanha.estado === EPaginaCampanhaEstado.HISTORIAS) {
            if (paginaCampanha.processoHistorias === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoHistorias: EProcesso.PROCESSANDO };
                });
            } else if (paginaCampanha.processoHistorias === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoHistorias: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporProcessoCombateNaPaginaCampanha(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaCampanha.estado === EPaginaCampanhaEstado.COMBATE) {
            if (paginaCampanha.processoCombate === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoCombate: EProcesso.PROCESSANDO };
                });
            } else if (paginaCampanha.processoCombate === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoCombate: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporProcessoDestinosNaPaginaCampanha(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaCampanha.estado === EPaginaCampanhaEstado.DESTINOS) {
            if (paginaCampanha.processoDestinos === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoDestinos: EProcesso.PROCESSANDO };
                });
            } else if (paginaCampanha.processoDestinos === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, processoDestinos: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporPaginaCampanhaCombateDoProcessoZeroDaSerieDeAtaque(serieDeAtaque: number) {
        if (paginaCampanha.combate.auxSerieDeAtaqueAtual !== serieDeAtaque) {
            setPaginaCampanha((prevPaginaCampanha) => {
                prevPaginaCampanha.combate.auxSerieDeAtaqueAtual = serieDeAtaque;
                return { ...prevPaginaCampanha };
            });
        }
        paginaCampanha.combate.inimigos.forEach((inimigoI, indiceI) => {
            const _temAtacante = inimigoI.auxPosturaInimigo === EPosturaInimigo.ATACANTE;
            switch (paginaCampanha.combate.aprovacaoDerrota) {
                case "CombateMultiplo_1oAtacante_2oDefensor":
                    if (!_temAtacante && inimigoI.auxPosturaInimigo === EPosturaInimigo.DEFENSOR) {
                        setPaginaCampanha((prevPaginaCampanha) => {
                            prevPaginaCampanha.combate.inimigos = prevPaginaCampanha.combate.inimigos.map((inimigoI2, indiceI2) => {
                                if (indiceI === indiceI2) {
                                    inimigoI2.auxPosturaInimigo = EPosturaInimigo.ATACANTE;
                                }
                                return inimigoI2;
                            });
                            return { ...prevPaginaCampanha };
                        });
                        return;
                    }
                    break;
                default:
                    if (!_temAtacante && inimigoI.auxPosturaInimigo === EPosturaInimigo._PARADO) {
                        setPaginaCampanha((prevPaginaCampanha) => {
                            prevPaginaCampanha.combate.inimigos = prevPaginaCampanha.combate.inimigos.map((inimigoI2, indiceI2) => {
                                if (indiceI === indiceI2) {
                                    inimigoI2.auxPosturaInimigo = EPosturaInimigo.ATACANTE;
                                }
                                return inimigoI2;
                            });
                            return { ...prevPaginaCampanha };
                        });
                        return;
                    }
                    break;
            }
        });
    }
};

export default ContextoJogos;
