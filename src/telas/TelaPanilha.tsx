import styles from "./TelaPanilha.module.scss";
import "../globais/CoresHES.scss";
import { ControlePanilha, EPanilhaFormato } from "../controles";
import { BarraEnergia, BarraHabilidade, BarraSorte, Botao, NumeroAlteravel } from "../componentes";

export const TelaPanilha = () => {
    const {
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
    } = ControlePanilha();

    if (ContextosReprovados()) {
        return <></>;
    } else {
        return (
            <div className={styles.panilha}>
                {MontarRetorno_Titulo()}
                <div>
                    <table>{MontarRetorno_Tabela()}</table>
                </div>
            </div>
        );
    }

    function MontarRetorno_Titulo() {
        if (ExibirTitulo()) {
            return (
                <h2>
                    <span>{"Página X  -"}</span>
                    <span>{"  Folha de Aventuras"}</span>
                </h2>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Tabela() {
        switch (ObterPanilhaFormato()) {
            case EPanilhaFormato._COMPLETO_UMA_COLUNA:
                return (
                    <tbody className={styles.panilha_completo}>
                        <tr>{MontarRetorno_Habilidade()}</tr>
                        <tr>{MontarRetorno_Energia()}</tr>
                        <tr>{MontarRetorno_Sorte()}</tr>
                        <tr>{MontarRetorno_Ouro()}</tr>
                        <tr>{MontarRetorno_Provisao()}</tr>
                        <tr>{MontarRetorno_Itens()}</tr>
                        <tr>{MontarRetorno_Encantos()}</tr>
                        <tr>{MontarRetorno_BotaoExpandirReduzir()}</tr>
                    </tbody>
                );
            case EPanilhaFormato.COMPLETO_DUAS_COLUNAS:
                return (
                    <tbody className={styles.panilha_completo}>
                        <tr>
                            {MontarRetorno_Habilidade()}
                            {MontarRetorno_Itens()}
                        </tr>
                        <tr>{MontarRetorno_Energia()}</tr>
                        <tr>{MontarRetorno_Sorte()}</tr>
                        <tr>
                            {MontarRetorno_Ouro()}
                            {MontarRetorno_Encantos()}
                        </tr>
                        <tr>{MontarRetorno_Provisao()}</tr>
                        <tr>{MontarRetorno_BotaoExpandirReduzir()}</tr>
                    </tbody>
                );
            case EPanilhaFormato.INCOMPLETO_TRES_COLUNAS:
                return (
                    <tbody className={styles.panilha_incompleto}>
                        <tr>
                            {MontarRetorno_Habilidade()}
                            {MontarRetorno_Energia()}
                            {MontarRetorno_Sorte()}
                        </tr>
                        <tr>
                            {MontarRetorno_Ouro()}
                            {MontarRetorno_Provisao()}
                            {MontarRetorno_BotaoExpandirReduzir()}
                        </tr>
                    </tbody>
                );
        }
    }

    function MontarRetorno_Habilidade() {
        let _barraHabilidade = <></>;
        if (completo) {
            _barraHabilidade = <div className={styles.panilha_tabulacao}>{BarraHabilidade(jogoAtual.panilha.habilidade, jogoAtual.panilha.habilidadeInicial)}</div>;
        }
        return (
            <td className="coresHES_habilidade">
                <div>
                    <span className={styles.panilha_titulo}>{"Habilidade:   "}</span>
                    {ObterElementoEfeitoHabilidade()}
                    <NumeroAlteravel numeroAtual={jogoAtual.panilha.habilidade} />
                    <span className={styles.panilha_fonteNormal}>{" / "}</span>
                    <span>{jogoAtual.panilha.habilidadeInicial}</span>
                </div>
                {_barraHabilidade}
            </td>
        );
    }

    function MontarRetorno_Energia() {
        let _barraEnergia = <></>;
        if (completo) {
            _barraEnergia = <div className={styles.panilha_tabulacao}>{BarraEnergia(jogoAtual.panilha.energia, jogoAtual.panilha.energiaInicial)}</div>;
        }
        return (
            <td className={"coresHES_energia"}>
                <div>
                    <span className={styles.panilha_titulo}>{"Energia:   "}</span>
                    {ObterElementoEfeitoEnergia()}
                    <NumeroAlteravel numeroAtual={jogoAtual.panilha.energia} />
                    <span className={styles.panilha_fonteNormal}>{" / "}</span>
                    <span>{jogoAtual.panilha.energiaInicial}</span>
                </div>
                {_barraEnergia}
            </td>
        );
    }

    function MontarRetorno_Sorte() {
        let _barraSorte = <></>;
        if (completo) {
            _barraSorte = <div className={styles.panilha_tabulacao}>{BarraSorte(jogoAtual.panilha.sorte, jogoAtual.panilha.sorteInicial)}</div>;
        }
        return (
            <td className="coresHES_sorte">
                <div>
                    <span className={styles.panilha_titulo}>{"Sorte:   "}</span>
                    {ObterElementoEfeitoSorte()}
                    <NumeroAlteravel numeroAtual={jogoAtual.panilha.sorte} />
                    <span className={styles.panilha_fonteNormal}>{" / "}</span>
                    <span>{jogoAtual.panilha.sorteInicial}</span>
                </div>
                {_barraSorte}
            </td>
        );
    }

    function MontarRetorno_Ouro() {
        return (
            <td>
                <span className={styles.panilha_titulo}>{"Ouro:   "}</span>
                {ObterElementoEfeitoOuro()}
                <NumeroAlteravel numeroAtual={jogoAtual.panilha.ouro} />
            </td>
        );
    }

    function MontarRetorno_Provisao() {
        return (
            <td>
                <span className={styles.panilha_titulo}>{"Provisões:   "}</span>
                {ObterElementoEfeitoProvisao()}
                <NumeroAlteravel numeroAtual={jogoAtual.panilha.provisao} />
            </td>
        );
    }

    function MontarRetorno_Itens() {
        const _rowspan = ObterPanilhaFormato() === EPanilhaFormato.COMPLETO_DUAS_COLUNAS ? 3 : 1;
        return (
            <td rowSpan={_rowspan}>
                <span className={styles.panilha_titulo}>{"Itens:   "}</span>
                {ObterElementoEfeitoItens()}
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
    }

    function MontarRetorno_Encantos() {
        const _rowspan = ObterPanilhaFormato() === EPanilhaFormato.COMPLETO_DUAS_COLUNAS ? 2 : 1;
        return (
            <td rowSpan={_rowspan}>
                <span className={styles.panilha_titulo}>{"Encantos:   "}</span>
                {ObterElementoEfeitoEncantos()}
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
    }

    function MontarRetorno_BotaoExpandirReduzir() {
        if (!ExibirBotaoExpandirReduzir()) {
            return <td></td>;
        }
        const _colunaVazia = ObterPanilhaFormato() === EPanilhaFormato.COMPLETO_DUAS_COLUNAS ? <td></td> : <></>;
        if (completo) {
            return (
                <>
                    {_colunaVazia}
                    <td className={styles.panilha_comandos}>
                        <Botao aoClicar={AoClicarNoBotaoReduzir}>{"Reduzir Folha de Aventuras"}</Botao>
                    </td>
                </>
            );
        } else {
            return (
                <>
                    {_colunaVazia}
                    <td className={styles.panilha_comandos}>
                        <Botao aoClicar={AoClicarNoBotaoExpandir}>{"Expandir Folha de Aventuras"}</Botao>
                    </td>
                </>
            );
        }
    }
};

export default TelaPanilha;
