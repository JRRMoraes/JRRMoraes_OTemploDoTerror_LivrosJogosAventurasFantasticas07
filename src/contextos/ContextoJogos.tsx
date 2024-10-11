import { Dispatch, SetStateAction, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    IJogo,
    IPagina,
    IPaginaCampanha,
    IEfeito,
    PAGINA_ZERADA,
    CriarJogoNulo,
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
};

export const ContextoBaseJogos = createContext<TContextoBaseJogos>(null!);
ContextoBaseJogos.displayName = "Jogos";

export const ContextoJogos = () => {
    const { jogoSalvo1, setJogoSalvo1, jogoSalvo2, setJogoSalvo2, jogoSalvo3, setJogoSalvo3, jogoAtual, setJogoAtual, paginaAtual, setPaginaAtual, paginaCampanha, setPaginaCampanha } =
        useContext(ContextoBaseJogos);

    const navegador = useNavigate();

    useEffect(() => {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.auxEfeitos && jogoAtual.panilha.auxEfeitos.length) {
            if (jogoAtual.panilha.auxProcessoEfeito === EProcesso._ZERO) {
                jogoAtual.panilha.auxProcessoEfeito = EProcesso.INICIANDO;
            } else if (jogoAtual.panilha.auxProcessoEfeito === EProcesso.INICIANDO) {
                ImporEfeitosEmJogoAtual(jogoAtual.panilha.auxEfeitos);
                jogoAtual.panilha.auxProcessoEfeito = EProcesso.PROCESSANDO;
                setTimeout(() => {
                    jogoAtual.panilha.auxProcessoEfeito = EProcesso.CONCLUIDO;
                }, TEMPO_ANIMACAO);
            } else if (jogoAtual.panilha.auxProcessoEfeito === EProcesso.PROCESSANDO) {
            } else if (jogoAtual.panilha.auxProcessoEfeito === EProcesso.CONCLUIDO) {
                jogoAtual.panilha.auxEfeitos = null!;
                jogoAtual.panilha.auxProcessoEfeito = EProcesso._ZERO;
            }
        }
    }, [jogoAtual]);

    function NavegarParaPaginaLivroJogoComJogoSalvo(jogoSalvo: IJogo) {
        setPaginaAtual(null!);
        setPaginaCampanha(null!);
        setJogoAtual(null!);
        navegador("/" + jogoSalvo.idJogo);
    }

    function CarregarJogoSalvoOuNovo(idJogoSalvo: string) {
        setPaginaAtual(null!);
        setPaginaCampanha(null!);
        if (idJogoSalvo === "1") {
            setJogoAtual(AjustarSeForNovoJogo(jogoSalvo1));
            return !!(jogoSalvo1 && jogoSalvo1.panilha);
        } else if (idJogoSalvo === "2") {
            setJogoAtual(AjustarSeForNovoJogo(jogoSalvo2));
            return !!(jogoSalvo2 && jogoSalvo2.panilha);
        } else if (idJogoSalvo === "3") {
            setJogoAtual(AjustarSeForNovoJogo(jogoSalvo3));
            return !!(jogoSalvo3 && jogoSalvo3.panilha);
        } else if (!idJogoSalvo) {
            return false;
        } else {
            setJogoAtual(null!);
            navegador("/");
            return false;
        }
    }

    function AjustarSeForNovoJogo(jogoSalvo: IJogo) {
        let _jogoRetorno = jogoSalvo;
        if (!_jogoRetorno.dataCriacao) {
            _jogoRetorno.dataCriacao = new Date();
            _jogoRetorno.dataSalvo = _jogoRetorno.dataCriacao;
        }
        if (!_jogoRetorno.campanhaCapitulo) {
            _jogoRetorno.campanhaCapitulo = ECampanhaCapitulo.PAGINAS_INICIAIS;
            _jogoRetorno.campanhaIndice = 1;
            _jogoRetorno.panilha = null!;
        }
        if (_jogoRetorno.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_INICIAIS && _jogoRetorno.campanhaIndice < 1) {
            _jogoRetorno.campanhaIndice = 1;
            _jogoRetorno.panilha = null!;
        }
        return _jogoRetorno;
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
            prevPaginaCampanha.destinos.forEach((destinoI, indiceI) => {
                destinoI.auxDestinoFuncao = () => {
                    setPaginaCampanha((prevPaginaCampanha_IdPaginaDestino) => {
                        return { ...prevPaginaCampanha_IdPaginaDestino, idPaginaDestino: destinoI.idPagina, idCapituloDestino: destinoI.idCapitulo };
                    });
                };
            });
            return prevPaginaCampanha;
        });
    }

    function ImporPaginaAtualECampanha(pagina: IPagina, jogoCarregado: boolean) {
        if (!pagina || (pagina.idPagina === PAGINA_ZERADA.idPagina && pagina.auxIdCapitulo === PAGINA_ZERADA.auxIdCapitulo)) {
            setPaginaAtual(null!);
            setPaginaCampanha(null!);
            return jogoCarregado;
        } else if (paginaAtual && paginaAtual.idPagina === pagina.idPagina && pagina.auxIdCapitulo === PAGINA_ZERADA.auxIdCapitulo) {
            return jogoCarregado;
        } else {
            setPaginaAtual(pagina);
            setPaginaCampanha(null!);
            setPaginaCampanha({
                idPagina: pagina.idPagina,
                auxIdCapitulo: pagina.auxIdCapitulo,
                titulo: pagina.titulo,
                ehJogoCarregado: jogoCarregado,
                estado: EPaginaCampanhaEstado._INICIO,
                idPaginaDestino: PAGINA_ZERADA.idPagina,
                idCapituloDestino: PAGINA_ZERADA.auxIdCapitulo,
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

    function CriarPanilhaNoJogoAtualViaRolagens(totaisRolados: ITotaisRoladosParaPanilhaNova) {
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, panilha: CriarPanilhaViaRolagens(totaisRolados) };
        });
    }

    function AplicarEfeitosDaHistoria(efeitos: IEfeito[]) {
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, auxEfeitos: efeitos, auxProcessoEfeito: EProcesso._ZERO };
        });
    }

    function ImporEfeitosEmJogoAtual(efeitos: IEfeito[]) {
        if (!efeitos || !efeitos.length || !jogoAtual || !jogoAtual.panilha) {
            return;
        }
        efeitos.forEach((efeitoI, indiceI) => {
            if (TextosIguais(efeitoI.sobre, "HABILIDADE")) {
                jogoAtual.panilha.habilidade += efeitoI.valor;
                jogoAtual.panilha.habilidade = Math.max(jogoAtual.panilha.habilidade, 0);
                jogoAtual.panilha.habilidade = Math.min(jogoAtual.panilha.habilidade, jogoAtual.panilha.habilidadeInicial);
            } else if (TextosIguais(efeitoI.sobre, "ENERGIA")) {
                jogoAtual.panilha.energia += efeitoI.valor;
                jogoAtual.panilha.energia = Math.max(jogoAtual.panilha.energia, 0);
                jogoAtual.panilha.energia = Math.min(jogoAtual.panilha.energia, jogoAtual.panilha.energiaInicial);
            } else if (TextosIguais(efeitoI.sobre, "SORTE")) {
                jogoAtual.panilha.sorte += efeitoI.valor;
                jogoAtual.panilha.sorte = Math.max(jogoAtual.panilha.sorte, 0);
                jogoAtual.panilha.sorte = Math.min(jogoAtual.panilha.sorte, jogoAtual.panilha.sorteInicial);
            } else if (TextosIguais(efeitoI.sobre, "OURO")) {
                jogoAtual.panilha.ouro += efeitoI.valor;
                jogoAtual.panilha.ouro = Math.max(jogoAtual.panilha.ouro, 0);
            } else if (TextosIguais(efeitoI.sobre, "PROVISAO")) {
                jogoAtual.panilha.provisao += efeitoI.valor;
                jogoAtual.panilha.provisao = Math.max(jogoAtual.panilha.provisao, 0);
            } else if (ContemTexto("ENCANTOS:", efeitoI.sobre)) {
                jogoAtual.panilha.encantos = RetornarPanilhaEncantosAtualizados(jogoAtual.panilha.encantos, efeitoI);
            } else if (ContemTexto("ITENS:", efeitoI.sobre)) {
                jogoAtual.panilha.itens = RetornarPanilhaItensAtualizados(jogoAtual.panilha.itens, efeitoI);
            }
        });
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
