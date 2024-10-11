import styles from "./ItemListaJogosSalvos.module.scss";
import { useState } from "react";
import { ContextoJogos } from "../contextos";
import { IJogo, ECampanhaCapitulo } from "../tipos";
import { Botao } from "./Botao";

interface IItemListaJogosSalvosProps {
    jogoSalvo: IJogo;
}

export const ItemListaJogosSalvos = ({ jogoSalvo }: IItemListaJogosSalvosProps) => {
    const { NavegarParaPaginaLivroJogoComJogoSalvo, ExcluirJogoSalvo } = ContextoJogos();

    const [focado, setFocado] = useState<boolean>(false);

    function AoFocar() {
        setFocado(true);
    }

    function AoDesfocar() {
        setFocado(false);
    }

    function MontarRetorno_JogoSalvoOuNovo() {
        if (jogoSalvo && jogoSalvo.panilha) {
            let _pagina = "Página: " + jogoSalvo.campanhaIndice;
            let _campanha = jogoSalvo.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_INICIAIS ? " do Início" : " da Campanha";
            return (
                <div>
                    <div className={styles.itemLista_infos}>
                        <p>{"Habilidade: " + jogoSalvo.panilha?.habilidade + ", Energia: " + jogoSalvo.panilha?.energia + " e Sorte: " + jogoSalvo.panilha?.sorte}</p>
                    </div>
                    <div>
                        {MontarRetorno_BotaoJogar()}
                        <p>{_pagina + _campanha}</p>
                        {MontarRetorno_BotaoExcluirJogo()}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className={styles.itemLista_novoJogo}>Iniciar novo jogo</div>
                    <div>{MontarRetorno_BotaoJogar()}</div>
                </div>
            );
        }
    }

    function AoJogarJogoSalvo() {
        NavegarParaPaginaLivroJogoComJogoSalvo(jogoSalvo);
    }

    function MontarRetorno_BotaoJogar() {
        if (focado) {
            return <Botao aoClicar={() => AoJogarJogoSalvo()}>JOGAR</Botao>;
        } else {
            return <></>;
        }
    }

    function AoExcluirJogoSalvo() {
        ExcluirJogoSalvo(jogoSalvo.idJogo.toString());
    }

    function MontarRetorno_BotaoExcluirJogo() {
        if (focado) {
            return <Botao aoClicar={() => AoExcluirJogoSalvo()}>EXCLUIR</Botao>;
        } else {
            return <></>;
        }
    }

    function MontarRetorno() {
        return (
            <div
                className={styles.itemLista}
                onFocus={() => AoFocar()}
                onMouseEnter={() => AoFocar()}
                onBlur={() => AoDesfocar()}
                onMouseLeave={() => AoDesfocar()}
            >
                <div className={styles.itemLista_indice}>{jogoSalvo.idJogo + ":"}</div>
                <div className={styles.itemLista_detalhes}>{MontarRetorno_JogoSalvoOuNovo()}</div>
            </div>
        );
    }

    if (jogoSalvo && jogoSalvo.panilha) {
        return (
            <li
                key={jogoSalvo.idJogo}
                className={styles.itemSalvo}
            >
                {MontarRetorno()}
            </li>
        );
    } else {
        return (
            <li
                key={jogoSalvo.idJogo}
                className={styles.itemNovo}
            >
                {MontarRetorno()}
            </li>
        );
    }
};

export default ItemListaJogosSalvos;
