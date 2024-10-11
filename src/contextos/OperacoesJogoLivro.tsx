import { IJogo, IPaginaCampanha } from "../tipos";

export const OperacoesJogoLivro = (jogoAtual: IJogo, paginaCampanha: IPaginaCampanha) => {
    return {
        ObterOperacao,
    };

    function ObterOperacao(nome: string) {
        if (!nome || nome === "") {
            return false;
        }
        switch (nome) {
            case "JogoAtual_Panilha_Invalida":
                return !!(!jogoAtual || !jogoAtual.panilha);
            default:
                console.log("Operação de destino '" + nome + "' não foi encontrada");
                return false;
        }
    }
};

export default OperacoesJogoLivro;
