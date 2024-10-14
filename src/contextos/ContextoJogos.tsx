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
} from "../tipos";
import { EProcesso, TextosIguais, ContemTexto } from "../uteis";
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
    } = useContext(ContextoBaseJogos);

    const navegador = useNavigate();

    useEffect(() => {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.auxEfeitos && jogoAtual.panilha.auxEfeitos.length) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.auxEfeitos = prevJogoAtual.panilha.auxEfeitos.map((efeitoI) => {
                    if (efeitoI.auxProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.auxProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.auxProcessoEfeito === EProcesso.INICIANDO) {
                        ImporEfeitoEmJogoAtual(efeitoI);
                        efeitoI.auxProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            efeitoI.auxProcessoEfeito = EProcesso.CONCLUIDO;
                        }, TEMPO_ANIMACAO);
                    }
                    return efeitoI;
                });
                prevJogoAtual.panilha.auxEfeitos = prevJogoAtual.panilha.auxEfeitos.filter((efeitoI) => efeitoI.auxProcessoEfeito !== EProcesso.CONCLUIDO);
                return { ...prevJogoAtual };
            });
        }
    }, [jogoAtual]);

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
                destinoI.auxDestinoFuncao = () => {
                    setPaginaCampanha((prevPaginaCampanha_Destino) => {
                        return {
                            ...prevPaginaCampanha_Destino,
                            idPaginaDestino: destinoI.idPagina,
                            idCapituloDestino: destinoI.idCapitulo,
                            ehJogoCarregado: false,
                        };
                    });
                };
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
                combates: null!,
                destinos: null!,
            });
            if (jogoCarregado) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return {
                        ...prevPaginaCampanha,
                        estado: EPaginaCampanhaEstado.DESTINOS,
                        historias: pagina.historias ? pagina.historias : [],
                        combates: pagina.combates ? pagina.combates : [],
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
        } else if (paginaCampanha.estado === EPaginaCampanhaEstado.COMBATES && !paginaCampanha.combates) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, combates: paginaAtual.combates ? paginaAtual.combates : [] };
            });
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
        setJogoAtual((prevJogoAtual) => {
            efeitos.forEach((efeitoI) => {
                efeitoI.auxProcessoEfeito = EProcesso._ZERO;
                prevJogoAtual.panilha.auxEfeitos = [...prevJogoAtual.panilha.auxEfeitos, efeitoI];
            });
            return { ...prevJogoAtual };
        });
    }

    function ImporEfeitoEmJogoAtual(efeito: IEfeito) {
        if (!efeito || efeito.auxProcessoEfeito !== EProcesso.INICIANDO) {
            return;
        }
        if (TextosIguais(efeito.sobre, "HABILIDADE")) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.habilidade += efeito.quantidade;
                prevJogoAtual.panilha.habilidade = Math.max(prevJogoAtual.panilha.habilidade, 0);
                prevJogoAtual.panilha.habilidade = Math.min(prevJogoAtual.panilha.habilidade, prevJogoAtual.panilha.habilidadeInicial);
                return { ...prevJogoAtual };
            });
        } else if (TextosIguais(efeito.sobre, "ENERGIA")) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.energia += efeito.quantidade;
                prevJogoAtual.panilha.energia = Math.max(prevJogoAtual.panilha.energia, 0);
                prevJogoAtual.panilha.energia = Math.min(prevJogoAtual.panilha.energia, prevJogoAtual.panilha.energiaInicial);
                return { ...prevJogoAtual };
            });
        } else if (TextosIguais(efeito.sobre, "SORTE")) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.sorte += efeito.quantidade;
                prevJogoAtual.panilha.sorte = Math.max(prevJogoAtual.panilha.sorte, 0);
                prevJogoAtual.panilha.sorte = Math.min(prevJogoAtual.panilha.sorte, prevJogoAtual.panilha.sorteInicial);
                return { ...prevJogoAtual };
            });
        } else if (TextosIguais(efeito.sobre, "OURO")) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.ouro += efeito.quantidade;
                prevJogoAtual.panilha.ouro = Math.max(prevJogoAtual.panilha.ouro, 0);
                return { ...prevJogoAtual };
            });
        } else if (TextosIguais(efeito.sobre, "PROVISAO")) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.provisao += efeito.quantidade;
                prevJogoAtual.panilha.provisao = Math.max(prevJogoAtual.panilha.provisao, 0);
                return { ...prevJogoAtual };
            });
        } else if (ContemTexto("ENCANTOS:", efeito.sobre)) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.encantos = RetornarPanilhaEncantosAtualizados(prevJogoAtual.panilha.encantos, efeito);
                return { ...prevJogoAtual };
            });
        } else if (ContemTexto("ITENS:", efeito.sobre)) {
            setJogoAtual((prevJogoAtual) => {
                prevJogoAtual.panilha.itens = RetornarPanilhaItensAtualizados(prevJogoAtual.panilha.itens, efeito);
                return { ...prevJogoAtual };
            });
        }
    }

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
    };
};

export default ContextoJogos;
