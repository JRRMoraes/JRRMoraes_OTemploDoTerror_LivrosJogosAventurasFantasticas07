import { useState, useEffect } from "react";
import { DESENVOLVIMENTO_PADRAO_WIDTH, CELULAR_MIN_WIDTH } from "../globais/Constantes";
import { Botao } from "../componentes";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";

export const UteisDimensoesPaginaHtml = () => {
    const [alturaReal, setAlturaReal] = useState(0);
    const [larguraReal, setLarguraReal] = useState(0);

    const [ehFullscreen, setEhFullscreen] = useState(false);

    useEffect(() => {
        Atualizar();

        window.addEventListener("resize", Atualizar);
        return () => {
            window.removeEventListener("resize", Atualizar);
        };
    }, []);

    return { alturaReal, larguraReal, EhDispositivoCelular, EhDispositivoTabletOuDesktop, PixelParaViewport, MontarElemento_BotaoFullscreen };

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

    function AlternarFullscreen() {
        if (!ehFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if ((document.documentElement as any).webkitRequestFullscreen) {
                /* Safari */ (document.documentElement as any).webkitRequestFullscreen();
            } else if ((document.documentElement as any).msRequestFullscreen) {
                /* IE11 */ (document.documentElement as any).msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                /* Safari */ (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
                /* IE11 */ (document as any).msExitFullscreen();
            }
        }
        setEhFullscreen(!ehFullscreen);
    }

    function MontarElemento_BotaoFullscreen() {
        if (ehFullscreen) {
            return (
                <Botao
                    aoClicar={AlternarFullscreen}
                    dica="Sair da tela cheia"
                >
                    <FullscreenExitOutlinedIcon />
                </Botao>
            );
        } else {
            return (
                <Botao
                    aoClicar={AlternarFullscreen}
                    dica="Exibir em tela cheia"
                >
                    <FullscreenOutlinedIcon />
                </Botao>
            );
        }
    }
};

export default UteisDimensoesPaginaHtml;
