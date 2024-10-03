import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { ContextoJogos } from "../contextos";
import { TelaCampanha, TelaPanilha } from "../telas";

export const PaginaLivroJogo = () => {
    let { idJogo } = useParams();

    const { jogoAtual, setJogoAtual, ObterJogoSalvo } = ContextoJogos();
    if (!jogoAtual) setJogoAtual(ObterJogoSalvo(idJogo!));
    //    useEffect(() => {
    //        if (!jogoAtual) setJogoAtual(ObterJogoSalvo(idJogo!));
    //    }, []);
    if (!jogoAtual) return <></>;

    return (
        <div>
            <div>
                <TelaPanilha />
            </div>
            <div>
                <TelaCampanha />
            </div>
        </div>
    );
};

export default PaginaLivroJogo;
