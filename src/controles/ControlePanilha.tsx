import styles from "../telas/TelaPanilha.module.scss";
import "../globais/CoresHES.scss";
import { useState } from "react";
import { ContextoJogos } from "../contextos";
import { EAtributo, IEfeito } from "../tipos";
import { FormatarNumberInteiro, UteisDimensoesPaginaHtml } from "../uteis";

export const ControlePanilha = () => {
    const [completo, setCompleto] = useState(true);

    const { jogoAtual, ObterJogadorEfeitosAplicadosDoAtributo } = ContextoJogos();

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
        return MontarElementosDosEfeitosPorQuantidade(ObterJogadorEfeitosAplicadosDoAtributo(EAtributo.HABILIDADE));
    }

    function ObterElementoEfeitoEnergia() {
        return MontarElementosDosEfeitosPorQuantidade(ObterJogadorEfeitosAplicadosDoAtributo(EAtributo.ENERGIA));
    }

    function ObterElementoEfeitoSorte() {
        return MontarElementosDosEfeitosPorQuantidade(ObterJogadorEfeitosAplicadosDoAtributo(EAtributo.SORTE));
    }

    function ObterElementoEfeitoOuro() {
        return MontarElementosDosEfeitosPorQuantidade(ObterJogadorEfeitosAplicadosDoAtributo(EAtributo.OURO));
    }

    function ObterElementoEfeitoProvisao() {
        return MontarElementosDosEfeitosPorQuantidade(ObterJogadorEfeitosAplicadosDoAtributo(EAtributo.PROVISAO));
    }

    function ObterElementoEfeitoItens() {
        const _efeitos = ObterJogadorEfeitosAplicadosDoAtributo(EAtributo.ITENS);
        if (_efeitos && _efeitos.length) {
            return _efeitos.map((efeitoI, indiceI) => (
                <span
                    key={indiceI}
                    className={MontarEstilo(efeitoI)}
                >
                    {efeitoI.quantidade + " x " + efeitoI.nomeEfeito}
                </span>
            ));
        } else {
            return <></>;
        }
    }

    function ObterElementoEfeitoEncantos() {
        const _efeitos = ObterJogadorEfeitosAplicadosDoAtributo(EAtributo.ENCANTOS);
        if (_efeitos && _efeitos.length) {
            return _efeitos.map((efeitoI, indiceI) => (
                <span
                    key={indiceI}
                    className={MontarEstilo(efeitoI)}
                >
                    {efeitoI.nomeEfeito}
                </span>
            ));
        } else {
            return <></>;
        }
    }

    function MontarElementosDosEfeitosPorQuantidade(efeitos: IEfeito[]) {
        if (efeitos && efeitos.length) {
            return efeitos.map((efeitoI, indiceI) => (
                <span
                    key={indiceI}
                    className={MontarEstilo(efeitoI)}
                >
                    {FormatarNumberInteiro(efeitoI.quantidade)}
                </span>
            ));
        } else {
            return <></>;
        }
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
