import styles from "./TelaCombate.module.scss";
import { useState, useEffect, useRef } from "react";
import { ContextoJogos } from "../contextos";
import { EPaginaCampanhaEstado, AvaliarResultadoCombateDaPaginaCampanhaCombate, EResultadoCombate, IInimigoExecutor, EPosturaInimigo } from "../tipos";
import { EProcesso } from "../uteis";
import { ReactDiceRef } from "react-dice-complete";

interface ITelaCombateConclusao {
    processo: EProcesso;
    processoInimigo: EProcesso;
}

export const TelaCombate = () => {
    const { jogoAtual, paginaExecutor, ImporProcessoCombateNaPaginaCampanha, ImporPaginaCampanhaCombateDoProcessoZeroDaSerieDeAtaque } = ContextoJogos();

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
        if (paginaExecutor.exeProcessoCombate === EProcesso.INICIANDO) {
            setSerieDeAtaqueAtual(1);
            setProcessoSerieDeAtaque(EProcesso._ZERO);
            ImporProcessoCombateNaPaginaCampanha(EProcesso.PROCESSANDO);
            return;
        }
        if (paginaExecutor.exeProcessoCombate === EProcesso.PROCESSANDO) {
            if (processoSerieDeAtaque === EProcesso._ZERO) {
                ImporPaginaCampanhaCombateDoProcessoZeroDaSerieDeAtaque(serieDeAtaqueAtual);
                setProcessoSerieDeAtaque(EProcesso.INICIANDO);
            } else if (processoSerieDeAtaque === EProcesso.INICIANDO) {
                // aprovar
            } else if (processoSerieDeAtaque === EProcesso.PROCESSANDO) {
                // rolar dados
            } else if (processoSerieDeAtaque === EProcesso.DESTRUIDO) {
                switch (AvaliarResultadoCombateDaPaginaCampanhaCombate(paginaExecutor.combate, jogoAtual.panilha)) {
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
                ///// teste
                ImporProcessoCombateNaPaginaCampanha(EProcesso.CONCLUIDO);
            }
        }
    }, [jogoAtual, paginaExecutor, serieDeAtaqueAtual, processoSerieDeAtaque]);

    if (ContextosReprovados(true)) {
        return <></>;
    }
    if (![EPaginaCampanhaEstado.COMBATE, EPaginaCampanhaEstado.DESTINOS].includes(paginaExecutor.exeEstado)) {
        return <></>;
    }
    return (
        <div className={styles.combate}>
            <div className={styles.combate_titulo}>
                <h3>Vença o Combate:</h3>
                <h4>{"Turno " + serieDeAtaqueAtual.toString()}</h4>
            </div>
            <div className={styles.combate_derrota}>{MontarRetorno_Derrota()}</div>
            <div className={styles.combate_arena}>
                {paginaExecutor.combate.inimigos.map((inimigoI, indiceI) => {
                    return MontarRetorno_Inimigo(inimigoI, indiceI);
                })}
            </div>
        </div>
    );

    function ContextosReprovados(processoIniciandoReprova: boolean) {
        let _reprovado =
            !jogoAtual ||
            !paginaExecutor ||
            !paginaExecutor.combate ||
            !paginaExecutor.combate.inimigos ||
            !paginaExecutor.combate.inimigos.length ||
            ![EPaginaCampanhaEstado.COMBATE, EPaginaCampanhaEstado.DESTINOS].includes(paginaExecutor.exeEstado);
        if (processoIniciandoReprova) {
            _reprovado ||= ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaExecutor.exeProcessoCombate);
        } else {
            _reprovado ||= ![EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaExecutor.exeProcessoCombate);
        }
        return _reprovado;
    }

    function MontarRetorno_Derrota() {
        if (paginaExecutor.combate.textosDerrota) {
            paginaExecutor.combate.textosDerrota.map((textoI) => {
                return <p>{textoI}</p>;
            });
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Inimigo(inimigo: IInimigoExecutor, indiceI: number) {
        switch (inimigo.exePosturaInimigo) {
            case EPosturaInimigo.MORTO:
                return (
                    <div
                        key={indiceI}
                        className={styles.combate_arena}
                    >
                        <div>
                            {inimigo.inimigo} - H: {inimigo.habilidade} - E: {inimigo.energia} -{inimigo.exePosturaInimigo}
                        </div>
                    </div>
                );
            case EPosturaInimigo.APOIO:
                return (
                    <div
                        key={indiceI}
                        className={styles.combate_arena}
                    >
                        <div>
                            {inimigo.inimigo} - H: {inimigo.habilidade} - E: {inimigo.energia} -{inimigo.exePosturaInimigo}
                        </div>
                    </div>
                );
            case EPosturaInimigo.ATACANTE:
                return (
                    <div
                        key={indiceI}
                        className={styles.combate_arena}
                    >
                        <div>
                            {inimigo.inimigo} - H: {inimigo.habilidade} - E: {inimigo.energia} -{inimigo.exePosturaInimigo}
                        </div>
                    </div>
                );
            case EPosturaInimigo._AGUARDANDO:
            default:
                return (
                    <div
                        key={indiceI}
                        className={styles.combate_arena}
                    >
                        <div>
                            {inimigo.inimigo} - H: {inimigo.habilidade} - E: {inimigo.energia} -{inimigo.exePosturaInimigo}
                        </div>
                    </div>
                );
        }
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
