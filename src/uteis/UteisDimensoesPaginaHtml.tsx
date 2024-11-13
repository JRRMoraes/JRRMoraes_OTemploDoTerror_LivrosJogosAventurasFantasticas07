import { useState, useEffect } from "react";
import { DESENVOLVIMENTO_PADRAO_WIDTH, CELULAR_MIN_WIDTH } from "../globais/Constantes";

export const UteisDimensoesPaginaHtml = () => {
    const [alturaReal, setAlturaReal] = useState(0);
    const [larguraReal, setLarguraReal] = useState(0);

    useEffect(() => {
        Atualizar();

        window.addEventListener("resize", Atualizar);
        return () => {
            window.removeEventListener("resize", Atualizar);
        };
    }, []);

    return { alturaReal, larguraReal, EhDispositivoCelular, EhDispositivoTabletOuDesktop, PixelParaViewport };

    function Atualizar() {
        const _height = Math.max(
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.body.scrollHeight,
            document.body.offsetHeight
        );
        setAlturaReal(_height);

        const _width = Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth, document.body.scrollWidth, document.body.offsetWidth);
        setLarguraReal(_width);
    }

    function EhDispositivoCelular() {
        return larguraReal <= CELULAR_MIN_WIDTH;
    }

    function EhDispositivoTabletOuDesktop() {
        return !EhDispositivoCelular();
    }

    function PixelParaViewport(tamanho: number, larguraMaxima: number = DESENVOLVIMENTO_PADRAO_WIDTH) {
        const _vw = (tamanho / larguraMaxima) * 100;
        return `${_vw}vw`;
    }
};

export default UteisDimensoesPaginaHtml;
