import styles from "../telas/TelaCombate.module.scss";
import { ContextoJogos, ContextoPagina } from ".";
import { IAprovacaoDestino, EAtributo, EComparacao, EResultadoCombate, EPosturaInimigo } from "../tipos";
import { TextosIguais } from "../uteis";

export const OperacoesJogoLivro = () => {
    const { jogoAtual } = ContextoJogos();

    const { combateInimigos, combateInimigos_PosturaInimigo, combateAprovacaoDerrota, combateSerieDeAtaqueAtual, setCombateResultadoFinalDerrota, setCombateResultadoFinalInimigos } = ContextoPagina();

    return {
        ValidarAprovacoesDestino,
        AvaliarResultadoCombateDoCombateExecutorProcessoIniciando,
        AvaliarResultadoCombateDoCombateExecutorProcessoDestruido,
        MontarElementoCombateAprovacaoDerrota,
    };

    function ValidarAprovacoesDestino(aprovacoes: IAprovacaoDestino[]) {
        if (!aprovacoes || !aprovacoes.length) {
            return true;
        }
        let _ok = true;
        aprovacoes.forEach((aprovacaoI) => {
            switch (aprovacaoI.atributoAprovacao) {
                case EAtributo._FUNCAO:
                    _ok &&= ValidarAprovacoesDestino_Funcao(aprovacaoI);
                    break;
                case EAtributo.ITENS:
                    _ok &&= ValidarAprovacoesDestino_Itens(aprovacaoI);
                    break;
                case EAtributo.ENCANTOS:
                    _ok &&= ValidarAprovacoesDestino_Encantos(aprovacaoI);
                    break;
                default:
                    _ok = false;
                    console.log("OperacoesJogoLivro:ValidarAprovacoesDestino:: Não foi encontrado o atributo " + aprovacaoI.atributoAprovacao + " com nome '" + aprovacaoI.nomeAprovacao + "'.");
                    break;
            }
        });
        return _ok;
    }

    function ValidarAprovacoesDestino_Funcao(aprovacao: IAprovacaoDestino): boolean {
        let _quantidade = 0;
        switch (aprovacao.nomeAprovacao) {
            case "JogoAtual_Panilha":
                _quantidade = jogoAtual && jogoAtual.panilha ? 1 : 0;
                break;
            default:
                console.log("Operação de destino '" + aprovacao.nomeAprovacao + "' não foi encontrada");
                return false;
        }
        return ValidarComparacaoEQuantidade(aprovacao, _quantidade);
    }

    function ValidarAprovacoesDestino_Itens(aprovacao: IAprovacaoDestino): boolean {
        if (!jogoAtual || !jogoAtual.panilha || !jogoAtual.panilha.itens || !jogoAtual.panilha.itens.length || !aprovacao.nomeAprovacao) {
            return ValidarComparacaoEQuantidade(aprovacao, 0);
        }
        const _item = jogoAtual.panilha.itens.find((itemI) => TextosIguais(itemI.idItem, aprovacao.nomeAprovacao));
        if (_item) {
            return ValidarComparacaoEQuantidade(aprovacao, _item.quantidade);
        } else {
            return ValidarComparacaoEQuantidade(aprovacao, 0);
        }
    }

    function ValidarAprovacoesDestino_Encantos(aprovacao: IAprovacaoDestino): boolean {
        if (!jogoAtual || !jogoAtual.panilha || !jogoAtual.panilha.encantos || !jogoAtual.panilha.encantos.length) {
            return ValidarComparacaoEQuantidade(aprovacao, 0);
        }
        if (aprovacao.nomeAprovacao && aprovacao.nomeAprovacao !== "") {
            const _encanto = jogoAtual.panilha.encantos.find((encantoI) => TextosIguais(encantoI, aprovacao.nomeAprovacao));
            if (_encanto) {
                return ValidarComparacaoEQuantidade(aprovacao, 1);
            } else {
                return ValidarComparacaoEQuantidade(aprovacao, 0);
            }
        } else {
            const _quantidade = jogoAtual.panilha.encantos && jogoAtual.panilha.encantos.length ? jogoAtual.panilha.encantos.length : 0;
            return ValidarComparacaoEQuantidade(aprovacao, _quantidade);
        }
    }

    function ValidarComparacaoEQuantidade(aprovacao: IAprovacaoDestino, quantidade: number): boolean {
        const _aprovacaoQuantidade = aprovacao.quantidade ? aprovacao.quantidade : 0;
        switch (aprovacao.comparacao) {
            case EComparacao.MAIOR_IGUAL:
                return quantidade >= _aprovacaoQuantidade;
            case EComparacao.MAIOR:
                return quantidade > _aprovacaoQuantidade;
            case EComparacao.MENOR_IGUAL:
                return quantidade <= _aprovacaoQuantidade;
            case EComparacao.MENOR:
                return quantidade < _aprovacaoQuantidade;
            case EComparacao.NAO_POSSUIR:
                return quantidade <= 0;
            case EComparacao._POSSUIR:
            default:
                return quantidade >= 1;
        }
    }

    function AvaliarResultadoCombateDoCombateExecutorProcessoIniciando(): EResultadoCombate {
        switch (combateAprovacaoDerrota.toLowerCase()) {
            case "SerieDeAtaqueEhMaiorOuIgualAHabilidade".toLowerCase():
                if (combateSerieDeAtaqueAtual >= jogoAtual.panilha.habilidade) {
                    setCombateResultadoFinalDerrota(EResultadoCombate.DERROTA);
                    return EResultadoCombate.DERROTA;
                }
                break;
        }
        return EResultadoCombate.COMBATENDO;
    }

    function AvaliarResultadoCombateDoCombateExecutorProcessoDestruido(): EResultadoCombate {
        if (jogoAtual.panilha.energia === 0) {
            setCombateResultadoFinalInimigos(EResultadoCombate.DERROTA);
            return EResultadoCombate.DERROTA;
        }
        if (!combateInimigos_PosturaInimigo.find((posturaInimigo) => posturaInimigo !== EPosturaInimigo.MORTO)) {
            setCombateResultadoFinalInimigos(EResultadoCombate.VITORIA);
            return EResultadoCombate.VITORIA;
        }
        switch (combateAprovacaoDerrota.toLowerCase()) {
            case "InimigoComSerieDeAtaqueVencidoConsecutivo_2".toLowerCase():
                if (combateInimigos.find((inimigoI) => inimigoI.exeSerieDeAtaqueVencidoConsecutivo >= 2)) {
                    setCombateResultadoFinalDerrota(EResultadoCombate.DERROTA);
                    return EResultadoCombate.DERROTA;
                }
                break;
        }
        return EResultadoCombate.COMBATENDO;
    }

    function MontarElementoCombateAprovacaoDerrota() {
        switch (combateAprovacaoDerrota.toLowerCase()) {
            case "SerieDeAtaqueEhMaiorOuIgualAHabilidade".toLowerCase():
                return (
                    <div className={styles.combate_derrota_operacoesJogoLivro + " " + styles.combate_linhaUnica}>
                        <span>{"[ Série de ataque"}</span>
                        <span className={styles.combate_derrota_operacoesJogoLivro_numeroAtual}>{combateSerieDeAtaqueAtual}</span>
                        <span>{">= Habilidade"}</span>
                        <span className={styles.combate_derrota_operacoesJogoLivro_numeroAtual}>{jogoAtual.panilha.habilidade}</span>
                        <span>{"]"}</span>
                    </div>
                );
            default:
                return <></>;
        }
    }
};

export default OperacoesJogoLivro;
