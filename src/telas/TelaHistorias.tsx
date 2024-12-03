import styles from "./TelaHistorias.module.scss";
import { IEfeito, IHistoriaTextoExecucao } from "../tipos";
import { Botao, TextosDatilografados } from "../componentes";
import { ControleHistorias } from "../controles";

export const TelaHistorias = () => {
    const {
        historiaTextos,
        historiaEfeitos,
        velocidade,
        ContextosReprovados,
        AprovarExeProcessoHistoria,
        AprovarBotaoPularHistoria,
        AprovarEfeitos,
        PularHistoria,
        FuncaoAoConcluirTexto,
        ObterImagemDaHistoria,
    } = ControleHistorias();

    if (ContextosReprovados()) {
        return <></>;
    }
    return (
        <div className={styles.historias}>
            {historiaTextos.map((historiaTextoI, indiceI) => {
                if (AprovarExeProcessoHistoria(historiaTextoI)) {
                    return (
                        <div key={indiceI}>
                            <div className={styles.historias_texto}>
                                <TextosDatilografados
                                    textos={historiaTextoI.textosHistoria}
                                    velocidade={velocidade}
                                    aoConcluir={() => FuncaoAoConcluirTexto()}
                                />
                            </div>
                            {MontarRetorno_BotaoPularHistoria(historiaTextoI)}
                            {MontarRetorno_Efeitos(historiaTextoI, indiceI)}
                            {MontarRetorno_Imagem(indiceI)}
                        </div>
                    );
                } else {
                    return <div key={indiceI}></div>;
                }
            })}
        </div>
    );

    function MontarRetorno_BotaoPularHistoria(historia: IHistoriaTextoExecucao) {
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

    function MontarRetorno_Efeitos(historiaTexto: IHistoriaTextoExecucao, indice: number) {
        if (AprovarEfeitos(historiaTexto, indice)) {
            return (
                <div>
                    {historiaEfeitos[indice].efeitos.map((efeitoI, indiceI) => {
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

    function MontarRetorno_Imagem(indice: number) {
        const _historiaImagemExecucao = ObterImagemDaHistoria(indice);
        if (_historiaImagemExecucao) {
            return (
                <img
                    src={_historiaImagemExecucao.arquivo}
                    alt={_historiaImagemExecucao.imagem}
                />
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
