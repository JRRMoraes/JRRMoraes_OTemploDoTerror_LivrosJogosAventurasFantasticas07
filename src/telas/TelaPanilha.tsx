import styles from "./TelaPanilha.module.scss";
import "../globais/CoresHES.scss";
import { ContextoJogos } from "../contextos";
import TelaPanilhaNova from "./TelaPanilhaNova";
import { EAtributo, IEfeito } from "../tipos";
import { FormatarNumberInteiro } from "../uteis";
import { BarraEnergia } from "../componentes";

export const TelaPanilha = () => {
    const { jogoAtual, ObterEfeitoAtualDoAtributo } = ContextoJogos();

    if (!jogoAtual) {
        return <></>;
    }
    if (!jogoAtual.panilha) {
        return <TelaPanilhaNova />;
    } else {
        return (
            <div className={styles.panilha}>
                <h2>{"Página X  -  Folha de Aventuras"}</h2>
                <div>
                    <table>
                        <tbody>
                            <tr>{MontarRetorno_Habilidade()}</tr>
                            <tr>{MontarRetorno_Energia()}</tr>
                            <tr>{MontarRetorno_Sorte()}</tr>
                            <tr>{MontarRetorno_Ouro()}</tr>
                            <tr>{MontarRetorno_Provisao()}</tr>
                            <tr>{MontarRetorno_Itens()}</tr>
                            <tr>{MontarRetorno_Encantos()}</tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    function MontarRetorno_Habilidade() {
        const _efeito = ObterEfeitoAtualDoAtributo(EAtributo.HABILIDADE);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        const _efeitoElemento = <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
        return (
            <td className="coresHES_habilidade">
                <span className={styles.panilha_titulo}>{"Habilidade:   "}</span>
                {_efeitoElemento}
                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.habilidade}</span>
                <span className={styles.panilha_fonteNormal}>{" / "}</span>
                <span>{jogoAtual.panilha.habilidadeInicial}</span>
            </td>
        );
    }

    function MontarRetorno_Energia() {
        const _efeito = ObterEfeitoAtualDoAtributo(EAtributo.ENERGIA);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        const _efeitoElemento = <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
        return (
            <td className={"coresHES_energia " + styles.panilha_energia}>
                <div>
                    <span className={styles.panilha_titulo}>{"Energia:   "}</span>
                    {_efeitoElemento}
                    <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.energia}</span>
                    <span className={styles.panilha_fonteNormal}>{" / "}</span>
                    <span>{jogoAtual.panilha.energiaInicial}</span>
                </div>
                <div className={styles.panilha_tabulacao}>{BarraEnergia(jogoAtual.panilha.energia, jogoAtual.panilha.energiaInicial)}</div>
            </td>
        );
    }

    function MontarRetorno_Sorte() {
        const _efeito = ObterEfeitoAtualDoAtributo(EAtributo.SORTE);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        const _efeitoElemento = <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
        return (
            <td className="coresHES_sorte">
                <span className={styles.panilha_titulo}>{"Sorte:   "}</span>
                {_efeitoElemento}
                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.sorte}</span>
                <span className={styles.panilha_fonteNormal}>{" / "}</span>
                <span>{jogoAtual.panilha.sorteInicial}</span>
            </td>
        );
    }

    function MontarRetorno_Ouro() {
        const _efeito = ObterEfeitoAtualDoAtributo(EAtributo.OURO);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        const _efeitoElemento = <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
        return (
            <td>
                <span className={styles.panilha_titulo}>{"Ouro:   "}</span>
                {_efeitoElemento}
                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.ouro}</span>
            </td>
        );
    }

    function MontarRetorno_Provisao() {
        const _efeito = ObterEfeitoAtualDoAtributo(EAtributo.PROVISAO);
        let _conteudo = "";
        if (_efeito) {
            _conteudo = FormatarNumberInteiro(_efeito.quantidade);
        }
        const _efeitoElemento = <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
        return (
            <td>
                <span className={styles.panilha_titulo}>{"Provisões:   "}</span>
                {_efeitoElemento}
                <span className={styles.panilha_numeroAtual}>{jogoAtual.panilha.provisao}</span>
            </td>
        );
    }

    function MontarRetorno_Itens() {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.itens) {
            const _efeito = ObterEfeitoAtualDoAtributo(EAtributo.ITENS);
            let _conteudo = "";
            if (_efeito) {
                _conteudo = _efeito.quantidade + " x " + _efeito.nomeEfeito;
            }
            const _efeitoElemento = <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
            return (
                <td>
                    <span className={styles.panilha_titulo}>{"Itens:   "}</span>
                    {_efeitoElemento}
                    <ul>
                        {jogoAtual.panilha.itens.map((itemI, indiceI) => {
                            return (
                                <li
                                    key={indiceI}
                                    className={styles.panilha_itens}
                                >
                                    {itemI.quantidade + " x  " + itemI.idItem}
                                </li>
                            );
                        })}
                    </ul>
                </td>
            );
        } else {
            return <td></td>;
        }
    }

    function MontarRetorno_Encantos() {
        if (jogoAtual && jogoAtual.panilha && jogoAtual.panilha.encantos) {
            const _efeito = ObterEfeitoAtualDoAtributo(EAtributo.ENCANTOS);
            let _conteudo = "";
            if (_efeito) {
                _conteudo = _efeito.nomeEfeito;
            }
            const _efeitoElemento = <span className={MontarEstilo(_efeito)}>{_conteudo}</span>;
            return (
                <td>
                    <span className={styles.panilha_titulo}>{"Encantos:   "}</span>
                    {_efeitoElemento}
                    <ul>
                        {jogoAtual.panilha.encantos.map((encantoI, indiceI) => {
                            return (
                                <li
                                    key={indiceI}
                                    className={styles.panilha_encantos}
                                >
                                    {encantoI}
                                </li>
                            );
                        })}
                    </ul>
                </td>
            );
        } else {
            return <td></td>;
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
};

export default TelaPanilha;
