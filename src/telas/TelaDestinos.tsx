import styles from "./TelaDestinos.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoJogos, OperacoesJogoLivro } from "../contextos";
import { Botao } from "../componentes";
import { ECampanhaCapitulo, EJogoNivel, EPaginaCampanhaEstado, PAGINA_ZERADA } from "../tipos";
import { EProcesso } from "../uteis";

export const TelaDestinos = () => {
    const { jogoAtual, paginaCampanha, ImporPaginaCampanhaEJogoAtualViaDestino, SalvarJogoAtualNoSalvo } = ContextoJogos();

    const [salvando, setSalvando] = useState(EProcesso._ZERO);

    const { ObterOperacao } = OperacoesJogoLivro(jogoAtual, paginaCampanha);

    const navegador = useNavigate();

    useEffect(() => {
        if (!jogoAtual || !paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
            return;
        }
        if (paginaCampanha.idPaginaDestino === PAGINA_ZERADA.idPagina && paginaCampanha.idCapituloDestino === PAGINA_ZERADA.idCapitulo) {
            return;
        } else {
            ImporPaginaCampanhaEJogoAtualViaDestino(paginaCampanha.idPaginaDestino, paginaCampanha.idCapituloDestino);
        }
    }, [paginaCampanha]);

    useEffect(() => {
        if (salvando === EProcesso.INICIANDO && !paginaCampanha.ehJogoCarregado) {
            setSalvando(EProcesso.PROCESSANDO);
            SalvarJogoAtualNoSalvo();
            setTimeout(() => {
                setSalvando(EProcesso.CONCLUIDO);
            }, 2000);
        }
    }, [salvando]);

    if (!jogoAtual) {
        return <></>;
    }
    if (!paginaCampanha || !paginaCampanha.destinos || !paginaCampanha.destinos.length) {
        return <></>;
    }
    if (paginaCampanha.estado !== EPaginaCampanhaEstado.DESTINOS) {
        return <></>;
    }
    if (jogoAtual.panilha && jogoAtual.panilha.energia === 0 && jogoAtual.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_CAMPANHA) {
        return (
            <div className={styles.destinos}>
                <h5>VOCÊ MORREU - FIM DE JOGO</h5>
                {MontarRetorno_SalvaJogoAtual()}
                <div>
                    <Botao aoClicar={() => Reiniciar()}>Voltar a página inicial</Botao>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.destinos}>
                <h5>Escolha o seu Destino:</h5>
                {MontarRetorno_SalvaJogoAtual()}
                {MontarRetorno_Destinos()}
            </div>
        );
    }

    function MontarRetorno_SalvaJogoAtual() {
        if (paginaCampanha.ehJogoCarregado) {
            return <></>;
        }
        switch (salvando) {
            case EProcesso._ZERO:
                if (jogoAtual.panilha && jogoAtual.panilha.nivel === EJogoNivel._NORMAL) {
                    AoSalvarJogoAtual();
                    return <></>;
                } else {
                    return (
                        <div className={styles.destinos_salvar}>
                            <Botao aoClicar={() => AoSalvarJogoAtual()}>SALVAR JOGO ?</Botao>
                        </div>
                    );
                }
            case (EProcesso.INICIANDO, EProcesso.PROCESSANDO):
                return <div className={styles.destinos_salvar}>... SALVANDO O JOGO ...</div>;
            case EProcesso.CONCLUIDO:
                return <div className={styles.destinos_salvar}>JOGO SALVO !</div>;
            default:
                return <></>;
        }
    }

    function AoSalvarJogoAtual() {
        setSalvando(EProcesso.INICIANDO);
    }

    function MontarRetorno_Destinos() {
        return (
            <div>
                {paginaCampanha.destinos.map((destinoI, indiceI) => {
                    return (
                        <div key={indiceI}>
                            <Botao
                                aoClicar={() => destinoI.auxDestinoFuncao()}
                                desativado={ObterOperacao(destinoI.bloqueioOperacao)}
                            >
                                {destinoI.destino + " - " + destinoI.idPagina}
                            </Botao>
                        </div>
                    );
                })}
            </div>
        );
    }

    function Reiniciar() {
        navegador("/");
    }
};

export default TelaDestinos;
