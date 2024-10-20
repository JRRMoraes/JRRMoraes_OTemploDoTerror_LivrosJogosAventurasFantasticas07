import { Dispatch, SetStateAction, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    IJogo,
    IPagina,
    IPaginaCampanha,
    IEfeito,
    IDestino,
    EJogoNivel,
    PAGINA_ZERADA,
    CriarJogoNulo,
    AjustarSeForNovoJogo,
    ITotaisRoladosParaPanilhaNova,
    CriarPanilhaViaRolagens,
    ECampanhaCapitulo,
    EPaginaCampanhaEstado,
    RetornarPanilhaEncantosAtualizados,
    RetornarPanilhaItensAtualizados,
    EAtributo,
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
                prevEfeitosAtuais = prevEfeitosAtuais.map((efeitoI) => {
                    if (efeitoI.auxProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.auxProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.auxProcessoEfeito === EProcesso.INICIANDO) {
                        ImporEfeitoEmJogoAtual(efeitoI);
                        efeitoI.auxProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            efeitoI.auxProcessoEfeito = EProcesso.CONCLUIDO;
                        }, TEMPO_ANIMACAO);
                    } else if (efeitoI.auxProcessoEfeito === EProcesso.CONCLUIDO) {
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
            setJogoAtual(AjustarSeForNovoJogo(jogoSalvo1));
            if (jogoSalvo1.campanhaCapitulo && jogoSalvo1.campanhaCapitulo !== ECampanhaCapitulo._NULO) {
                setPadraoCapitulo(jogoSalvo1.campanhaCapitulo);
            }
            return !!(jogoSalvo1 && jogoSalvo1.panilha);
        } else if (idJogoSalvo === "2") {
            setJogoAtual(AjustarSeForNovoJogo(jogoSalvo2));
            if (jogoSalvo2.campanhaCapitulo && jogoSalvo2.campanhaCapitulo !== ECampanhaCapitulo._NULO) {
                setPadraoCapitulo(jogoSalvo2.campanhaCapitulo);
            }
            return !!(jogoSalvo2 && jogoSalvo2.panilha);
        } else if (idJogoSalvo === "3") {
            setJogoAtual(AjustarSeForNovoJogo(jogoSalvo3));
            if (jogoSalvo3.campanhaCapitulo && jogoSalvo3.campanhaCapitulo !== ECampanhaCapitulo._NULO) {
                setPadraoCapitulo(jogoSalvo3.campanhaCapitulo);
            }
            return !!(jogoSalvo3 && jogoSalvo3.panilha);
        } else if (!idJogoSalvo) {
            return false;
        } else {
            setJogoAtual(null!);
            navegador("/");
            return false;
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
            setJogoSalvo1(jogoAtual);
        } else if (jogoAtual.idJogo === 2) {
            setJogoSalvo2(jogoAtual);
        } else if (jogoAtual.idJogo === 3) {
            setJogoSalvo3(jogoAtual);
        }
    }

    function ImporPadroesNaPaginaCampanhaDestinos() {
        setPaginaCampanha((prevPaginaCampanha) => {
            prevPaginaCampanha.destinos = prevPaginaCampanha.destinos.map<IDestino>((destinoI) => {
                if (!destinoI.idCapitulo || destinoI.idCapitulo === ECampanhaCapitulo._NULO) {
                    destinoI.idCapitulo = padraoCapitulo;
                }
                return destinoI;
            });
            return prevPaginaCampanha;
        });
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
                idPaginaDestino: PAGINA_ZERADA.idPagina,
                idCapituloDestino: PAGINA_ZERADA.idCapitulo,
                historias: null!,
                combate: null!,
                destinos: null!,
            });
            if (jogoCarregado) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return {
                        ...prevPaginaCampanha,
                        estado: EPaginaCampanhaEstado.DESTINOS,
                        historias: pagina.historias ? pagina.historias : [],
                        combate: pagina.combate,
                        destinos: pagina.destinos ? pagina.destinos : [],
                    };
                });
                ImporPadroesNaPaginaCampanhaDestinos();
            }
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
        } else if (paginaCampanha.estado === EPaginaCampanhaEstado.HISTORIAS && !paginaCampanha.historias) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, historias: paginaAtual.historias ? paginaAtual.historias : [] };
            });
        } else if (paginaCampanha.estado === EPaginaCampanhaEstado.COMBATES && !paginaCampanha.combate) {
            if (paginaAtual.combate) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, combates: paginaAtual.combate };
                });
            } else {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return { ...prevPaginaCampanha, estado: EPaginaCampanhaEstado.DESTINOS };
                });
            }
        } else if (paginaCampanha.estado === EPaginaCampanhaEstado.DESTINOS && !paginaCampanha.destinos) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, destinos: paginaAtual.destinos ? paginaAtual.destinos : [] };
            });
            ImporPadroesNaPaginaCampanhaDestinos();
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

    function ImporEfeitoEmJogoAtual(efeito: IEfeito) {
        if (!efeito || efeito.auxProcessoEfeito !== EProcesso.INICIANDO) {
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
};

export default ContextoJogos;
