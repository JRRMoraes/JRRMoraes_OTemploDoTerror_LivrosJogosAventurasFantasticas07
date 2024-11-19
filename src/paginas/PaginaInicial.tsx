import styles from "./PaginaInicial.module.scss";
import { ControlePaginaInicial, EEstadoPaginaInicial } from "../controles";
import { IChildrenProps } from "../uteis";
import { TextosDatilografados, ReprodutorAudio } from "../componentes";
import { UteisDimensoesPaginaHtml } from "../uteis";
import { TelaListaJogosSalvos } from "../telas";

export const PaginaInicial = () => {
    const { estado, ContextosReprovados, ProcessarApresentacoes, ObterLivroApresentacoesIndice, CaminhoImagem } = ControlePaginaInicial();

    const { MontarElemento_BotaoFullscreen } = UteisDimensoesPaginaHtml();

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

    if (ContextosReprovados()) {
        return <></>;
    }
    return (
        <MontarRetorno>
            <div className={styles.paginaInicial_total}>
                <div className={styles.paginaInicial_espaco}></div>
                <div className={styles.paginaInicial_conteudo}>
                    <div className={styles.paginaInicial_conteudo_1}>
                        <ReprodutorAudio />
                        {MontarElemento_BotaoFullscreen()}
                    </div>
                    <div className={styles.paginaInicial_conteudo_2}>{MontarRetorno_AberturaOuMenu()}</div>
                    <div className={styles.paginaInicial_conteudo_1}></div>
                </div>
            </div>
        </MontarRetorno>
    );

    function MontarRetorno_AberturaOuMenu() {
        if (estado === EEstadoPaginaInicial._ABERTURA) {
            if (ObterLivroApresentacoesIndice().length) {
                return (
                    <div className={styles.paginaInicial_conteudo_2_apresentacao}>
                        <TextosDatilografados
                            textos={ObterLivroApresentacoesIndice()}
                            velocidade={50}
                            aoConcluir={ProcessarApresentacoes}
                        />
                    </div>
                );
            } else {
                return <></>;
            }
        } else {
            return (
                <div className={styles.paginaInicial_conteudo_2_jogosSalvos}>
                    <TelaListaJogosSalvos />
                </div>
            );
        }
    }
};

export default PaginaInicial;
