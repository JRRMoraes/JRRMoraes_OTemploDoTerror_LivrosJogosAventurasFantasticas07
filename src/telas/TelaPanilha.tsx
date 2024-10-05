import { ContextoJogos } from "../contextos";

export const TelaPanilha = () => {
    const { jogoAtual } = ContextoJogos();

    if (!jogoAtual) return <></>;
    if (!jogoAtual.panilha) return <></>;
    return (
        <div>
            <div>{jogoAtual.panilha.jogador}</div>
            <div>
                <span>Habilidade:</span>
                <span>{jogoAtual.panilha.habilidade}</span>
                <span>{jogoAtual.panilha.habilidadeInicial}</span>
            </div>
            <div>
                <span>Energia:</span>
                <span>{jogoAtual.panilha.energia}</span>
                <span>{jogoAtual.panilha.energiaInicial}</span>
            </div>
        </div>
    );
};

export default TelaPanilha;
