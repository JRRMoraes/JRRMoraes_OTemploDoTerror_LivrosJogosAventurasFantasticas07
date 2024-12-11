import styles from "./TelaCombate.module.scss";
import { IInimigoExecucao, EPosturaInimigo, EResultadoDados, EResultadoCombate } from "../tipos";
import { ControleCombate } from "../controles";
import { BarraEnergia, BarraEnergiaInimigo, Botao, NumeroAlteravel } from "../componentes";
import ReactDice from "react-dice-complete";
import { COR_HABILIDADE, COR_HABILIDADE_DOTS, COR_SORTE, COR_SORTE_DOTS, TEMPO_DADOS_ROLANDO_SEGUNDOS } from "../globais/Constantes";
import { EProcesso } from "../uteis";
import iconJogadorAtacando from "/imagens/Icon.Atacando.6_26.png";
import iconJogadorDefendendo from "/imagens/Icon.Defendendo.1_88.png";
import iconInimigoAguardando from "/imagens/Icon.Aguardando.1_28.png";
import iconInimigoAtacante from "/imagens/Icon.Garras.1_02.png";
import iconInimigoApoio from "/imagens/Icon.ArcoEFecha.4_60.png";
import iconInimigoMorto from "/imagens/Icon.Caixao.4_63.png";

export const TelaCombate = () => {
    const {
        jogoAtual,
        combateInimigos,
        combateInimigos_PosturaInimigo,
        combateInimigos_ProcessoRolagemAtaque,
        combateAliado,
        combateTextosDerrota,
        combateSerieDeAtaqueAtual,
        combateDadosJogadorRef,
        combateDadosInimigoRef,
        combateDadosSorteRef,
        combateResultadoFinalDerrota,
        combateResultadoFinalInimigos,
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
        ObterJogadorOuAliado,
        ObterElementoEfeitoEnergiaDoJogadorAliado,
        ObterElementoEfeitoEnergiaDoInimigo,
        MontarElementoCombateAprovacaoDerrota,
        ExibirSerieDeAtaqueVencidoConsecutivo,
    } = ControleCombate();

    if (ContextosReprovados()) {
        return <></>;
    }
    return (
        <div className={styles.combate}>
            <div className={styles.combate_titulo}>
                <h3>Vença o Combate:</h3>
                <h4>{"Série de ataque " + combateSerieDeAtaqueAtual.toString()}</h4>
            </div>
            {MontarRetorno_Derrota()}
            {MontarRetorno_Arena()}
        </div>
    );

    function MontarRetorno_Derrota() {
        if (AprovarTextosDerrota()) {
            let _resultado = <></>;
            if ([EResultadoCombate.VITORIA, EResultadoCombate.DERROTA].includes(combateResultadoFinalDerrota)) {
                _resultado = <h2>{combateResultadoFinalDerrota.toString()}</h2>;
            }
            return (
                <div className={styles.combate_derrota}>
                    <div className={styles.combate_derrota_2}>
                        <div>
                            {combateTextosDerrota.map((textoI, indiceI) => (
                                <p key={indiceI}>{textoI}</p>
                            ))}
                        </div>
                        {MontarElementoCombateAprovacaoDerrota()}
                    </div>
                    {_resultado}
                </div>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Arena() {
        let _resultado = <></>;
        if ([EResultadoCombate.VITORIA, EResultadoCombate.DERROTA].includes(combateResultadoFinalInimigos)) {
            _resultado = <h2>{combateResultadoFinalInimigos.toString()}</h2>;
        }
        return (
            <div className={styles.combate_arena}>
                {combateInimigos.map((inimigoI, indiceI) => MontarRetorno_ArenaPorInimigo(inimigoI, indiceI))}
                {_resultado}
            </div>
        );
    }

    function MontarRetorno_ArenaPorInimigo(inimigo: IInimigoExecucao, indice: number) {
        let _estilo = "";
        switch (combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) {
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
                key={indice}
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
        let _total = "?";
        if ([EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(combateInimigos_ProcessoRolagemAtaque[inimigo.exeIdInimigo])) {
            _total = inimigo.exeRolagemTotalJogador.toString();
        }
        switch (combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) {
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
        let _tamanho = 64;
        if (inimigo.exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
            _tamanho = 80;
        } else if (inimigo.exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
            _tamanho = 48;
        }
        return (
            <div className={_estilo}>
                <div className={styles.combate_arena_versus_lado_2}>
                    <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                        <h4>{ObterJogadorOuAliado().aliado}</h4>
                        <div className={styles.combate_linhaUnica}>
                            <span>{"Energia:"}</span>
                            {ObterElementoEfeitoEnergiaDoJogadorAliado()}
                            <NumeroAlteravel numeroAtual={ObterJogadorOuAliado().exeEnergiaAtual} />
                            <span>{"/"}</span>
                            <span>{ObterJogadorOuAliado().energia}</span>
                        </div>
                        {BarraEnergia(ObterJogadorOuAliado().exeEnergiaAtual, ObterJogadorOuAliado().energia)}
                    </div>
                    <div className={styles.combate_lados}>
                        <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                            <div className={styles.combate_linhaUnica}>
                                <span>{"Habilidade:"}</span>
                                <span className={styles.combate_arena_numeroAtual}>{ObterJogadorOuAliado().habilidade}</span>
                            </div>
                            <ReactDice
                                numDice={2}
                                ref={combateDadosJogadorRef[inimigo.exeIdInimigo]}
                                rollDone={AoConcluirRolarCombateJogador(inimigo)}
                                faceColor={COR_HABILIDADE}
                                dotColor={COR_HABILIDADE_DOTS}
                                defaultRoll={1}
                                disableIndividual={true}
                                rollTime={TEMPO_DADOS_ROLANDO_SEGUNDOS}
                            />
                        </div>
                        <div className={styles.combate_direita + " " + styles.combate_infos}>
                            <h4 className={styles.combate_linhaUnica}>
                                <span>{"="}</span>
                                <span>{_total}</span>
                                <span>{"="}</span>
                            </h4>
                            <img
                                src={_icone}
                                alt={_alt}
                                height={_tamanho}
                                width={_tamanho}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function MontarRetorno_Inimigo(inimigo: IInimigoExecucao) {
        let _estilo = styles.combate_arena_versus_lado + " " + styles.combate_direita + " ";
        let _icone = "";
        let _alt = "";
        let _total = "?";
        let _serieDeAtaqueVencidoConsecutivo = <></>;
        if ([EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(combateInimigos_ProcessoRolagemAtaque[inimigo.exeIdInimigo])) {
            _total = inimigo.exeRolagemTotalInimigo.toString();
        }
        if (ExibirSerieDeAtaqueVencidoConsecutivo(inimigo)) {
            _serieDeAtaqueVencidoConsecutivo = <span>{"Série de ataques consecutivos vencidos: " + inimigo.exeSerieDeAtaqueVencidoConsecutivo}</span>;
        }
        switch (combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) {
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
        switch (combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) {
            case EPosturaInimigo.APOIO:
            case EPosturaInimigo.ATACANTE:
                let _tamanho = 64;
                if (inimigo.exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                    _tamanho = 80;
                } else if (inimigo.exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                    _tamanho = 48;
                }
                return (
                    <div className={_estilo}>
                        <div className={styles.combate_arena_versus_lado_2}>
                            <div className={styles.combate_direita + " " + styles.combate_infos}>
                                <h4>{inimigo.inimigo}</h4>
                                <div className={styles.combate_linhaUnica}>
                                    <span>{"Energia:"}</span>
                                    {ObterElementoEfeitoEnergiaDoInimigo(inimigo)}
                                    <NumeroAlteravel numeroAtual={inimigo.exeEnergiaAtual} />
                                    <span>{"/"}</span>
                                    <span>{inimigo.energia}</span>
                                </div>
                                {BarraEnergiaInimigo(inimigo.exeEnergiaAtual, inimigo.energia)}
                                {_serieDeAtaqueVencidoConsecutivo}
                            </div>
                            <div className={styles.combate_lados}>
                                <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                                    <h4 className={styles.combate_linhaUnica}>
                                        <span>{"="}</span>
                                        <span>{_total}</span>
                                        <span>{"="}</span>
                                    </h4>
                                    <img
                                        src={_icone}
                                        alt={_alt}
                                        height={_tamanho}
                                        width={_tamanho}
                                    />
                                </div>
                                <div className={styles.combate_direita + " " + styles.combate_infos}>
                                    <div className={styles.combate_linhaUnica}>
                                        <span>{"Habilidade:"}</span>
                                        <span className={styles.combate_arena_numeroAtual}>{inimigo.habilidade}</span>
                                    </div>
                                    <ReactDice
                                        numDice={2}
                                        ref={combateDadosInimigoRef[inimigo.exeIdInimigo]}
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
                    </div>
                );
                break;
            case EPosturaInimigo.MORTO:
            case EPosturaInimigo._AGUARDANDO:
            default:
                return (
                    <div className={_estilo}>
                        <div className={styles.combate_arena_versus_lado_2}>
                            <div className={styles.combate_lados}>
                                <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                                    <img
                                        src={_icone}
                                        alt={_alt}
                                        height={48}
                                        width={48}
                                    />
                                </div>
                                <div className={styles.combate_direita + " " + styles.combate_infos}>
                                    <h4>{inimigo.inimigo}</h4>
                                    <div className={styles.combate_linhaUnica}>
                                        <span>{"Energia:"}</span>
                                        <NumeroAlteravel numeroAtual={inimigo.exeEnergiaAtual} />
                                        <span>{"/"}</span>
                                        <span>{inimigo.energia}</span>
                                    </div>
                                    {BarraEnergia(inimigo.exeEnergiaAtual, inimigo.energia)}
                                    <div className={styles.combate_linhaUnica}>
                                        <span>{"Habilidade:"}</span>
                                        <span className={styles.combate_arena_numeroAtual}>{inimigo.habilidade}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                break;
        }
    }

    function MontarRetorno_BotaoRolarCombate(inimigo: IInimigoExecucao) {
        if (AprovarBotaoRolarCombate(inimigo)) {
            let _estiloJogador = styles.combate_arena_versus_lado + " " + styles.combate_esquerda + " ";
            let _iconeJogador = "";
            let _altJogador = "";
            let _totalJogador = "?";
            let _estiloInimigo = styles.combate_arena_versus_lado + " " + styles.combate_direita + " ";
            let _iconeInimigo = "";
            let _altInimigo = "";
            let _totalInimigo = "?";
            if ([EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(combateInimigos_ProcessoRolagemAtaque[inimigo.exeIdInimigo])) {
                _totalJogador = inimigo.exeRolagemTotalJogador.toString();
                _totalInimigo = inimigo.exeRolagemTotalInimigo.toString();
            }
            switch (combateInimigos_PosturaInimigo[inimigo.exeIdInimigo]) {
                case EPosturaInimigo.APOIO:
                    _estiloJogador += styles.combate_apoio;
                    _iconeJogador = iconJogadorDefendendo;
                    _altJogador = "Jogador Defendendo";
                    _estiloInimigo += styles.combate_apoio;
                    _iconeInimigo = iconInimigoApoio;
                    _altInimigo = "Inimigo Apoiando";
                    break;
                case EPosturaInimigo.ATACANTE:
                    _estiloJogador += styles.combate_atacando;
                    _iconeJogador = iconJogadorAtacando;
                    _altJogador = "Jogador Atacando";
                    _estiloInimigo += styles.combate_atacando;
                    _iconeInimigo = iconInimigoAtacante;
                    _altInimigo = "Inimigo Atacante";
                    break;
            }
            let _tamanhoJogador = 64;
            let _tamanhoInimigo = 64;
            if (inimigo.exeRolagemResultadoAtaque === EResultadoDados.VITORIA) {
                _tamanhoJogador = 80;
                _tamanhoInimigo = 48;
            } else if (inimigo.exeRolagemResultadoAtaque === EResultadoDados.DERROTA) {
                _tamanhoJogador = 48;
                _tamanhoInimigo = 80;
            }

            return (
                <Botao aoClicar={AoRolarCombate(inimigo)}>
                    <div className={styles.combate_lados}>
                        <div className={styles.combate_esquerda}>
                            <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                                <div className={styles.combate_linhaUnica}>
                                    <span>{"Habilidade:"}</span>
                                    <span className={styles.combate_arena_numeroAtual}>{ObterJogadorOuAliado().habilidade}</span>
                                </div>
                                <div>
                                    <span>{"+"}</span>
                                    <ReactDice
                                        numDice={2}
                                        ref={combateDadosJogadorRef[inimigo.exeIdInimigo]}
                                        rollDone={AoConcluirRolarCombateJogador(inimigo)}
                                        faceColor={COR_HABILIDADE}
                                        dotColor={COR_HABILIDADE_DOTS}
                                        defaultRoll={1}
                                        disableIndividual={true}
                                        rollTime={TEMPO_DADOS_ROLANDO_SEGUNDOS}
                                    />
                                </div>
                            </div>
                            <div className={styles.combate_direita + " " + styles.combate_infos}>
                                <h4 className={styles.combate_linhaUnica}>
                                    <span>{"="}</span>
                                    <span>{_totalJogador}</span>
                                    <span>{"="}</span>
                                </h4>
                                <img
                                    src={_iconeJogador}
                                    alt={_altJogador}
                                    height={_tamanhoJogador}
                                    width={_tamanhoJogador}
                                />
                            </div>
                        </div>
                        <div className={styles.combate_direita}>
                            <div className={styles.combate_esquerda + " " + styles.combate_infos}>
                                <h4 className={styles.combate_linhaUnica}>
                                    <span>{"="}</span>
                                    <span>{_totalInimigo}</span>
                                    <span>{"="}</span>
                                </h4>
                                <img
                                    src={_iconeInimigo}
                                    alt={_altInimigo}
                                    height={_tamanhoInimigo}
                                    width={_tamanhoInimigo}
                                />
                            </div>
                            <div className={styles.combate_direita + " " + styles.combate_infos}>
                                <div className={styles.combate_linhaUnica}>
                                    <span>{"Habilidade:"}</span>
                                    <span className={styles.combate_arena_numeroAtual}>{inimigo.habilidade}</span>
                                </div>
                                <div>
                                    <span>{"+"}</span>
                                    <ReactDice
                                        numDice={2}
                                        ref={combateDadosInimigoRef[inimigo.exeIdInimigo]}
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
                    </div>
                </Botao>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_BotaoTestarSorte(inimigo: IInimigoExecucao) {
        if (AprovarBotaoTestarSorte(inimigo)) {
            return (
                <Botao aoClicar={AoTestarSorte(inimigo)}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_dados}>
                                    <ReactDice
                                        numDice={2}
                                        ref={combateDadosSorteRef[inimigo.exeIdInimigo]}
                                        rollDone={AoConcluirTestarSorte(inimigo)}
                                        faceColor={COR_SORTE}
                                        dotColor={COR_SORTE_DOTS}
                                        defaultRoll={1}
                                        disableIndividual={true}
                                        rollTime={TEMPO_DADOS_ROLANDO_SEGUNDOS}
                                    />
                                </td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_texto}>
                                    <span>{"Você terá SORTE"}</span>
                                    <br />
                                    <span>{"se os dados resultarem em"}</span>
                                    <br />
                                    <span>
                                        {"MENOR OU IGUAL a "}
                                        <span className={styles.destinos_conteudo_pagina_rolagem_atributo}>{jogoAtual.panilha.sorte.toString()}</span>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_dados}>
                                    <span className={styles.destinos_conteudo_pagina_rolagem_total}>{" = " + inimigo.exeRolagemTotalSorte}</span>
                                </td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_texto}>
                                    <span className={styles.destinos_conteudo_pagina_rolagem_total}>{inimigo.exeRolagemResultadoSorte.toString()}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Botao>
            );
        } else {
            return <></>;
        }
    }

    function MontarRetorno_BotaoConfirmar(inimigo: IInimigoExecucao) {
        if (AprovarBotaoConfirmar(inimigo)) {
            return <Botao aoClicar={AoConfirmar(inimigo)}>{"Confirmar"}</Botao>;
        } else {
            return <></>;
        }
    }

    function MontarRetorno_Comandos(inimigo: IInimigoExecucao) {
        if (AprovarBotaoRolarCombate(inimigo) || AprovarBotaoTestarSorte(inimigo) || AprovarBotaoConfirmar(inimigo)) {
            return (
                <div className={styles.combate_arena_comandos}>
                    {MontarRetorno_BotaoRolarCombate(inimigo)}
                    {MontarRetorno_BotaoTestarSorte(inimigo)}
                    {MontarRetorno_BotaoConfirmar(inimigo)}
                </div>
            );
        } else {
            return <></>;
        }
    }
};

export default TelaCombate;
