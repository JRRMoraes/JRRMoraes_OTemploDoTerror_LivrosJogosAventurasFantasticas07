import styles from "./TelaDestinos.module.scss";
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
    IRolagensParaDestino,
    PAGINA_ZERADA,
    ROLAGEM_PARA_DESTINO_ZERADA,
    COR_SORTE,
    COR_SORTE_DOTS,
    COR_HABILIDADE,
    COR_HABILIDADE_DOTS,
} from "../tipos";
import { EProcesso } from "../uteis";
import ReactDice, { ReactDiceRef } from "react-dice-complete";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { TEMPO_ANIMACAO } from "../globais/Constantes";

export const TelaDestinos = () => {
    const { jogoAtual, paginaCampanha, setPaginaCampanha, ImporPaginaCampanhaEJogoAtualViaDestino, SalvarJogoAtualNoSalvo, AplicarPenalidadeDeTestarSorte } = ContextoJogos();

    const [desativaBotoes, setDesativaBotoes] = useState(false);

    const [salvando, setSalvando] = useState(EProcesso._ZERO);

    const { ValidarAprovacoesDestino } = OperacoesJogoLivro(jogoAtual, paginaCampanha);

    const navegador = useNavigate();

    const reactDados = useRef<ReactDiceRef>(null);

    const [rolandoDados, setRolandoDados] = useState<IRolagensParaDestino>(ROLAGEM_PARA_DESTINO_ZERADA);

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
                setDesativaBotoes(false);
            }, 2000);
        }
    }, [salvando]);

    useEffect(() => {
        if (rolandoDados.processoRolagem === EProcesso.INICIANDO) {
            reactDados.current?.rollAll();
            setRolandoDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.PROCESSANDO };
            });
        } else if (rolandoDados.processoRolagem === EProcesso.PROCESSANDO && rolandoDados.quantidade >= 1) {
            setRolandoDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.CONCLUIDO };
            });
        } else if (rolandoDados.processoRolagem === EProcesso.CONCLUIDO) {
            let _rolado = rolandoDados.total;
            if (rolandoDados.destino.testeSomarDados) {
                _rolado += rolandoDados.destino.testeSomarDados;
            }
            let _teveSorte = false;
            if (rolandoDados.destino.testeAtributo === EAtributoDestinoTeste.HABILIDADE) {
                _teveSorte = _rolado <= jogoAtual.panilha.habilidade;
            } else if (rolandoDados.destino.testeAtributo === EAtributoDestinoTeste.SORTE) {
                _teveSorte = _rolado <= jogoAtual.panilha.sorte;
                AplicarPenalidadeDeTestarSorte();
            }
            let _idPagina = _teveSorte ? rolandoDados.destino.idPagina : rolandoDados.destino.idPaginaAzar;
            setTimeout(() => {
                setPaginaCampanha((prevPaginaCampanha_Destino) => {
                    return {
                        ...prevPaginaCampanha_Destino,
                        idPaginaDestino: _idPagina,
                        idCapituloDestino: rolandoDados.destino.idCapitulo,
                        ehJogoCarregado: false,
                    };
                });
            }, TEMPO_ANIMACAO * 4);
            setRolandoDados((prevRolandoDados) => {
                return { ...prevRolandoDados, processoRolagem: EProcesso.DESTRUIDO };
            });
        }
    }, [rolandoDados]);

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
                <div className={styles.destinos_morte}>
                    <div className={styles.destinos_tituloESalvar}>
                        <h3>VOCÊ MORREU - FIM DE JOGO</h3>
                        {MontarRetorno_SalvaJogoAtual()}
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
                setPaginaCampanha((prevPaginaCampanha_Destino) => {
                    return {
                        ...prevPaginaCampanha_Destino,
                        idPaginaDestino: destino.idPagina,
                        idCapituloDestino: destino.idCapitulo,
                        ehJogoCarregado: false,
                    };
                });
            } else {
                setRolandoDados({ processoRolagem: EProcesso.INICIANDO, quantidade: 0, total: 0, destino: destino });
            }
        };
        return _aoClicar;
    }

    function MontarRetorno_Destinos() {
        return (
            <div className={styles.destinos_conteudo}>
                {paginaCampanha.destinos.map((destinoI, indiceI) => {
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
                    {destino.textosDestino.map((textoI) => {
                        return <p>{textoI}</p>;
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
            let _soma = "";
            if (destino.testeSomarDados) {
                _soma = destino.testeSomarDados.toString + " + ";
            }
            let _total = "?";
            if ([EProcesso.CONCLUIDO, EProcesso.DESTRUIDO].includes(rolandoDados.processoRolagem)) {
                _total = rolandoDados.total.toString();
            }
            let _cor = "";
            let _corDot = "";
            let _texto = "";
            let _atributo = "";
            if (destino.testeAtributo === EAtributoDestinoTeste.SORTE) {
                _cor = COR_SORTE;
                _corDot = COR_SORTE_DOTS;
                _texto = "Você TERÁ SORTE";
                _atributo = jogoAtual.panilha.sorte.toString();
            } else if (destino.testeAtributo === EAtributoDestinoTeste.HABILIDADE) {
                _cor = COR_HABILIDADE;
                _corDot = COR_HABILIDADE_DOTS;
                _texto = "Você TERÁ HABILIDADE";
                _atributo = jogoAtual.panilha.habilidade.toString();
            }
            return (
                <div className={styles.destinos_conteudo_pagina_rolagem}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.destinos_conteudo_pagina_rolagem_dados}>
                                    <p>{_soma}</p>
                                    <ReactDice
                                        numDice={2}
                                        ref={reactDados}
                                        rollDone={AoConcluirRolagem}
                                        faceColor={_cor}
                                        dotColor={_corDot}
                                        defaultRoll={1}
                                    />
                                </td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_total}>{" = " + _total}</td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_texto}>
                                    {_texto}
                                    <br />
                                    {"se os dados forem"}
                                    <br />
                                    {"MENOR OU IGUAL a"}
                                </td>
                                <td className={styles.destinos_conteudo_pagina_rolagem_atributo}>{_atributo}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    function AoConcluirRolagem(totalValue: number, values: number[]) {
        setRolandoDados((prevRolandoDados) => {
            return { ...prevRolandoDados, quantidade: prevRolandoDados.quantidade + 1, total: totalValue };
        });
    }
};

export default TelaDestinos;
