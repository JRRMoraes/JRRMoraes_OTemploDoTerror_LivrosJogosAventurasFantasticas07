import styles from "./TelaHistorias.module.scss";
import { IEfeito, IHistoriaExecucao } from "../tipos";
import { Botao, TextosDatilografados } from "../componentes";
import { ControleHistorias } from "../controles";

export const TelaHistorias = () => {
    const { historiasExecutor, velocidade, ContextosReprovados, AprovarExeProcessoHistoria, AprovarBotaoPularHistoria, AprovarEfeitos, PularHistoria, FuncaoAoConcluirTexto } = ControleHistorias();

    if (ContextosReprovados(true)) {
        return <></>;
    }
    return (
        <div className={styles.historias}>
            {historiasExecutor.historias.map((historiaI, indiceI) => {
                if (AprovarExeProcessoHistoria(historiaI)) {
                    return (
                        <div key={indiceI}>
                            <div className={styles.historias_texto}>
                                <TextosDatilografados
                                    textos={historiaI.textosHistoria}
                                    velocidade={velocidade}
                                    aoConcluir={() => FuncaoAoConcluirTexto()}
                                />
                            </div>
                            {MontarRetorno_BotaoPularHistoria(historiaI)}
                            {MontarRetorno_Efeitos(historiaI)}
                        </div>
                    );
                } else {
                    return <div key={indiceI}></div>;
                }
            })}
        </div>
    );

    function MontarRetorno_BotaoPularHistoria(historia: IHistoriaExecucao) {
        if (AprovarBotaoPularHistoria(historia)) {
            return (
                <div className={styles.historias_pularHistoria}>
                    <Botao aoClicar={() => PularHistoria()}>Pular História</Botao>
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Efeitos(historia: IHistoriaExecucao) {
        if (AprovarEfeitos(historia)) {
            return (
                <div>
                    {historia.efeitos.map((efeitoI, indiceI) => {
                        return (
                            <p
                                key={indiceI}
                                className={MontarClassNameDoEfeito(efeitoI)}
                            >
                                {efeitoI.textoEfeito}
                            </p>
                        );
                    })}
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarClassNameDoEfeito(efeito: IEfeito) {
        if (efeito.quantidade >= 1) {
            return styles.historias_efeito_bom;
        } else {
            return styles.historias_efeito_ruim;
        }
    }
};

export default TelaHistorias;
