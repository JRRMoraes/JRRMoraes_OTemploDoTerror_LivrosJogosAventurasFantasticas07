import styles from "./PaginaLivroJogo.module.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ContextoJogos, ContextoLivro } from "../contextos";
import { TelaCampanha, TelaPanilha } from "../telas";

export const PaginaLivroJogo = () => {
    let { idJogo } = useParams();

    const [ehJogoCarregado, setEhJogoCarregado] = useState(false);

    const { ObterPagina } = ContextoLivro();

    const { jogoAtual, paginaCampanha, CarregarJogoSalvoOuNovo, ImporPaginaAtualECampanha, ImporPaginaCampanhaViaAtual } = ContextoJogos();

    useEffect(() => {
        setEhJogoCarregado(CarregarJogoSalvoOuNovo(idJogo!));
    }, [idJogo]);

    useEffect(() => {
        if (jogoAtual) {
            ImporPaginaAtualECampanha(ObterPagina(jogoAtual), ehJogoCarregado);
            ImporPaginaCampanhaViaAtual();
        }
    }, [jogoAtual, paginaCampanha]);

    if (!jogoAtual || !paginaCampanha) {
        return <></>;
    }
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
