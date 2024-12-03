import styles from "./PaginaInicial.module.scss";
import { ControlePaginaInicial, EEstadoPaginaInicial } from "../controles";
import { IChildrenProps } from "../uteis";
import { TextosDatilografados, ReprodutorAudio } from "../componentes";
import { UteisDimensoesPaginaHtml } from "../uteis";
import { TelaListaJogosSalvos } from "../telas";

export const PaginaInicial = () => {
    const { CREDITOS, estado, ContextosReprovados, ProcessarCreditos, ProcessarApresentacoes, ObterLivroApresentacoesIndice, CaminhoImagem } = ControlePaginaInicial();

    const { MontarElemento_BotaoFullscreen } = UteisDimensoesPaginaHtml();

    const MontarRetorno_Fundo = ({ children }: IChildrenProps) => {
        return (
            <div
                className={styles.paginaInicial}
                style={{ backgroundImage: "url(" + CaminhoImagem("Capa") + ")" }}
            >
                {children}
            </div>
        );
    };

    if (ContextosReprovados()) {
        return <></>;
    }
    switch (estado) {
        case EEstadoPaginaInicial._CREDITO:
            return (
                <div className={styles.paginaInicial}>
                    <div className={styles.paginaInicial_credito}>
                        <div className={styles.paginaInicial_credito_2}>
                            <div className={styles.paginaInicial_conteudo_2_apresentacao}>
                                <TextosDatilografados
                                    textos={CREDITOS}
                                    velocidade={20}
                                    aoConcluir={ProcessarCreditos}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        case EEstadoPaginaInicial.ABERTURA:
            return (
                <MontarRetorno_Fundo>
                    <div className={styles.paginaInicial_total}>
                        <div className={styles.paginaInicial_espaco}></div>
                        <div className={styles.paginaInicial_conteudo}>
                            <div className={styles.paginaInicial_conteudo_1}>
                                <ReprodutorAudio />
                                {MontarElemento_BotaoFullscreen()}
                            </div>
                            <div className={styles.paginaInicial_conteudo_2}>{MontarRetorno_Abertura()}</div>
                            <div className={styles.paginaInicial_conteudo_1}></div>
                        </div>
                    </div>
                </MontarRetorno_Fundo>
            );
        case EEstadoPaginaInicial.MENU:
        default:
            return (
                <MontarRetorno_Fundo>
                    <div className={styles.paginaInicial_total}>
                        <div className={styles.paginaInicial_espaco}></div>
                        <div className={styles.paginaInicial_conteudo}>
                            <div className={styles.paginaInicial_conteudo_1}>
                                <ReprodutorAudio />
                                {MontarElemento_BotaoFullscreen()}
                            </div>
                            <div className={styles.paginaInicial_conteudo_2}>
                                <div className={styles.paginaInicial_conteudo_2_jogosSalvos}>
                                    <TelaListaJogosSalvos />
                                </div>
                            </div>
                            <div className={styles.paginaInicial_conteudo_1}></div>
                        </div>
                    </div>
                </MontarRetorno_Fundo>
            );
    }

    function MontarRetorno_Abertura() {
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
    }
};

export default PaginaInicial;
