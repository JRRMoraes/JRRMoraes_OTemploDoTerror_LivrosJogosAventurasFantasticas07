import styles from "./TelaCombate.module.scss";
import { useState, useEffect, useRef } from "react";
import { ContextoJogos } from "../contextos";
import { EPaginaCampanhaEstado, AvaliarResultadoCombateDaPaginaCampanhaCombate, EResultadoCombate } from "../tipos";
import { EProcesso } from "../uteis";
import { ReactDiceRef } from "react-dice-complete";

interface ITelaCombateConclusao {
    processo: EProcesso;
    processoInimigo: EProcesso;
}

export const TelaCombate = () => {
    const { jogoAtual, paginaCampanha, ImporProcessoCombateNaPaginaCampanha, ImporPaginaCampanhaCombateDoProcessoZeroDaSerieDeAtaque } = ContextoJogos();

    const [serieDeAtaqueAtual, setSerieDeAtaqueAtual] = useState(1);
    const [processoSerieDeAtaque, setProcessoSerieDeAtaque] = useState<EProcesso>(EProcesso._ZERO);

    const dados = useRef<ReactDiceRef>(null);

    // const [rolagemDados, setRolagemDados] = useState<IRolagemParaDestino>(ROLAGEM_PARA_DESTINO_ZERADA);

    useEffect(() => {
        if (ContextosReprovados(false)) {
            setSerieDeAtaqueAtual(1);
            setProcessoSerieDeAtaque(EProcesso._ZERO);
            return;
        }
        if (paginaCampanha.processoCombate === EProcesso.INICIANDO) {
            setSerieDeAtaqueAtual(1);
            setProcessoSerieDeAtaque(EProcesso._ZERO);
            ImporProcessoCombateNaPaginaCampanha(EProcesso.PROCESSANDO);
            return;
        }
        if (paginaCampanha.processoCombate === EProcesso.PROCESSANDO) {
            if (processoSerieDeAtaque === EProcesso._ZERO) {
                ImporPaginaCampanhaCombateDoProcessoZeroDaSerieDeAtaque(serieDeAtaqueAtual);
                setProcessoSerieDeAtaque(EProcesso.INICIANDO);
            } else if (processoSerieDeAtaque === EProcesso.INICIANDO) {
                // aprovar
            } else if (processoSerieDeAtaque === EProcesso.PROCESSANDO) {
                // rolar dados
            } else if (processoSerieDeAtaque === EProcesso.DESTRUIDO) {
                switch (AvaliarResultadoCombateDaPaginaCampanhaCombate(paginaCampanha.combate, jogoAtual.panilha)) {
                    case EResultadoCombate.VITORIA:
                        ImporProcessoCombateNaPaginaCampanha(EProcesso.CONCLUIDO);
                        break;
                    case EResultadoCombate.DERROTA:
                        // matar ou destino derrota
                        break;
                    case EResultadoCombate._COMBATENDO:
                    default:
                        setSerieDeAtaqueAtual((prevSerieDeAtaqueAtual) => prevSerieDeAtaqueAtual + 1);
                        setProcessoSerieDeAtaque(EProcesso._ZERO);
                        break;
                }
            }
        }
    }, [jogoAtual, paginaCampanha, serieDeAtaqueAtual, processoSerieDeAtaque]);

    if (ContextosReprovados(true)) {
        return <></>;
    }
    if (![EPaginaCampanhaEstado.COMBATE, EPaginaCampanhaEstado.DESTINOS].includes(paginaCampanha.estado)) {
        return <></>;
    }
    return (
        <div className={styles.combate}>
            <div className={styles.combate_titulo}>
                <h3>Vença o Combate:</h3>
                <h4>{"Turno " + serieDeAtaqueAtual.toString()}</h4>
            </div>
            <div className={styles.combate_derrota}>{MontarRetorno_Derrota()}</div>
            {MontarRetorno_Inimigos()}
        </div>
    );

    function ContextosReprovados(processoIniciandoReprova: boolean) {
        let _reprovado =
            !jogoAtual ||
            !paginaCampanha ||
            !paginaCampanha.combate ||
            !paginaCampanha.combate.inimigos ||
            !paginaCampanha.combate.inimigos.length ||
            ![EPaginaCampanhaEstado.COMBATE, EPaginaCampanhaEstado.DESTINOS].includes(paginaCampanha.estado);
        if (processoIniciandoReprova) {
            _reprovado ||= ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaCampanha.processoCombate);
        } else {
            _reprovado ||= ![EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaCampanha.processoCombate);
        }
        return _reprovado;
    }

    function MontarRetorno_Derrota() {
        if (paginaCampanha.combate.textosDerrota) {
            paginaCampanha.combate.textosDerrota.map((textoI) => {
                return <p>{textoI}</p>;
            });
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Inimigos() {
        return (
            <div className={styles.combate_arena}>
                {paginaCampanha.combate.inimigos.map((inimigoI, indiceI) => {
                    return (
                        <div
                            key={indiceI}
                            className={styles.combate_arena}
                        >
                            <div>
                                {inimigoI.inimigo} - H: {inimigoI.habilidade} - E: {inimigoI.energia} -{inimigoI.auxPosturaInimigo}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
};

/*
    inimigos: IInimigoCombate[];
    textoDerrota: string;
    aprovacaoDerrota: string;
    auxProcessoCombate: EProcesso;
    auxIndiceTurno: number;
    auxIndiceInimigo: number;
    auxProcessoInimigo: EProcesso;


    auxProcessoCombate: EProcesso;
    auxIndiceTurno: number;
    auxIndiceInimigo: number;
    auxProcessoInimigo: EProcesso;
*/

export default TelaCombate;
