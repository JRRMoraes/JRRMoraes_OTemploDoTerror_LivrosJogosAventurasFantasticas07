import "../componentes/Botao.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoJogos, ContextoPagina, OperacoesJogoLivro } from "../contextos";
import { EAtributoDestinoTeste, ECampanhaCapitulo, EJogoNivel, EPaginaExecutorEstado, IDestino, PAGINA_ZERADA, PAGINA_FIM_DE_JOGO } from "../tipos";
import { EProcesso } from "../uteis";
import { COR_HABILIDADE, COR_HABILIDADE_DOTS, COR_SORTE, COR_SORTE_DOTS, TEMPO_ANIMACAO_GRANDE, TEMPO_DADOS_RESULTADO_MILESIMOS } from "../globais/Constantes";
import ControlePaginaLivroJogo from "./ControlePaginaLivroJogo2";

export const ControleDestinos = () => {
    const { jogoAtual, ImporJogoAtualViaDestino, SalvarJogoAtualNoSalvo, AplicarPenalidadeDeTestarSorte } = ContextoJogos();

    const {
        paginaEstado,
        paginaIdPaginaDestino,
        paginaIdCapituloDestino,
        paginaEhJogoCarregado,
        destinoItens,
        destinoProcesso,
        destinoProcessoRolagem,
        setDestinoProcessoRolagem,
        destinoRolagemTotal,
        setDestinoRolagemTotal,
        destinoRolagemDestino,
        setDestinoRolagemDestino,
        destinoDadosRef,
        setDestinoProcesso,
        ImporPaginaExecutorViaDestino,
    } = ContextoPagina();

    const { IniciarMudancaFlipPagina } = ControlePaginaLivroJogo();

    const [desativaBotoes, setDesativaBotoes] = useState(false);

    const [salvando, setSalvando] = useState(EProcesso._ZERO);

    const { ValidarAprovacoesDestino } = OperacoesJogoLivro();

    const navegador = useNavigate();

    useEffect(() => {
        if (!jogoAtual || !destinoItens || !destinoItens.length || paginaEstado !== EPaginaExecutorEstado.DESTINOS) {
            return;
        }
        switch (destinoProcesso) {
            case EProcesso._ZERO:
                setDestinoProcesso(EProcesso.INICIANDO);
                break;
            case EProcesso.INICIANDO:
                setDesativaBotoes(false);
                setSalvando(EProcesso._ZERO);
                setDestinoProcesso(EProcesso.PROCESSANDO);
                break;
            case EProcesso.PROCESSANDO:
                if (paginaIdPaginaDestino !== PAGINA_ZERADA.idPagina && paginaIdCapituloDestino !== PAGINA_ZERADA.idCapitulo) {
                    IniciarMudancaFlipPagina();
                    ImporJogoAtualViaDestino(paginaIdPaginaDestino, paginaIdCapituloDestino);
                    setDestinoProcesso(EProcesso.CONCLUIDO);
                }
                break;
            case EProcesso.CONCLUIDO:
                setDestinoProcesso(EProcesso.DESTRUIDO);
                break;
        }
    }, [paginaEstado, destinoProcesso, paginaIdPaginaDestino, paginaIdCapituloDestino]);

    useEffect(() => {
        if (salvando === EProcesso.INICIANDO && !paginaEhJogoCarregado) {
            setSalvando(EProcesso.PROCESSANDO);
            SalvarJogoAtualNoSalvo();
            setTimeout(() => {
                setDesativaBotoes(false);
                setSalvando(EProcesso.CONCLUIDO);
            }, 2000);
        }
    }, [salvando]);

    useEffect(() => {
        if (destinoProcessoRolagem === EProcesso.INICIANDO) {
            destinoDadosRef.current?.rollAll();
            setDestinoProcessoRolagem(EProcesso.PROCESSANDO);
            setTimeout(() => {
                setDestinoProcessoRolagem(EProcesso.CONCLUIDO);
            }, TEMPO_DADOS_RESULTADO_MILESIMOS);
            return;
        }
        if (destinoProcessoRolagem === EProcesso.CONCLUIDO) {
            let _rolado = destinoRolagemTotal;
            if (destinoRolagemDestino.testeSomarDados) {
                _rolado += destinoRolagemDestino.testeSomarDados;
            }
            let _teveSorte = false;
            if (destinoRolagemDestino.testeAtributo === EAtributoDestinoTeste.HABILIDADE) {
                _teveSorte = _rolado <= jogoAtual.panilha.habilidade;
            } else if (destinoRolagemDestino.testeAtributo === EAtributoDestinoTeste.SORTE) {
                _teveSorte = _rolado <= jogoAtual.panilha.sorte;
                AplicarPenalidadeDeTestarSorte();
            }
            let _idPagina = _teveSorte ? destinoRolagemDestino.idPagina : destinoRolagemDestino.idPaginaAzar;
            setTimeout(() => {
                ImporPaginaExecutorViaDestino(_idPagina, destinoRolagemDestino.idCapitulo);
            }, TEMPO_ANIMACAO_GRANDE);
            setDestinoProcessoRolagem(EProcesso.DESTRUIDO);
            return;
        }
    }, [destinoProcessoRolagem]);

    return {
        destinoItens,
        destinoDadosRef,
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

    function ContextosReprovados() {
        return (
            !jogoAtual ||
            !destinoItens ||
            !destinoItens.length ||
            ![EPaginaExecutorEstado.DESTINOS].includes(paginaEstado) ||
            ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(destinoProcesso)
        );
    }

    function EhFimDeJogo() {
        const _fimDeJogo = jogoAtual.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_CAMPANHA;
        const _estaMorto = !!(jogoAtual.panilha && jogoAtual.panilha.energia === 0);
        const _destinoMorte = !!destinoItens.find((destinoI) => destinoI.idPagina === PAGINA_FIM_DE_JOGO.idPagina);
        return _fimDeJogo && (_estaMorto || _destinoMorte);
    }

    function AoReiniciar() {
        setDesativaBotoes(true);
        navegador("/");
    }

    function AprovarSalvaJogoAtual() {
        return paginaEhJogoCarregado;
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
                setDestinoRolagemTotal(0);
                setDestinoRolagemDestino(destino);
                setDestinoProcessoRolagem(EProcesso.INICIANDO);
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
        if ([EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(destinoProcessoRolagem)) {
            _testeSH.totalValor += destinoRolagemTotal;
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
        setDestinoRolagemTotal(totalValue);
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
