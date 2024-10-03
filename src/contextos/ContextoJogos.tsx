import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { IJogo } from "../tipos";

export type TContextoBaseJogos = {
    jogoSalvo1: IJogo;
    setJogoSalvo1: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo2: IJogo;
    setJogoSalvo2: Dispatch<SetStateAction<IJogo>>;
    jogoSalvo3: IJogo;
    setJogoSalvo3: Dispatch<SetStateAction<IJogo>>;
    jogoAtual: IJogo;
    setJogoAtual: Dispatch<SetStateAction<IJogo>>;
};

export const ContextoBaseJogos = createContext<TContextoBaseJogos>(null!);
ContextoBaseJogos.displayName = "Jogos";

export const ContextoJogos = () => {
    const {
        jogoSalvo1,
        setJogoSalvo1,
        jogoSalvo2,
        setJogoSalvo2,
        jogoSalvo3,
        setJogoSalvo3,
        jogoAtual,
        setJogoAtual,
    } = useContext(ContextoBaseJogos);

    function ObterJogoSalvo(idJogoSalvo: string) {
        if (idJogoSalvo === "1") {
            return AjustarNovoJogo(jogoSalvo1);
        } else if (idJogoSalvo === "2") {
            return AjustarNovoJogo(jogoSalvo2);
        } else if (idJogoSalvo === "3") {
            return AjustarNovoJogo(jogoSalvo3);
        } else {
            return null!;
        }
    }

    function SalvarJogoAtualNoSalvo() {
        if (!jogoAtual) return;
        jogoAtual.dataSalvo = new Date();
        if (jogoAtual.idJogo === 1) {
            setJogoSalvo1(jogoAtual);
        } else if (jogoAtual.idJogo === 2) {
            setJogoSalvo2(jogoAtual);
        } else if (jogoAtual.idJogo === 3) {
            setJogoSalvo3(jogoAtual);
        }
    }

    function AjustarNovoJogo(jogoSalvo: IJogo) {
        let jogoRetorno = jogoSalvo;
        if (!jogoRetorno.dataSalvo) {
            jogoRetorno.dataSalvo = new Date();
        }
        if (!jogoRetorno.campanhaCapitulo) {
            jogoRetorno.campanhaCapitulo = "PAGINAS_INICIAIS";
            jogoRetorno.campanhaIndice = 1;
        }
        //if (!jogoRetorno.panilha) {
        //    jogoRetorno.panilha = {
        //        jogador: "",
        //        habilidade: 0,
        //        habilidadeInicial: 0,
        //        energia: 0,
        //        energiaInicial: 0,
        //        sorte: 0,
        //        sorteInicial: 0,
        //    };
        //}
        return jogoRetorno;
    }

    return {
        jogoSalvo1,
        setJogoSalvo1,
        jogoSalvo2,
        setJogoSalvo2,
        jogoSalvo3,
        setJogoSalvo3,
        jogoAtual,
        setJogoAtual,
        ObterJogoSalvo,
        SalvarJogoAtualNoSalvo,
        AjustarProximaPaginaNoJogoAtual: AjustarNovoJogo,
    };
};
