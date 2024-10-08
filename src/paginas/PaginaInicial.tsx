import styles from "./PaginaInicial.module.scss";
import { useState } from "react";
import { ContextoLivro } from "../contextos";
import { IChildrenProps } from "../uteis";
import { TextosDatilografados } from "../componentes";
import { TelaListaJogosSalvos } from "../telas";

export const PaginaInicial = () => {
    const { livro, CaminhoImagem } = ContextoLivro();

    const [estado, setEstado] = useState<"ABERTURA" | "MENU">("ABERTURA");

    const MontarRetorno = ({ children }: IChildrenProps) => {
        return (
            <div
                className={styles.paginaInicial}
                style={{ backgroundImage: "url(" + CaminhoImagem("Capa.png") + ")" }}
            >
                {children}
            </div>
        );
    };

    function ExibirMenu() {
        setEstado("MENU");
    }

    function MontarRetorno_AberturaOuMenu() {
        if (estado === "ABERTURA") {
            return (
                <TextosDatilografados
                    textos={livro.resumoInicial}
                    velocidade={50}
                    aoConcluir={() => ExibirMenu()}
                />
            );
        } else {
            return <TelaListaJogosSalvos />;
        }
    }

    if (!livro) {
        return <></>;
    }
    return (
        <MontarRetorno>
            <div className={styles.paginaInicial_total}>
                <div className={styles.paginaInicial_espaco}></div>
                <div className={styles.paginaInicial_conteudo}>{MontarRetorno_AberturaOuMenu()}</div>
            </div>
        </MontarRetorno>
    );
};

export default PaginaInicial;
