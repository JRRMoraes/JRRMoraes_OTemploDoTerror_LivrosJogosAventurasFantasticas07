import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IJogo, IPagina, IPaginaCampanha, PAGINA_ZERADA } from "../tipos";

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
            _jogoRetorno.campanhaCapitulo = "PAGINAS_INICIAIS";
            _jogoRetorno.campanhaIndice = 1;
            _jogoRetorno.panilha = null!;
        }
        return _jogoRetorno;
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

    function ImporPaginaAtualECampanha(pagina: IPagina, jogoCarregado: boolean) {
        if (!pagina || pagina.idPagina === PAGINA_ZERADA.idPagina) {
            setPaginaAtual(null!);
            setPaginaCampanha(null!);
            return jogoCarregado;
        } else if (paginaAtual && paginaAtual.idPagina === pagina.idPagina) {
            return jogoCarregado;
        } else {
            setPaginaAtual(pagina);
            setPaginaCampanha(null!);
            setPaginaCampanha({
                idPagina: pagina.idPagina,
                titulo: pagina.titulo,
                ehJogoCarregado: jogoCarregado,
                estado: "",
                idPaginaDestino: PAGINA_ZERADA.idPagina,
                historias: null!,
                combates: null!,
                destinos: null!,
            });
            if (jogoCarregado) {
                setPaginaCampanha((prevPaginaCampanha) => {
                    return {
                        ...prevPaginaCampanha,
                        estado: "DESTINOS",
                        historias: pagina.historias ? pagina.historias : [],
                        combates: pagina.combates ? pagina.combates : [],
                        destinos: pagina.destinos ? pagina.destinos : [],
                    };
                });
                setPaginaCampanha((prevPaginaCampanha) => {
                    prevPaginaCampanha.destinos.forEach((destinoI, indiceI) => {
                        destinoI.funcao = () => {
                            setPaginaCampanha((prevPaginaCampanha_IdPaginaDestino) => {
                                return { ...prevPaginaCampanha_IdPaginaDestino, idPaginaDestino: destinoI.idPagina };
                            });
                        };
                    });
                    return prevPaginaCampanha;
                });
            }
            return false;
        }
    }

    function ImporPaginaCampanhaEJogoAtualViaDestino(idPaginaDestino: number) {
        setPaginaAtual(null!);
        setPaginaCampanha(null!);
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, campanhaIndice: idPaginaDestino };
        });
    }

    function ImporPaginaCampanhaViaAtual() {
        if (!paginaAtual || !paginaCampanha) {
            return;
        }
        if (paginaCampanha.estado === "") {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, estado: "HISTORIAS" };
            });
        } else if (paginaCampanha.estado === "HISTORIAS" && !paginaCampanha.historias) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, historias: paginaAtual.historias ? paginaAtual.historias : [] };
            });
        } else if (paginaCampanha.estado === "COMBATES" && !paginaCampanha.combates) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, combates: paginaAtual.combates ? paginaAtual.combates : [] };
            });
        } else if (paginaCampanha.estado === "DESTINOS" && !paginaCampanha.destinos) {
            setPaginaCampanha((prevPaginaCampanha) => {
                return { ...prevPaginaCampanha, destinos: paginaAtual.destinos ? paginaAtual.destinos : [] };
            });
            setPaginaCampanha((prevPaginaCampanha) => {
                prevPaginaCampanha.destinos.forEach((destinoI, indiceI) => {
                    destinoI.funcao = () => {
                        setPaginaCampanha((prevPaginaCampanha_IdPaginaDestino) => {
                            return { ...prevPaginaCampanha_IdPaginaDestino, idPaginaDestino: destinoI.idPagina };
                        });
                    };
                });
                return prevPaginaCampanha;
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
        NavegarParaPaginaLivroJogoComJogoSalvo,
        CarregarJogoSalvoOuNovo,
        SalvarJogoAtualNoSalvo,
        ImporPaginaAtualECampanha,
        ImporPaginaCampanhaEJogoAtualViaDestino,
        ImporPaginaCampanhaViaAtual,
    };
};
