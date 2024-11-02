import styles from "./TelaCombate.module.scss";
import { IInimigoExecucao, EPosturaInimigo } from "../tipos";
import { ControleCombate } from "../controles";
import { Botao } from "../componentes";

export const TelaCombate = () => {
    const { combateExecutor, ContextosReprovados, AprovarTextosDerrota, AprovarBotaoRolarCombate, AoRolarCombate } = ControleCombate();

    if (ContextosReprovados(true)) {
        return <></>;
    }
    return (
        <div className={styles.combate}>
            <div className={styles.combate_titulo}>
                <h3>Vença o Combate:</h3>
                <h4>{"Série de ataque " + combateExecutor.serieDeAtaqueAtual.toString()}</h4>
            </div>
            <div className={styles.combate_derrota}>{MontarRetorno_Derrota()}</div>
            <div className={styles.combate_arena}>
                {combateExecutor.inimigos.map((inimigoI, indiceI) => {
                    return MontarRetorno_Inimigo(inimigoI, indiceI);
                })}
            </div>
        </div>
    );

    function MontarRetorno_Derrota() {
        if (AprovarTextosDerrota()) {
            combateExecutor.textosDerrota.map((textoI) => {
                return <p>{textoI}</p>;
            });
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Inimigo(inimigo: IInimigoExecucao, indiceI: number) {
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
                        <div>{MontarRetorno_BotaoRolarCombate()}</div>
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

    function MontarRetorno_BotaoRolarCombate() {
        if (AprovarBotaoRolarCombate()) {
            return <Botao aoClicar={AoRolarCombate}>{"COMBATER!!!"}</Botao>;
        } else {
            return <></>;
        }
    }
};

export default TelaCombate;
