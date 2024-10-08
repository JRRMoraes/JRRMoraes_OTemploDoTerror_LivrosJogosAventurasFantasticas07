import styles from "./ItemListaJogosSalvos.module.scss";
import { useState } from "react";
import { ContextoJogos } from "../contextos";
import { IJogo } from "../tipos";
import { Botao } from "./Botao";

interface IItemListaJogosSalvosProps {
    jogoSalvo: IJogo;
}

export const ItemListaJogosSalvos = ({ jogoSalvo }: IItemListaJogosSalvosProps) => {
    const { NavegarParaPaginaLivroJogoComJogoSalvo } = ContextoJogos();

    function AoJogarJogoSalvo() {
        NavegarParaPaginaLivroJogoComJogoSalvo(jogoSalvo);
    }

    const [focado, setFocado] = useState<boolean>(false);

    function AoFocar() {
        setFocado(true);
    }

    function AoDesfocar() {
        setFocado(false);
    }

    function ExibirBotaoJogar() {
        if (focado) {
            return <Botao aoClicar={() => AoJogarJogoSalvo()}>JOGAR</Botao>;
        } else {
            return <></>;
        }
    }

    function MontarJogoSalvoNovoJogo() {
        return (
            <div
                className={styles.itemLista}
                onFocus={() => AoFocar()}
                onMouseEnter={() => AoFocar()}
                onBlur={() => AoDesfocar()}
                onMouseLeave={() => AoDesfocar()}
            >
                <div className={styles.itemLista_indice}>{jogoSalvo.idJogo + ":"}</div>
                <div className={styles.itemLista_detalhes}>
                    <div className={styles.itemLista_novoJogo}>Iniciar novo jogo</div>
                    <div>{ExibirBotaoJogar()}</div>
                </div>
            </div>
        );
    }

    function MontarJogoSalvoExistente() {
        return (
            <div
                className={styles.itemLista}
                onFocus={() => AoFocar()}
                onBlur={() => AoDesfocar()}
            >
                <div className={styles.itemLista_indice}>{jogoSalvo.idJogo + ":"}</div>
                <div className={styles.itemLista_detalhes}>
                    <div className={styles.itemLista_infos}>
                        {jogoSalvo.panilha?.jogador} -{jogoSalvo.panilha?.habilidade} -{jogoSalvo.panilha?.energia} -{jogoSalvo.panilha?.sorte}
                    </div>
                    <div>{ExibirBotaoJogar()}</div>
                </div>
            </div>
        );
    }

    function MontarJogoSalvo() {
        if (jogoSalvo.panilha) {
            return MontarJogoSalvoExistente();
        } else {
            return MontarJogoSalvoNovoJogo();
        }
    }

    return <li key={jogoSalvo.idJogo}>{MontarJogoSalvo()}</li>;
};

export default ItemListaJogosSalvos;
