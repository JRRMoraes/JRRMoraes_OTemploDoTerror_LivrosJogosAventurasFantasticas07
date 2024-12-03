import styles from "./PaginaLivroJogo2.module.scss";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { TelaCampanha, TelaPanilha } from "../telas";
import { ControlePaginaLivroJogo2 } from "../controles";
import { FlipBookPagina, ReprodutorAudio } from "../componentes";
import HTMLFlipBook from "react-pageflip";
import { FLIP_BOOK_ALTURA_MINIMA, FLIP_BOOK_LARGURA_MINIMA, TEMPO_ANIMACAO_NORMAL } from "../globais/Constantes";
import { ContextoLivro } from "../contextos";

export const PaginaLivroJogo2 = () => {
    const { flipBookRef, EhDispositivoTabletOuDesktop } = ControlePaginaLivroJogo2();

    const { CaminhoImagem } = ContextoLivro();

    const estiloFlipBook: CSSProperties = {
        border: "4px solid #d6b966",
    };

    const parentFlipBookRef = useRef<HTMLDivElement>(null);
    const [parentFlipBookDimensoes, setParentFlipBookDimensoes] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (parentFlipBookRef.current) {
            setParentFlipBookDimensoes({
                width: parentFlipBookRef.current.offsetWidth,
                height: parentFlipBookRef.current.offsetHeight,
            });
        }
    }, []);

    if (EhDispositivoTabletOuDesktop()) {
        return (
            <div
                className={styles.livroJogo_Desktop}
                ref={parentFlipBookRef}
            >
                <HTMLFlipBook
                    className={""}
                    style={estiloFlipBook}
                    ref={flipBookRef}
                    height={parentFlipBookDimensoes.height}
                    minHeight={FLIP_BOOK_ALTURA_MINIMA}
                    maxHeight={FLIP_BOOK_ALTURA_MINIMA * 2}
                    width={parentFlipBookDimensoes.width}
                    minWidth={FLIP_BOOK_LARGURA_MINIMA}
                    maxWidth={FLIP_BOOK_LARGURA_MINIMA * 2}
                    size={"stretch"}
                    startPage={0}
                    flippingTime={TEMPO_ANIMACAO_NORMAL}
                    useMouseEvents={false}
                    disableFlipByClick={false}
                    clickEventForward={false}
                    mobileScrollSupport={true}
                    drawShadow={true}
                    usePortrait={false}
                    startZIndex={0}
                    autoSize={true}
                    maxShadowOpacity={1}
                    showCover={true}
                    swipeDistance={0}
                    showPageCorners={true}
                >
                    <FlipBookPagina>{FlipPagina_Capa()}</FlipBookPagina>
                    <FlipBookPagina>{FlipPagina_Panilha_Desktop()}</FlipBookPagina>
                    <FlipBookPagina>{FlipPagina_Campanha_Desktop()}</FlipBookPagina>
                    <FlipBookPagina>{FlipPagina_Panilha_Desktop()}</FlipBookPagina>
                    <FlipBookPagina>{FlipPagina_Campanha_Desktop()}</FlipBookPagina>
                    <FlipBookPagina>{FlipPagina_Panilha_Desktop()}</FlipBookPagina>
                    <FlipBookPagina>{FlipPagina_Campanha_Desktop()}</FlipBookPagina>
                    <FlipBookPagina></FlipBookPagina>
                </HTMLFlipBook>
            </div>
        );
    } else {
        return (
            <div className={styles.livroJogo_Celular}>
                <div className={styles.livroJogo_Celular_fundo}>
                    <div className={styles.livroJogo_Celular_panilha}>
                        <div className={styles.livroJogo_Celular_panilha_2}>
                            <TelaPanilha />
                        </div>
                    </div>
                    <div className={styles.livroJogo_Celular_campanha}>
                        <div className={styles.livroJogo_Celular_campanha_2}>
                            <TelaCampanha />
                        </div>
                    </div>
                </div>
                <ReprodutorAudio />
            </div>
        );
    }

    function FlipPagina_Capa() {
        return (
            <img
                className={styles.livroJogo_Desktop_capa}
                src={CaminhoImagem("Capa")}
                alt=""
                height={parentFlipBookDimensoes.height}
                width={parentFlipBookDimensoes.width / 2}
            />
        );
    }

    function FlipPagina_Panilha_Desktop() {
        return (
            <div className={styles.livroJogo_Desktop_panilha}>
                <div className={styles.livroJogo_Desktop_panilha_2}>
                    <TelaPanilha />
                </div>
                <div className={styles.livroJogo_Desktop_panilha_audio}>
                    <ReprodutorAudio />
                </div>
            </div>
        );
    }

    function FlipPagina_Campanha_Desktop() {
        return (
            <div className={styles.livroJogo_Desktop_campanha}>
                <div className={styles.livroJogo_Desktop_campanha_2}>
                    <TelaCampanha />
                </div>
            </div>
        );
    }
};

export default PaginaLivroJogo2;
