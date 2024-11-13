import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    IJogo,
    IEfeitoExecucao,
    EJogoNivel,
    EAtributo,
    CriarJogoNulo,
    AjustarSeForNovoJogo,
    ITotaisRoladosParaPanilhaNova,
    CriarPanilhaViaRolagens,
    ECampanhaCapitulo,
    RetornarPanilhaEncantosAtualizados,
    RetornarPanilhaItensAtualizados,
    IEfeito,
} from "../tipos";
import { EProcesso } from "../uteis";
import { ContextoBaseJogos } from ".";
import { TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";

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
        padraoCapitulo,
        setPadraoCapitulo,
        jogadorEfeitosAplicados,
        setJogadorEfeitosAplicados,
    } = useContext(ContextoBaseJogos);

    const { idJogo } = useParams();

    const navegador = useNavigate();

    useEffect(() => {
        if (idJogo && !jogoAtual) {
            CarregarJogoSalvoOuNovo(idJogo!);
        }
    }, [idJogo]);

    useEffect(() => {
        if (
            jogoAtual &&
            jogoAtual.panilha &&
            jogadorEfeitosAplicados &&
            jogadorEfeitosAplicados.length &&
            jogadorEfeitosAplicados.find((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.PROCESSANDO)
        ) {
            setJogadorEfeitosAplicados((prevJogadorEfeitosAplicados) => {
                prevJogadorEfeitosAplicados = prevJogadorEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (efeitoI.exeProcessoEfeito === EProcesso._ZERO) {
                        efeitoI.exeProcessoEfeito = EProcesso.INICIANDO;
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.INICIANDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.PROCESSANDO;
                        setTimeout(() => {
                            ImporJogadorEfeitosAplicadosExeProcessoEfeito(indiceI, EProcesso.CONCLUIDO);
                            AplicarEfeitoDoJogadorEfeitosAplicadosExeProcessoEfeitoProcessando(efeitoI);
                        }, TEMPO_ANIMACAO_NORMAL);
                    } else if (efeitoI.exeProcessoEfeito === EProcesso.CONCLUIDO) {
                        efeitoI.exeProcessoEfeito = EProcesso.DESTRUIDO;
                    }
                    return efeitoI;
                });
                prevJogadorEfeitosAplicados = prevJogadorEfeitosAplicados.filter((efeitoI) => efeitoI.exeProcessoEfeito !== EProcesso.DESTRUIDO);
                return [...prevJogadorEfeitosAplicados];
            });
        }
    }, [jogadorEfeitosAplicados]);

    return {
        jogoSalvo1,
        setJogoSalvo1,
        jogoSalvo2,
        setJogoSalvo2,
        jogoSalvo3,
        setJogoSalvo3,
        jogoAtual,
        setJogoAtual,
        padraoCapitulo,
        jogadorEfeitosAplicados,
        setJogadorEfeitosAplicados,
        ResetarJogo,
        NavegarParaPaginaLivroJogoComJogoSalvo,
        CarregarJogoSalvoOuNovo,
        SalvarJogoAtualNoSalvo,
        ExcluirJogoSalvo,
        ImporJogoAtualViaDestino,
        CriarPanilhaNoJogoAtualViaRolagens,
        AdicionarEmJogadorEfeitosAplicados,
        ObterJogadorEfeitoAplicadoDoAtributo,
        AplicarPenalidadeDeTestarSorte,
    };

    function ResetarJogo() {
        setJogoAtual(null!);
        setJogadorEfeitosAplicados([]);
        setPadraoCapitulo(ECampanhaCapitulo.PAGINAS_INICIAIS);
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

    function ImporJogoAtualViaDestino(idPaginaDestino: number, idCapituloDestino: ECampanhaCapitulo) {
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, campanhaIndice: idPaginaDestino, campanhaCapitulo: idCapituloDestino };
        });
    }

    function CriarPanilhaNoJogoAtualViaRolagens(totaisRolados: ITotaisRoladosParaPanilhaNova, nome: string, nivel: EJogoNivel) {
        setJogoAtual((prevJogoAtual) => {
            return { ...prevJogoAtual, panilha: CriarPanilhaViaRolagens(totaisRolados, nome, nivel) };
        });
    }

    function ImporJogadorEfeitosAplicadosExeProcessoEfeito(indice: number, processo: EProcesso) {
        if (jogadorEfeitosAplicados && jogadorEfeitosAplicados[indice] && jogadorEfeitosAplicados[indice].exeProcessoEfeito !== processo) {
            setJogadorEfeitosAplicados((prevJogadorEfeitosAplicados) => {
                prevJogadorEfeitosAplicados = prevJogadorEfeitosAplicados.map((efeitoI, indiceI) => {
                    if (indice === indiceI) {
                        efeitoI.exeProcessoEfeito = processo;
                    }
                    return efeitoI;
                });
                return [...prevJogadorEfeitosAplicados];
            });
        }
    }

    function AplicarEfeitoDoJogadorEfeitosAplicadosExeProcessoEfeitoProcessando(efeito: IEfeitoExecucao) {
        if (!efeito || efeito.exeProcessoEfeito !== EProcesso.PROCESSANDO) {
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

    function AdicionarEmJogadorEfeitosAplicados(efeitos: IEfeitoExecucao[]) {
        setJogadorEfeitosAplicados((prevJogadorEfeitosAplicados) => {
            efeitos.forEach((efeitoI) => {
                if (!prevJogadorEfeitosAplicados.some((efeitoI2) => efeitoI2.exeIdEfeito === efeitoI.exeIdEfeito)) {
                    prevJogadorEfeitosAplicados.push(efeitoI);
                }
            });
            return [...prevJogadorEfeitosAplicados];
        });
    }

    function ObterJogadorEfeitoAplicadoDoAtributo(atributo: EAtributo): IEfeito {
        if (!jogadorEfeitosAplicados || !jogadorEfeitosAplicados.length) {
            return null!;
        }
        return jogadorEfeitosAplicados.find((efeitoI) => efeitoI.atributoEfeito === atributo && [EProcesso._ZERO, EProcesso.INICIANDO, EProcesso.PROCESSANDO].includes(efeitoI.exeProcessoEfeito))!;
    }

    function AplicarPenalidadeDeTestarSorte() {
        setJogoAtual((prevJogoAtual) => {
            prevJogoAtual.panilha.sorte = Math.max(prevJogoAtual.panilha.sorte - 1, 0);
            return { ...prevJogoAtual };
        });
    }
};

export default ContextoJogos;
