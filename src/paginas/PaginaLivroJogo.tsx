import styles from "./PaginaLivroJogo.module.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ContextoLivro, ContextoJogos } from "../contextos";
import { TelaCampanha, TelaPanilha } from "../telas";
import { isMobile } from "react-device-detect";

export const PaginaLivroJogo = () => {
    let { idJogo } = useParams();

    const [ehJogoCarregado, setEhJogoCarregado] = useState(false);

    const { livro, ObterPagina } = ContextoLivro();

    const { jogoAtual, paginaCampanha, CarregarJogoSalvoOuNovo, ImporPaginaAtualECampanha, ImporPaginaCampanhaViaAtual } = ContextoJogos();

    useEffect(() => {
        setEhJogoCarregado(CarregarJogoSalvoOuNovo(idJogo!));
    }, [idJogo]);

    useEffect(() => {
        if (jogoAtual) {
            ImporPaginaAtualECampanha(ObterPagina(jogoAtual), ehJogoCarregado);
            ImporPaginaCampanhaViaAtual();
        }
    }, [livro, jogoAtual, paginaCampanha]);

    if (!jogoAtual || !paginaCampanha) {
        return <></>;
    }
    //// Se isMobile, criar abas
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
