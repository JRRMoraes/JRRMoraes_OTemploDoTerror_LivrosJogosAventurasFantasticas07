import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    IJogo,
    IPagina,
    IEfeito,
    IEfeitoExecucao,
    EJogoNivel,
    EAtributo,
    PAGINA_ZERADA,
    CriarJogoNulo,
    AjustarSeForNovoJogo,
    RetornarPaginaExecutorViaPagina,
    RetornarHistoriasExecutorViaPagina,
    RetornarCombateExecutorViaPagina,
    RetornarDestinosExecutorViaPagina,
    ITotaisRoladosParaPanilhaNova,
    CriarPanilhaViaRolagens,
    ECampanhaCapitulo,
    EPaginaExecutorEstado,
    RetornarPanilhaEncantosAtualizados,
    RetornarPanilhaItensAtualizados,
    RetornarCombateExecutorNoProcessoInicial,
} from "../tipos";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";
import { ContextoBaseJogos, ContextoLivro } from ".";

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
        paginaExecutor,
        setPaginaExecutor,
        historiasExecutor,
        setHistoriasExecutor,
        combateExecutor,
        setCombateExecutor,
        destinosExecutor,
        setDestinosExecutor,
        padraoCapitulo,
        setPadraoCapitulo,
    } = useContext(ContextoBaseJogos);

    const { idJogo } = useParams();
    const [ehJogoCarregado, setEhJogoCarregado] = useState(false);

    const { livro, ObterPagina } = ContextoLivro();

    const navegador = useNavigate();

    useEffect(() => {
        if (!jogoAtual) {
            setEhJogoCarregado(CarregarJogoSalvoOuNovo(idJogo!));
        }
    }, [idJogo]);

    useEffect(() => {
        if (!livro || !jogoAtual) {
            return;
        }
        if (!paginaExecutor) {
            setEhJogoCarregado(ImporExecutores(ObterPagina(jogoAtual), ehJogoCarregado));
            return;
        }
        AtualizarPaginaExecutorAutomaticamente();
    }, [livro, jogoAtual, paginaExecutor, historiasExecutor, combateExecutor, destinosExecutor]);

    useEffect(() => {
        if (
            jogoAtual &&
            jogoAtual.panilha &&
            historiasExecutor &&
            historiasExecutor.efeitosAtuais &&
            historiasExecutor.efeitosAtuais.length &&
            historiasExecutor.efeitosAtuais.find((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.PROCESSANDO)
        ) {
            setHistoriasExecutor((prevHistoriasExecutor) => {
                prevHistoriasExecutor.efeitosAtuais = prevHistoriasExecutor.efeitosAtuais.map((efeitoI, indiceI) => {
                    if (efeitoI.exeProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.exeProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.INICIANDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            setHistoriasExecutor((prevHistoriasExecutor2) => {
                                prevHistoriasExecutor2.efeitosAtuais = prevHistoriasExecutor2.efeitosAtuais.map((efeitoI2, indiceI2) => {
                                    if (indiceI === indiceI2 && efeitoI2.exeProcessoEfeito === EProcesso.PROCESSANDO) {
                                        efeitoI2.exeProcessoEfeito = EProcesso.CONCLUIDO;
                                    }
                                    return efeitoI2;
                                });
                                return { ...prevHistoriasExecutor2 };
                            });
                        }, TEMPO_ANIMACAO_NORMAL);
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.CONCLUIDO) {
                        ImporEfeitoEmJogoAtualNoConcluido(efeitoI);
                        efeitoI.exeProcessoEfeito = EProcesso.DESTRUIDO;
                    }
                    return efeitoI;
                });
                prevHistoriasExecutor.efeitosAtuais = prevHistoriasExecutor.efeitosAtuais.filter((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.DESTRUIDO);
                return { ...prevHistoriasExecutor };
            });
        }
    }, [historiasExecutor]);

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
        historiasExecutor,
        setHistoriasExecutor,
        combateExecutor,
        setCombateExecutor,
        destinosExecutor,
        setDestinosExecutor,
        ResetarJogo,
        NavegarParaPaginaLivroJogoComJogoSalvo,
        CarregarJogoSalvoOuNovo,
        SalvarJogoAtualNoSalvo,
        ExcluirJogoSalvo,
        ImporExecutores,
        ImporJogoAtualViaDestino,
        AtualizarPaginaExecutorAutomaticamente,
        CriarPanilhaNoJogoAtualViaRolagens,
        AplicarEfeitosAtuaisDaHistoria,
        AplicarPenalidadeDeTestarSorte,
        ObterEfeitoAtualDoAtributo,
        ImporPaginaExecutorViaDestino,
        ImporProcessoCombateNoCombateExecutor,
        ImporProcessoDestinosNaPaginaExecutor,
    };

    function ResetarJogo() {
        setJogoAtual(null!);
        ResetarExecutores();
        setPadraoCapitulo(ECampanhaCapitulo.PAGINAS_INICIAIS);
    }

    function ResetarExecutores() {
        setPaginaExecutor(null!);
        setHistoriasExecutor(null!);
        setCombateExecutor(null!);
        setDestinosExecutor(null!);
    }

    function NavegarParaPaginaLivroJogoComJogoSalvo(jogoSalvo: IJogo) {
        ResetarJogo();
        navegador("/" + jogoSalvo.idJogo);
    }

    function CarregarJogoSalvoOuNovo(idJogoSalvo: string) {
        ResetarJogo();
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
        if (jogo.campanhaCapitulo && jogo.campanhaCapitulo !== ECampanhaCapitulo._NULO && jogo.campanhaCapitulo !== padraoCapitulo) {
            setPadraoCapitulo(jogo.campanhaCapitulo);
        }
    }

    function ExcluirJogoSalvo(idJogoSalvo: string) {
        if (idJogoSalvo === "1") {
            setJogoSalvo1(CriarJogoNulo(1));
        } else if (idJogoSalvo === "2") {
            setJogoSalvo2(CriarJogoNulo(2));
        } else if (idJogoSalvo === "3") {
            setJogoSalvo3(CriarJogoNulo(3));
        }
        ResetarJogo();
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

    function ImporExecutores(pagina: IPagina, jogoCarregado: boolean) {
        if (!pagina || (pagina.idPagina === PAGINA_ZERADA.idPagina && pagina.idCapitulo === PAGINA_ZERADA.idCapitulo)) {
            ResetarExecutores();
            return jogoCarregado;
        } else if (paginaExecutor && paginaExecutor.idPagina === pagina.idPagina && paginaExecutor.idCapitulo === pagina.idCapitulo) {
            return jogoCarregado;
        } else {
            if (pagina.idCapitulo && pagina.idCapitulo !== padraoCapitulo) {
                setPadraoCapitulo(pagina.idCapitulo);
            }
            setPaginaExecutor(RetornarPaginaExecutorViaPagina(pagina, padraoCapitulo, jogoCarregado));
            setHistoriasExecutor(RetornarHistoriasExecutorViaPagina(pagina, jogoCarregado));
            setCombateExecutor(RetornarCombateExecutorViaPagina(pagina));
            setDestinosExecutor(RetornarDestinosExecutorViaPagina(pagina, padraoCapitulo, jogoCarregado));
            return false;
        }
    }

    function ImporJogoAtualViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        ResetarExecutores();
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, campanhaIndice: idPaginaDestino, campanhaCapitulo: idCapituloDestino };
        });
    }

    function AtualizarPaginaExecutorAutomaticamente() {
        if (!paginaExecutor) {
            return;
        }
        if (paginaExecutor.exeEstado === EPaginaExecutorEstado.INICIALIZADO) {
            setPaginaExecutor((prevPaginaExecutor) => {
                return { ...prevPaginaExecutor, exeEstado: EPaginaExecutorEstado.HISTORIAS };
            });
        } else if (paginaExecutor.exeEstado === EPaginaExecutorEstado.HISTORIAS) {
            if (historiasExecutor.processoHistorias === EProcesso._ZERO) {
                setHistoriasExecutor((prevHistoriasExecutor) => {
                    return { ...prevHistoriasExecutor, processoHistorias: EProcesso.INICIANDO };
                });
            } else if (historiasExecutor.processoHistorias === EProcesso.CONCLUIDO) {
                setHistoriasExecutor((prevHistoriasExecutor) => {
                    return { ...prevHistoriasExecutor, processoHistorias: EProcesso.DESTRUIDO };
                });
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeEstado: EPaginaExecutorEstado.COMBATE };
                });
            }
        } else if (paginaExecutor.exeEstado === EPaginaExecutorEstado.COMBATE) {
            if (combateExecutor.processoCombate === EProcesso._ZERO) {
                setCombateExecutor((prevCombateExecutor) => {
                    prevCombateExecutor = RetornarCombateExecutorNoProcessoInicial(prevCombateExecutor, paginaExecutor.exeEhJogoCarregado);
                    return { ...prevCombateExecutor };
                });
            } else if (combateExecutor.processoCombate === EProcesso.CONCLUIDO) {
                setCombateExecutor((prevCombateExecutor) => {
                    return { ...prevCombateExecutor, processoCombate: EProcesso.DESTRUIDO };
                });
                setPaginaExecutor((prevPaginaExecutor) => {
                    return { ...prevPaginaExecutor, exeEstado: EPaginaExecutorEstado.DESTINOS };
                });
            }
        } else if (paginaExecutor.exeEstado === EPaginaExecutorEstado.DESTINOS) {
            if (destinosExecutor.processoDestinos === EProcesso._ZERO) {
                setDestinosExecutor((prevDestinosExecutor) => {
                    return { ...prevDestinosExecutor, processoDestinos: EProcesso.INICIANDO };
                });
            } else if (destinosExecutor.processoDestinos === EProcesso.INICIANDO) {
                setDestinosExecutor((prevDestinosExecutor) => {
                    return { ...prevDestinosExecutor, processoDestinos: EProcesso.PROCESSANDO };
                });
            } else if (destinosExecutor.processoDestinos === EProcesso.CONCLUIDO) {
                setDestinosExecutor((prevDestinosExecutor) => {
                    return { ...prevDestinosExecutor, processoDestinos: EProcesso.DESTRUIDO };
                });
            }
        }
    }

    function CriarPanilhaNoJogoAtualViaRolagens(totaisRolados: ITotaisRoladosParaPanilhaNova, nome: string, nivel: EJogoNivel) {
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, panilha: CriarPanilhaViaRolagens(totaisRolados, nome, nivel) };
        });
    }

    function AplicarEfeitosAtuaisDaHistoria(efeitos: IEfeitoExecucao[]) {
        setHistoriasExecutor((prevHistoriasExecutor) => {
            efeitos.forEach((efeitoI) => {
                if (!prevHistoriasExecutor.efeitosAtuais.some((efeitoI2) => efeitoI2.exeIdEfeito === efeitoI.exeIdEfeito)) {
                    prevHistoriasExecutor.efeitosAtuais.push(efeitoI);
                }
            });
            return { ...prevHistoriasExecutor };
        });
    }

    function ImporEfeitoEmJogoAtualNoConcluido(efeito: IEfeitoExecucao) {
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
        if (!historiasExecutor || !historiasExecutor.efeitosAtuais || !historiasExecutor.efeitosAtuais.length) {
            return null!;
        }
        return historiasExecutor.efeitosAtuais.find(
            (efeitoI) => efeitoI.atributoEfeito === atributo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.exeProcessoEfeito)
        )!;
    }

    function ImporPaginaExecutorViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        setPaginaExecutor((prevPaginaExecutor) => {
            return {
                ...prevPaginaExecutor,
                exeIdPaginaDestino: idPaginaDestino,
                exeIdCapituloDestino: idCapituloDestino,
                exeEhJogoCarregado: false,
            };
        });
    }

    function ImporProcessoCombateNoCombateExecutor(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaExecutor.exeEstado === EPaginaExecutorEstado.COMBATE) {
            if (combateExecutor.processoCombate === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setCombateExecutor((prevCombateExecutor) => {
                    return { ...prevCombateExecutor, processoCombate: EProcesso.PROCESSANDO };
                });
            } else if (combateExecutor.processoCombate === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setCombateExecutor((prevCombateExecutor) => {
                    return { ...prevCombateExecutor, processoCombate: EProcesso.CONCLUIDO };
                });
            }
        }
    }

    function ImporProcessoDestinosNaPaginaExecutor(processo: EProcesso.PROCESSANDO | EProcesso.CONCLUIDO) {
        if (paginaExecutor.exeEstado === EPaginaExecutorEstado.DESTINOS) {
            if (destinosExecutor.processoDestinos === EProcesso.INICIANDO && processo === EProcesso.PROCESSANDO) {
                setDestinosExecutor((prevDestinosExecutor) => {
                    return { ...prevDestinosExecutor, processoDestinos: EProcesso.PROCESSANDO };
                });
            } else if (destinosExecutor.processoDestinos === EProcesso.PROCESSANDO && processo === EProcesso.CONCLUIDO) {
                setDestinosExecutor((prevDestinosExecutor) => {
                    return { ...prevDestinosExecutor, processoDestinos: EProcesso.CONCLUIDO };
                });
            }
        }
    }
};

export default ContextoJogos;
