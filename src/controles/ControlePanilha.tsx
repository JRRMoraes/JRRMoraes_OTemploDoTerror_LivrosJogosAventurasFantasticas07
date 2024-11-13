import styles from "../telas/TelaPanilha.module.scss";
import "../globais/CoresHES.scss";
import { useState } from "react";
import { ContextoJogos } from "../contextos";
import { EAtributo, IEfeito } from "../tipos";
import { FormatarNumberInteiro, UteisDimensoesPaginaHtml } from "../uteis";

export const ControlePanilha = () => {
    const [completo, setCompleto] = useState(true);

    const { jogoAtual, ObterJogadorEfeitoAplicadoDoAtributo } = ContextoJogos();

    const { EhDispositivoCelular, EhDispositivoTabletOuDesktop } = UteisDimensoesPaginaHtml();

    return {
        jogoAtual,
        completo,
        ContextosReprovados,
        ExibirTitulo,
        ObterElementoEfeitoHabilidade,
        ObterElementoEfeitoEnergia,
        ObterElementoEfeitoSorte,
        ObterElementoEfeitoOuro,
        ObterElementoEfeitoProvisao,
        ObterElementoEfeitoItens,
        ObterElementoEfeitoEncantos,
        ExibirBotaoExpandirReduzir,
        AoClicarNoBotaoExpandir,
        AoClicarNoBotaoReduzir,
        ObterPanilhaFormato,
    };

    function ContextosReprovados() {
        return !jogoAtual || !jogoAtual.panilha;
    }

    function ExibirTitulo() {
        return EhDispositivoTabletOuDesktop() || completo;
    }

    function ObterElementoEfeitoHabilidade() {
        const _efeito = ObterJogadorEfeitoAplicadoDoAtributo(EAtributo.HABILIDADE);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        return <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
    }

    function ObterElementoEfeitoEnergia() {
        const _efeito = ObterJogadorEfeitoAplicadoDoAtributo(EAtributo.ENERGIA);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        return <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
    }

    function ObterElementoEfeitoSorte() {
        const _efeito = ObterJogadorEfeitoAplicadoDoAtributo(EAtributo.SORTE);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        return <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
    }

    function ObterElementoEfeitoOuro() {
        const _efeito = ObterJogadorEfeitoAplicadoDoAtributo(EAtributo.OURO);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        return <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
    }

    function ObterElementoEfeitoProvisao() {
        const _efeito = ObterJogadorEfeitoAplicadoDoAtributo(EAtributo.PROVISAO);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        return <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
    }

    function ObterElementoEfeitoItens() {
        const _efeito = ObterJogadorEfeitoAplicadoDoAtributo(EAtributo.ITENS);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = _efeito.quantidade + " x " + _efeito.nomeEfeito;
        }
        return <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
    }

    function ObterElementoEfeitoEncantos() {
        const _efeito = ObterJogadorEfeitoAplicadoDoAtributo(EAtributo.ENCANTOS);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = _efeito.nomeEfeito;
        }
        return <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
    }

    function MontarEstilo(efeito: IEfeito) {
        let _estilo = styles.panilha_efeito;
        if (efeito) {
            _estilo += " " + styles.panilha_efeito_popup;
            if (efeito.quantidade >= 1) {
                _estilo += " " + styles.panilha_efeito_bom;
            } else {
                _estilo += " " + styles.panilha_efeito_ruim;
            }
        }
        return _estilo;
    }

    function ExibirBotaoExpandirReduzir() {
        return EhDispositivoCelular();
    }

    function AoClicarNoBotaoExpandir() {
        setCompleto(true);
    }

    function AoClicarNoBotaoReduzir() {
        setCompleto(false);
    }

    function ObterPanilhaFormato() {
        if (completo) {
            if (EhDispositivoTabletOuDesktop()) {
                return EPanilhaFormato._COMPLETO_UMA_COLUNA;
            } else {
                return EPanilhaFormato.COMPLETO_DUAS_COLUNAS;
            }
        } else {
            return EPanilhaFormato.INCOMPLETO_TRES_COLUNAS;
        }
    }
};

export default ControlePanilha;

export enum EPanilhaFormato {
    _COMPLETO_UMA_COLUNA,
    COMPLETO_DUAS_COLUNAS,
    INCOMPLETO_TRES_COLUNAS,
}
