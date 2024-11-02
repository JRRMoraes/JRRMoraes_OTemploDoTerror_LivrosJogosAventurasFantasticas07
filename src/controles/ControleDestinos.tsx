import "../componentes/Botao.module.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoJogos, OperacoesJogoLivro } from "../contextos";
import {
    EAtributoDestinoTeste,
    ECampanhaCapitulo,
    EJogoNivel,
    EPaginaExecutorEstado,
    IDestino,
    IRolagemParaDestino,
    PAGINA_ZERADA,
    PAGINA_FIM_DE_JOGO,
    ROLAGEM_PARA_DESTINO_ZERADA,
    COR_SORTE,
    COR_SORTE_DOTS,
    COR_HABILIDADE,
    COR_HABILIDADE_DOTS,
} from "../tipos";
import { EProcesso } from "../uteis";
import { ReactDiceRef } from "react-dice-complete";
import { TEMPO_ANIMACAO_GRANDE, TEMPO_DADOS_ROLANDO_MILESIMOS } from "../globais/Constantes";
import ControlePaginaLivroJogo from "./ControlePaginaLivroJogo2";

export const ControleDestinos = () => {
    const {
        jogoAtual,
        paginaExecutor,
        destinosExecutor,
        ImporProcessoDestinosNaPaginaExecutor,
        ImporJogoAtualViaDestino,
        SalvarJogoAtualNoSalvo,
        AplicarPenalidadeDeTestarSorte,
        ImporPaginaExecutorViaDestino,
    } = ContextoJogos();

    const { IniciarMudancaFlipPagina } = ControlePaginaLivroJogo();

    const [desativaBotoes, setDesativaBotoes] = useState(false);

    const [salvando, setSalvando] = useState(EProcesso._ZERO);

    const { ValidarAprovacoesDestino } = OperacoesJogoLivro(jogoAtual);

    const navegador = useNavigate();

    const dadosRef = useRef<ReactDiceRef>(null);

    const [rolagemDados, setRolagemDados] = useState<IRolagemParaDestino>(ROLAGEM_PARA_DESTINO_ZERADA);

    useEffect(() => {
        if (ContextosReprovados(false)) {
            return;
        }
        if (destinosExecutor.processoDestinos === EProcesso.INICIANDO) {
            ImporProcessoDestinosNaPaginaExecutor(EProcesso.PROCESSANDO);
            return;
        }
        if (paginaExecutor.exeIdPaginaDestino === PAGINA_ZERADA.idPagina && paginaExecutor.exeIdCapituloDestino === PAGINA_ZERADA.idCapitulo) {
            return;
        }
        IniciarMudancaFlipPagina();
        ImporProcessoDestinosNaPaginaExecutor(EProcesso.CONCLUIDO);
        ImporJogoAtualViaDestino(paginaExecutor.exeIdPaginaDestino, paginaExecutor.exeIdCapituloDestino);
    }, [paginaExecutor]);

    useEffect(() => {
        if (salvando === EProcesso.INICIANDO && !paginaExecutor.exeEhJogoCarregado) {
            setSalvando(EProcesso.PROCESSANDO);
            SalvarJogoAtualNoSalvo();
            setTimeout(() => {
                setSalvando(EProcesso.CONCLUIDO);
                setDesativaBotoes(false);
            }, 2000);
        }
    }, [salvando]);

    useEffect(() => {
        if (rolagemDados.processoRolagem === EProcesso.INICIANDO) {
            dadosRef.current?.rollAll();
            setRolagemDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.PROCESSANDO };
            });
        } else if (rolagemDados.processoRolagem === EProcesso.PROCESSANDO) {
            setTimeout(() => {
                setRolagemDados((prevRolandoDados) => {
                    return { ...prevRolandoDados, processoRolagem: EProcesso.CONCLUIDO };
                });
            }, TEMPO_DADOS_ROLANDO_MILESIMOS);
        } else if (rolagemDados.processoRolagem === EProcesso.CONCLUIDO) {
            let _rolado = rolagemDados.total;
            if (rolagemDados.destino.testeSomarDados) {
                _rolado += rolagemDados.destino.testeSomarDados;
            }
            let _teveSorte = false;
            if (rolagemDados.destino.testeAtributo === EAtributoDestinoTeste.HABILIDADE) {
                _teveSorte = _rolado <= jogoAtual.panilha.habilidade;
            } else if (rolagemDados.destino.testeAtributo === EAtributoDestinoTeste.SORTE) {
                _teveSorte = _rolado <= jogoAtual.panilha.sorte;
                AplicarPenalidadeDeTestarSorte();
            }
            let _idPagina = _teveSorte ? rolagemDados.destino.idPagina : rolagemDados.destino.idPaginaAzar;
            setTimeout(() => {
                ImporPaginaExecutorViaDestino(_idPagina, rolagemDados.destino.idCapitulo);
            }, TEMPO_ANIMACAO_GRANDE);
            setRolagemDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.DESTRUIDO };
            });
        }
    }, [rolagemDados]);

    return {
        destinosExecutor,
        dadosRef,
        salvando,
        desativaBotoes,
        ContextosReprovados,
        EhFimDeJogo,
        AoReiniciar,
        AprovarSalvaJogoAtual,
        EhSalvamentoAutomatico,
        AoSalvarJogoAtual,
        AoClicarBotaoDestino,
        AoObterDesativaBotao,
        ObterTesteSorteHabilidade,
        AoConcluirRolagem,
    };

    function ContextosReprovados(processoIniciandoReprova: boolean) {
        let _reprovado = !jogoAtual || !destinosExecutor || !destinosExecutor.destinos || !destinosExecutor.destinos.length || ![EPaginaExecutorEstado.DESTINOS].includes(paginaExecutor.exeEstado);
        if (processoIniciandoReprova) {
            _reprovado ||= ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(destinosExecutor.processoDestinos);
        } else {
            _reprovado ||= ![EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(destinosExecutor.processoDestinos);
        }
        return _reprovado;
    }

    function EhFimDeJogo() {
        const _fimDeJogo = jogoAtual.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_CAMPANHA;
        const _estaMorto = !!(jogoAtual.panilha && jogoAtual.panilha.energia === 0);
        const _destinoMorte = !!destinosExecutor.destinos.find((destinoI) => destinoI.idPagina === PAGINA_FIM_DE_JOGO.idPagina);
        return _fimDeJogo && (_estaMorto || _destinoMorte);
    }

    function AoReiniciar() {
        setDesativaBotoes(true);
        navegador("/");
    }

    function AprovarSalvaJogoAtual() {
        return paginaExecutor.exeEhJogoCarregado;
    }

    function EhSalvamentoAutomatico() {
        return jogoAtual.panilha && jogoAtual.panilha.nivel === EJogoNivel._NORMAL;
    }

    function AoSalvarJogoAtual() {
        setDesativaBotoes(true);
        setSalvando(EProcesso.INICIANDO);
    }

    function AoClicarBotaoDestino(destino: IDestino) {
        const _aoClicar = () => {
            setDesativaBotoes(true);
            if (!destino.testeAtributo || destino.testeAtributo === EAtributoDestinoTeste._NULO) {
                ImporPaginaExecutorViaDestino(destino.idPagina, destino.idCapitulo);
            } else {
                setRolagemDados({ processoRolagem: EProcesso.INICIANDO, total: 0, destino: destino });
            }
        };
        return _aoClicar;
    }

    function AoObterDesativaBotao(destino: IDestino) {
        if (!desativaBotoes) {
            return !ValidarAprovacoesDestino(destino.aprovacoes);
        } else {
            return true;
        }
    }

    function ObterTesteSorteHabilidade(destino: IDestino): ITesteSorteHabilidade {
        if (!destino.testeAtributo || destino.testeAtributo === EAtributoDestinoTeste._NULO) {
            return null!;
        }
        const _testeSH: ITesteSorteHabilidade = {
            totalTexto: "?",
            totalValor: 0,
            soma: "",
            atributoTexto: "",
            atributoValor: 0,
            corDados: "",
            corDots: "",
            teveSorte: false,
            resultadoTexto: "",
        };
        if (destino.testeSomarDados) {
            _testeSH.totalValor += destino.testeSomarDados;
            _testeSH.soma = destino.testeSomarDados.toString() + " + ";
        }
        if (destino.testeAtributo === EAtributoDestinoTeste.SORTE) {
            _testeSH.atributoTexto = "SORTE";
            _testeSH.atributoValor = jogoAtual.panilha.sorte;
            _testeSH.corDados = COR_SORTE;
            _testeSH.corDots = COR_SORTE_DOTS;
        } else if (destino.testeAtributo === EAtributoDestinoTeste.HABILIDADE) {
            _testeSH.atributoTexto = "HABILIDADE";
            _testeSH.atributoValor = jogoAtual.panilha.habilidade;
            _testeSH.corDados = COR_HABILIDADE;
            _testeSH.corDots = COR_HABILIDADE_DOTS;
        }
        if ([EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(rolagemDados.processoRolagem)) {
            _testeSH.totalValor += rolagemDados.total;
            _testeSH.totalTexto = _testeSH.totalValor.toString();
            _testeSH.teveSorte = _testeSH.totalValor <= _testeSH.atributoValor;
            if (_testeSH.teveSorte) {
                _testeSH.resultadoTexto = "Você TEVE " + _testeSH.atributoTexto;
            } else {
                _testeSH.resultadoTexto = "Você NÃO TEVE " + _testeSH.atributoTexto;
            }
        }
        return _testeSH;
    }

    function AoConcluirRolagem(totalValue: number, values: number[]) {
        setRolagemDados((prevRolandoDados) => {
            return { ...prevRolandoDados, total: totalValue };
        });
    }
};

export default ControleDestinos;

export interface ITesteSorteHabilidade {
    totalTexto: string;
    totalValor: number;
    soma: string;
    atributoTexto: string;
    atributoValor: number;
    corDados: string;
    corDots: string;
    teveSorte: boolean;
    resultadoTexto: string;
}
