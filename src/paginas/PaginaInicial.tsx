import { ContextoJogos } from "../contextos";

export const PaginaInicial = () => {
    const { jogos, setJogos } = ContextoJogos();

    function MontarRetorno_Sucesso() {
        return (
            <div>
                <ul>
                    {jogos?.map((jogoI) => {
                        return (
                            <li key={jogoI.idJogo}>
                                {jogoI.idJogo} - {jogoI.jogador}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    return <div>{MontarRetorno_Sucesso()}</div>;
};

export default PaginaInicial;
