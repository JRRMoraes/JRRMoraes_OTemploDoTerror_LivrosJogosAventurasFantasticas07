import styles from "./PaginaLivroJogo.module.scss";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { ContextoJogos } from "../contextos";
import { TelaCampanha, TelaPanilha } from "../telas";

export const PaginaLivroJogo = () => {
    let { idJogo } = useParams();

    const { jogoAtual, setJogoAtual, ObterJogoSalvo } = ContextoJogos();

    useEffect(() => {
        if (!jogoAtual) setJogoAtual(ObterJogoSalvo(idJogo!));
    }, []);

    if (!jogoAtual) return <></>;
    return (
        <div className={styles.livroJogo}>
            <div className={styles.livroJogo_panilha}>
                <TelaPanilha />
            </div>
            <div className={styles.livroJogo_campanha}>
                <TelaCampanha />
            </div>
        </div>
    );
};

export default PaginaLivroJogo;
