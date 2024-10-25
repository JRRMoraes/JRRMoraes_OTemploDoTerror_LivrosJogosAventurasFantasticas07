import styles from "./TelaDestinos.module.scss";
import "../componentes/Botao.module.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoJogos, OperacoesJogoLivro } from "../contextos";
import { Botao } from "../componentes";
import {
    EAtributoDestinoTeste,
    ECampanhaCapitulo,
    EJogoNivel,
    EPaginaCampanhaEstado,
    IDestino,
    IRolagemParaDestino,
    PAGINA_ZERADA,
    PAGINA_FIM_DE_JOGO,
    ROLAGEM_PARA_DESTINO_ZERADA,
    COR_SORTE,
    COR_SORTE_DOTS,
    COR_HABILIDADE,
    COR_HABILIDADE_DOTS,
} from "../tipos";
import { EProcesso } from "../uteis";
import ReactDice, { ReactDiceRef } from "react-dice-complete";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { TEMPO_ANIMACAO_GRANDE, TEMPO_DADOS_ROLANDO_SEGUNDOS, TEMPO_DADOS_ROLANDO_MILESIMOS } from "../globais/Constantes";

export const TelaDestinos = () => {
    const {
        jogoAtual,
        paginaExecutor,
        ImporProcessoDestinosNaPaginaCampanha,
        ImporPaginaCampanhaEJogoAtualViaDestino,
        SalvarJogoAtualNoSalvo,
        AplicarPenalidadeDeTestarSorte,
        ImporPaginaCampanhaViaDestino,
    } = ContextoJogos();

    const [desativaBotoes, setDesativaBotoes] = useState(false);

    const [salvando, setSalvando] = useState(EProcesso._ZERO);

    const { ValidarAprovacoesDestino } = OperacoesJogoLivro(jogoAtual, paginaExecutor);

    const navegador = useNavigate();

    const dados = useRef<ReactDiceRef>(null);

    const [rolagemDados, setRolagemDados] = useState<IRolagemParaDestino>(ROLAGEM_PARA_DESTINO_ZERADA);

    useEffect(() => {
        if (ContextosReprovados(false)) {
            return;
        }
        if (paginaExecutor.exeProcessoDestinos === EProcesso.INICIANDO) {
            ImporProcessoDestinosNaPaginaCampanha(EProcesso.PROCESSANDO);
            return;
        }
        if (paginaExecutor.exeIdPaginaDestino === PAGINA_ZERADA.idPagina && paginaExecutor.exeIdCapituloDestino === PAGINA_ZERADA.idCapitulo) {
            return;
        }
        ImporPaginaCampanhaEJogoAtualViaDestino(paginaExecutor.exeIdPaginaDestino, paginaExecutor.exeIdCapituloDestino);
    }, [paginaExecutor]);

    useEffect(() => {
        if (salvando === EProcesso.INICIANDO && !paginaExecutor.exeEhJogoCarregado) {
            setSalvando(EProcesso.PROCESSANDO);
            SalvarJogoAtualNoSalvo();
            setTimeout(() => {
                setSalvando(EProcesso.CONCLUIDO);
                setDesativaBotoes(false);
            }, 2000);
        }
    }, [salvando]);

    useEffect(() => {
        if (rolagemDados.processoRolagem === EProcesso.INICIANDO) {
            dados.current?.rollAll();
            setRolagemDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.PROCESSANDO };
            });
        } else if (rolagemDados.processoRolagem === EProcesso.PROCESSANDO) {
            setTimeout(() => {
                setRolagemDados((prevRolandoDados) => {
                    return { ...prevRolandoDados, processoRolagem: EProcesso.CONCLUIDO };
                });
            }, TEMPO_DADOS_ROLANDO_MILESIMOS);
        } else if (rolagemDados.processoRolagem === EProcesso.CONCLUIDO) {
            let _rolado = rolagemDados.total;
            if (rolagemDados.destino.testeSomarDados) {
                _rolado += rolagemDados.destino.testeSomarDados;
            }
            let _teveSorte = false;
            if (rolagemDados.destino.testeAtributo === EAtributoDestinoTeste.HABILIDADE) {
                _teveSorte = _rolado <= jogoAtual.panilha.habilidade;
            } else if (rolagemDados.destino.testeAtributo === EAtributoDestinoTeste.SORTE) {
                _teveSorte = _rolado <= jogoAtual.panilha.sorte;
                AplicarPenalidadeDeTestarSorte();
            }
            let _idPagina = _teveSorte ? rolagemDados.destino.idPagina : rolagemDados.destino.idPaginaAzar;
            setTimeout(() => {
                ImporPaginaCampanhaViaDestino(_idPagina, rolagemDados.destino.idCapitulo);
            }, TEMPO_ANIMACAO_GRANDE);
            setRolagemDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.DESTRUIDO };
            });
        }
    }, [rolagemDados]);

    if (ContextosReprovados(true)) {
        return <></>;
    }
    if (EhFimDeJogo()) {
        return (
            <div className={styles.destinos}>
                <div className={styles.destinos_morte}>
                    <div className={styles.destinos_tituloESalvar}>
                        <h3>VOCÊ MORREU - FIM DE JOGO</h3>
                    </div>
                    <div className={styles.destinos_conteudo}>
                        <div className={styles.destinos_conteudo_pagina}>
                            <Botao aoClicar={() => AoReiniciar()}>Voltar a página inicial</Botao>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.destinos}>
                <div className={styles.destinos_normal}>
                    <div className={styles.destinos_tituloESalvar}>
                        <h3>Escolha o seu Destino:</h3>
                        {MontarRetorno_SalvaJogoAtual()}
                    </div>
                    {MontarRetorno_Destinos()}
                </div>
            </div>
        );
    }

    function ContextosReprovados(processoIniciandoReprova: boolean) {
        let _reprovado = !jogoAtual || !paginaExecutor || !paginaExecutor.destinos || !paginaExecutor.destinos.length || ![EPaginaCampanhaEstado.DESTINOS].includes(paginaExecutor.exeEstado);
        if (processoIniciandoReprova) {
            _reprovado ||= ![EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaExecutor.exeProcessoDestinos);
        } else {
            _reprovado ||= ![EProcesso.INICIANDO, EProcesso.PROCESSANDO, EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(paginaExecutor.exeProcessoDestinos);
        }
        return _reprovado;
    }

    function EhFimDeJogo() {
        const _fimDeJogo = jogoAtual.campanhaCapitulo === ECampanhaCapitulo.PAGINAS_CAMPANHA;
        const _estaMorto = !!(jogoAtual.panilha && jogoAtual.panilha.energia === 0);
        const _destinoMorte = !!paginaExecutor.destinos.find((destinoI) => destinoI.idPagina === PAGINA_FIM_DE_JOGO.idPagina);
        return _fimDeJogo && (_estaMorto || _destinoMorte);
    }

    function MontarRetorno_SalvaJogoAtual() {
        if (paginaExecutor.exeEhJogoCarregado) {
            return <></>;
        }
        switch (salvando) {
            case EProcesso._ZERO:
                if (jogoAtual.panilha && jogoAtual.panilha.nivel === EJogoNivel._NORMAL) {
                    AoSalvarJogoAtual();
                    return <></>;
                } else {
                    return (
                        <div className={styles.destinos_tituloESalvar_salvar}>
                            <Botao
                                aoClicar={() => AoSalvarJogoAtual()}
                                desativado={desativaBotoes}
                            >
                                <div className={styles.destinos_tituloESalvar_salvar_2}>
                                    <SaveOutlinedIcon />
                                    <p>SALVAR JOGO ?</p>
                                </div>
                            </Botao>
                        </div>
                    );
                }
            case (EProcesso.INICIANDO, EProcesso.PROCESSANDO):
                return (
                    <div className={styles.destinos_tituloESalvar_salvar}>
                        <SaveOutlinedIcon />
                        <p>... SALVANDO O JOGO ...</p>
                    </div>
                );
            case EProcesso.CONCLUIDO:
                return (
                    <div className={styles.destinos_tituloESalvar_salvar}>
                        <SaveOutlinedIcon />
                        <p>JOGO SALVO !</p>
                    </div>
                );
            default:
                return <></>;
        }
    }

    function AoReiniciar() {
        setDesativaBotoes(true);
        navegador("/");
    }

    function AoSalvarJogoAtual() {
        setDesativaBotoes(true);
        setSalvando(EProcesso.INICIANDO);
    }

    function AoObterDesativaBotao(destino: IDestino) {
        if (!desativaBotoes) {
            return !ValidarAprovacoesDestino(destino.aprovacoes);
        } else {
            return true;
        }
    }

    function AoClicarBotaoDestino(destino: IDestino) {
        const _aoClicar = () => {
            setDesativaBotoes(true);
            if (!destino.testeAtributo || destino.testeAtributo === EAtributoDestinoTeste._NULO) {
                ImporPaginaCampanhaViaDestino(destino.idPagina, destino.idCapitulo);
            } else {
                setRolagemDados({ processoRolagem: EProcesso.INICIANDO, total: 0, destino: destino });
            }
        };
        return _aoClicar;
    }

    function MontarRetorno_Destinos() {
        return (
            <div className={styles.destinos_conteudo}>
                {paginaExecutor.destinos.map((destinoI, indiceI) => {
                    return (
                        <div
                            key={indiceI}
                            className={styles.destinos_conteudo_pagina}
                        >
                            <Botao
                                aoClicar={AoClicarBotaoDestino(destinoI)}
                                desativado={AoObterDesativaBotao(destinoI)}
                            >
                                <>
                                    {MontarRetorno_TextoDestino(destinoI)}
                                    {MontarRetorno_TesteSorteHabilidade(destinoI)}
                                </>
                            </Botao>
                        </div>
                    );
                })}
            </div>
        );
    }

    function MontarRetorno_TextoDestino(destino: IDestino) {
        if (destino.textoDestino) {
            return <p>{destino.textoDestino}</p>;
        } else if (destino.textosDestino && destino.textosDestino.length) {
            return (
                <div>
                    {destino.textosDestino.map((textoI, indiceI) => {
                        return <p key={indiceI}>{textoI}</p>;
                    })}
                </div>
            );
        } else {
            return <p>???</p>;
        }
    }

    function MontarRetorno_TesteSorteHabilidade(destino: IDestino) {
        if (!destino.testeAtributo || destino.testeAtributo === EAtributoDestinoTeste._NULO) {
            return <></>;
        } else {
            let _totalTexto = "?";
            let _totalValor = 0;
            let _soma = "";
            let _atributoTexto = "";
            let _atributoValor = 0;
            let _cor = "";
            let _corDot = "";
            let _teveSorte = false;
            let _resultadoTexto = "";
            if (destino.testeSomarDados) {
                _totalValor += destino.testeSomarDados;
                _soma = destino.testeSomarDados.toString() + " + ";
            }
            if (destino.testeAtributo === EAtributoDestinoTeste.SORTE) {
                _atributoTexto = "SORTE";
                _atributoValor = jogoAtual.panilha.sorte;
                _cor = COR_SORTE;
                _corDot = COR_SORTE_DOTS;
            } else if (destino.testeAtributo === EAtributoDestinoTeste.HABILIDADE) {
                _atributoTexto = "HABILIDADE";
                _atributoValor = jogoAtual.panilha.habilidade;
                _cor = COR_HABILIDADE;
                _corDot = COR_HABILIDADE_DOTS;
            }
            if ([EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(rolagemDados.processoRolagem)) {
                _totalValor += rolagemDados.total;
                _totalTexto = _totalValor.toString();
                _teveSorte = _totalValor <= _atributoValor;
                _resultadoTexto = _teveSorte ? "Você TEVE " : "Você NÃO TEVE ";
                _resultadoTexto += _resultadoTexto + _atributoTexto;
            }
            return (
                <div className={styles.destinos_conteudo_pagina_rolagem}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_dados}>
                                    <span>{_soma}</span>
                                    <ReactDice
                                        numDice={2}
                                        ref={dados}
                                        rollDone={AoConcluirRolagem}
                                        faceColor={_cor}
                                        dotColor={_corDot}
                                        defaultRoll={1}
                                        disableIndividual={true}
                                        rollTime={TEMPO_DADOS_ROLANDO_SEGUNDOS}
                                    />
                                </td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_texto}>
                                    <span>{"Você terá " + _atributoTexto}</span>
                                    <br />
                                    <span>{"se os dados resultarem em"}</span>
                                    <br />
                                    <span>
                                        {"MENOR OU IGUAL a "}
                                        <span className={styles.destinos_conteudo_pagina_rolagem_atributo}>{_atributoValor.toString()}</span>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_dados}>{" = " + _totalTexto}</td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_coluna_texto}>{_resultadoTexto}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    function AoConcluirRolagem(totalValue: number, values: number[]) {
        setRolagemDados((prevRolandoDados) => {
            return { ...prevRolandoDados, total: totalValue };
        });
    }
};

export default TelaDestinos;
