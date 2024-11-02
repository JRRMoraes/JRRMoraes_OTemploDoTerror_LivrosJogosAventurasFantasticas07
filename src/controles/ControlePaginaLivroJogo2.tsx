import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { ContextoLivro, ContextoJogos } from "../contextos";
import { isMobile } from "react-device-detect";
import { IHTMLFlipBookRef } from "../componentes/FlipBookPagina";
import { EProcesso } from "../uteis";
import { TEMPO_ANIMACAO_NORMAL, TEMPO_ANIMACAO_PEQUENO } from "../globais/Constantes";

export const ControlePaginaLivroJogo2 = () => {
    let { idJogo } = useParams();

    const [ehJogoCarregado, setEhJogoCarregado] = useState(false);

    const { livro, ObterPagina } = ContextoLivro();

    const { jogoAtual, paginaExecutor, CarregarJogoSalvoOuNovo, ResetarJogo, ImporExecutores, AtualizarPaginaExecutorAutomaticamente } = ContextoJogos();

    const flipBookRef = useRef<IHTMLFlipBookRef>(null);

    const [flipProcesso, setFlipProcesso] = useState<EProcesso>(EProcesso._ZERO);
    let _flipTimeout: NodeJS.Timeout = null!;

    const [capaProcesso, setCapaProcesso] = useState<EProcesso>(EProcesso._ZERO);
    let _capaTimeout: NodeJS.Timeout = null!;

    const [paginaFlipBook, setPaginaFlipBook] = useState(0);

    useEffect(() => {
        switch (capaProcesso) {
            case EProcesso._ZERO:
                if (!_capaTimeout) {
                    _capaTimeout = setTimeout(() => {
                        setCapaProcesso(EProcesso.INICIANDO);
                        _capaTimeout = null!;
                    }, TEMPO_ANIMACAO_NORMAL);
                }
                break;
            case EProcesso.INICIANDO:
                if (!jogoAtual) {
                    setEhJogoCarregado(CarregarJogoSalvoOuNovo(idJogo!));
                } else if (flipProcesso === EProcesso._ZERO) {
                    setCapaProcesso(EProcesso.PROCESSANDO);
                    IniciarMudancaFlipPagina();
                }
                break;
            case EProcesso.PROCESSANDO:
                if (flipProcesso === EProcesso.DESTRUIDO) {
                    setCapaProcesso(EProcesso.CONCLUIDO);
                }
                break;
            case EProcesso.CONCLUIDO:
                if (!_capaTimeout) {
                    _capaTimeout = setTimeout(() => {
                        setCapaProcesso(EProcesso.DESTRUIDO);
                        _capaTimeout = null!;
                    }, TEMPO_ANIMACAO_PEQUENO);
                }
                break;
            case EProcesso.DESTRUIDO:
                break;
        }
    }, [idJogo, capaProcesso, jogoAtual, flipProcesso]);

    useEffect(() => {
        switch (flipProcesso) {
            case EProcesso.INICIANDO:
                setFlipProcesso(EProcesso.PROCESSANDO);
                MudarAPaginaNoFlipBook();
                if (!_flipTimeout) {
                    _flipTimeout = setTimeout(() => {
                        setFlipProcesso(EProcesso.CONCLUIDO);
                        _flipTimeout = null!;
                    }, TEMPO_ANIMACAO_NORMAL);
                }
                break;
            case EProcesso.CONCLUIDO:
                if (!_flipTimeout) {
                    _flipTimeout = setTimeout(() => {
                        setCapaProcesso(EProcesso.DESTRUIDO);
                        _flipTimeout = null!;
                    }, TEMPO_ANIMACAO_PEQUENO);
                }
                break;
            case EProcesso.DESTRUIDO:
                setCapaProcesso(EProcesso._ZERO);
                break;
        }
    }, [flipProcesso]);

    useEffect(() => {
        window.addEventListener("beforeunload", ProcessarRefresh);
        return () => {
            window.removeEventListener("beforeunload", ProcessarRefresh);
        };
    }, []);

    return { paginaFlipBook, flipBookRef, ContextosReprovados, EhDesktop, MudarAPaginaNoFlipBook, IniciarMudancaFlipPagina };

    function ContextosReprovados() {
        return !!(!jogoAtual || !paginaExecutor);
    }

    function EhDesktop() {
        return !isMobile;
    }

    function MudarAPaginaNoFlipBook() {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipNext();
            //flipBookRef.current.pageFlip().turnToPage(2);
        }
    }

    function IniciarMudancaFlipPagina() {
        setFlipProcesso(EProcesso.INICIANDO);
    }

    function ProcessarRefresh(evento: BeforeUnloadEvent) {
        evento.preventDefault();
        ResetarJogo();
    }
};

export default ControlePaginaLivroJogo2;
