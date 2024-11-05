import styles from "./TelaCombate.module.scss";
import { IInimigoExecucao, EPosturaInimigo } from "../tipos";
import { ControleCombate } from "../controles";
import { BarraEnergia, Botao } from "../componentes";
import iconJogadorAtacando from "/Icon.Atacando.6_26.png";
import iconJogadorDefendendo from "/Icon.Defendendo.1_88.png";
import iconInimigoAguardando from "/Icon.Aguardando.1_28.png";
import iconInimigoAtacante from "/Icon.Garras.1_02.png";
import iconInimigoApoio from "/Icon.ArcoEFecha.4_60.png";
import iconInimigoMorto from "/Icon.Caixao.4_63.png";
import ReactDice from "react-dice-complete";
import { COR_HABILIDADE, COR_HABILIDADE_DOTS, TEMPO_DADOS_ROLANDO_SEGUNDOS } from "../globais/Constantes";
import { EProcesso } from "../uteis";

export const TelaCombate = () => {
    const {
        jogoAtual,
        combateExecutor,
        ContextosReprovados,
        AprovarTextosDerrota,
        AprovarBotaoRolarCombate,
        AprovarBotaoTestarSorte,
        AprovarBotaoConfirmar,
        AoRolarCombate,
        AoTestarSorte,
        AoConfirmar,
        AoConcluirRolarCombateJogador,
        AoConcluirRolarCombateInimigo,
        AoConcluirTestarSorte,
        ObterRolagemCombateViaInimigo,
    } = ControleCombate();

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
            <div className={styles.combate_arena}>{combateExecutor.inimigos.map((inimigoI, indiceI) => MontarRetorno_Arena(inimigoI, indiceI))}</div>
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

    function MontarRetorno_Arena(inimigo: IInimigoExecucao, indiceI: number) {
        let _estilo = "";
        switch (inimigo.exePosturaInimigo) {
            case EPosturaInimigo.MORTO:
                _estilo = styles.combate_morto;
                break;
            case EPosturaInimigo.APOIO:
                _estilo = styles.combate_apoio;
                break;
            case EPosturaInimigo.ATACANTE:
                _estilo = styles.combate_atacando;
                break;
            case EPosturaInimigo._AGUARDANDO:
            default:
                _estilo = styles.combate_aguardando;
                break;
        }
        return (
            <div
                key={indiceI}
                className={_estilo}
            >
                <div className={styles.combate_arena_versus}>
                    {MontarRetorno_Jogador(inimigo)}
                    {MontarRetorno_Inimigo(inimigo)}
                </div>
                {MontarRetorno_Comandos(inimigo)}
            </div>
        );
    }

    function MontarRetorno_Jogador(inimigo: IInimigoExecucao) {
        let _estilo = styles.combate_arena_versus_lado + " " + styles.combate_esquerda + " ";
        let _icone = "";
        let _alt = "";
        let _total = "= ? =";
        const _rolagem = ObterRolagemCombateViaInimigo(inimigo);
        if (_rolagem && [EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(_rolagem.exeProcessoRolagem)) {
            _total = "= " + _rolagem.exeRolagemTotalJogador + " =";
        }
        switch (inimigo.exePosturaInimigo) {
            case EPosturaInimigo.APOIO:
                _estilo += styles.combate_apoio;
                _icone = iconJogadorDefendendo;
                _alt = "Jogador Defendendo";
                break;
            case EPosturaInimigo.ATACANTE:
                _estilo += styles.combate_atacando;
                _icone = iconJogadorAtacando;
                _alt = "Jogador Atacando";
                break;
            case EPosturaInimigo.MORTO:
            case EPosturaInimigo._AGUARDANDO:
            default:
                return <div className={_estilo}></div>;
        }
        if (!combateExecutor.aliado) {
            return (
                <div className={_estilo}>
                    <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                        <h4>{jogoAtual.panilha.nome}</h4>
                        <span>{"Energia: " + jogoAtual.panilha.energia + " / " + jogoAtual.panilha.energiaInicial}</span>
                        {BarraEnergia(jogoAtual.panilha.energia, jogoAtual.panilha.energiaInicial)}
                    </div>
                    <div className={styles.combate_lados}>
                        <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                            <span>{"Habilidade: " + jogoAtual.panilha.habilidade}</span>
                            <ReactDice
                                numDice={2}
                                ref={_rolagem?.exeDadosJogadorRef}
                                rollDone={AoConcluirRolarCombateJogador(inimigo)}
                                faceColor={COR_HABILIDADE}
                                dotColor={COR_HABILIDADE_DOTS}
                                defaultRoll={1}
                                disableIndividual={true}
                                rollTime={TEMPO_DADOS_ROLANDO_SEGUNDOS}
                            />
                        </div>
                        <div className={styles.combate_direita + " " + styles.combate_infos}>
                            <h4>{_total}</h4>
                            <img
                                src={_icone}
                                alt={_alt}
                                height={64}
                                width={64}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
        }
    }

    function MontarRetorno_Inimigo(inimigo: IInimigoExecucao) {
        let _estilo = styles.combate_arena_versus_lado + " " + styles.combate_direita + " ";
        let _icone = "";
        let _alt = "";
        let _total = "= ? =";
        const _rolagem = ObterRolagemCombateViaInimigo(inimigo);
        if (_rolagem && [EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(_rolagem.exeProcessoRolagem)) {
            _total = "= " + _rolagem.exeRolagemTotalInimigo + " =";
        }
        switch (inimigo.exePosturaInimigo) {
            case EPosturaInimigo.MORTO:
                _estilo += styles.combate_morto;
                _icone = iconInimigoMorto;
                _alt = "Inimigo Morto";
                break;
            case EPosturaInimigo.APOIO:
                _estilo += styles.combate_apoio;
                _icone = iconInimigoApoio;
                _alt = "Inimigo Apoiando";
                break;
            case EPosturaInimigo.ATACANTE:
                _estilo += styles.combate_atacando;
                _icone = iconInimigoAtacante;
                _alt = "Inimigo Atacante";
                break;
            case EPosturaInimigo._AGUARDANDO:
            default:
                _estilo += styles.combate_aguardando;
                _icone = iconInimigoAguardando;
                _alt = "Inimigo Aguardando";
                break;
        }
        return (
            <div className={_estilo}>
                <div className={styles.combate_direita + " " + styles.combate_infos}>
                    <h4>{inimigo.inimigo}</h4>
                    <span>{"Energia: " + inimigo.exeEnergiaAtual + " / " + inimigo.energia}</span>
                    {BarraEnergia(inimigo.exeEnergiaAtual, inimigo.energia)}
                </div>
                <div className={styles.combate_lados}>
                    <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                        <h4>{_total}</h4>
                        <img
                            src={_icone}
                            alt={_alt}
                            height={64}
                            width={64}
                        />
                    </div>
                    <div className={styles.combate_direita + " " + styles.combate_infos}>
                        <span>{"Habilidade: " + inimigo.habilidade}</span>
                        <ReactDice
                            numDice={2}
                            ref={_rolagem?.exeDadosInimigoRef}
                            rollDone={AoConcluirRolarCombateInimigo(inimigo)}
                            faceColor={"#ff0000"}
                            dotColor={"#ffffff"}
                            defaultRoll={1}
                            disableIndividual={true}
                            rollTime={TEMPO_DADOS_ROLANDO_SEGUNDOS}
                        />
                    </div>
                </div>
            </div>
        );
    }

    function MontarRetorno_Comandos(inimigo: IInimigoExecucao) {
        if (!AprovarBotaoRolarCombate(inimigo) && !AprovarBotaoTestarSorte(inimigo) && !AprovarBotaoConfirmar(inimigo)) {
            return <></>;
        }
        return (
            <div className={styles.combate_arena_comandos}>
                {AprovarBotaoRolarCombate(inimigo) && <Botao aoClicar={AoRolarCombate(inimigo)}>{"COMBATER!!!"}</Botao>}
                {AprovarBotaoTestarSorte(inimigo) && <Botao aoClicar={AoTestarSorte(inimigo)}>{"Testar SORTE!"}</Botao>}
                {AprovarBotaoConfirmar(inimigo) && <Botao aoClicar={AoConfirmar(inimigo)}>{"Confirmar"}</Botao>}
            </div>
        );
    }
};

export default TelaCombate;
