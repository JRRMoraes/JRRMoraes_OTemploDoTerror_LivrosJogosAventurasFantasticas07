import { IJogo, IPaginaCampanha, IAprovacaoDestino, EAtributo, EComparacao } from "../tipos";
import { TextosIguais } from "../uteis";

export const OperacoesJogoLivro = (jogoAtual: IJogo, paginaCampanha: IPaginaCampanha) => {
    return {
        ValidarAprovacoesDestino,
    };

    function ValidarAprovacoesDestino(aprovacoes: IAprovacaoDestino[]) {
        if (!aprovacoes || !aprovacoes.length) {
            return true;
        }
        let _ok = true;
        aprovacoes.forEach((aprovacaoI) => {
            switch (aprovacaoI.atributoAprovacao) {
                case EAtributo._FUNCAO:
                    _ok &&= ValidarAprovacoesDestino_Funcao(aprovacaoI);
                    break;
                case EAtributo.ITENS:
                    _ok &&= ValidarAprovacoesDestino_Itens(aprovacaoI);
                    break;
                default:
                    _ok = false;
                    console.log("OperacoesJogoLivro:ValidarAprovacoesDestino:: Não foi encontrado o atributo " + aprovacaoI.atributoAprovacao + " com nome '" + aprovacaoI.nomeAprovacao + "'.");
                    break;
            }
        });
        return _ok;
    }

    function ValidarAprovacoesDestino_Funcao(aprovacao: IAprovacaoDestino): boolean {
        let _ok = false;
        switch (aprovacao.nomeAprovacao) {
            case "JogoAtual_Panilha":
                _ok = !!(jogoAtual && jogoAtual.panilha);
                break;
            default:
                _ok = false;
                console.log("Operação de destino '" + aprovacao.nomeAprovacao + "' não foi encontrada");
                break;
        }
        switch (aprovacao.comparacao) {
            case EComparacao.NAO_POSSUIR:
                _ok = !_ok;
                break;
            case EComparacao._POSSUIR:
            default:
                _ok = _ok;
                break;
        }
        return _ok;
    }

    function ValidarAprovacoesDestino_Itens(aprovacao: IAprovacaoDestino): boolean {
        let _ok = false;
        let _item = null;
        if (!jogoAtual || !jogoAtual.panilha || !jogoAtual.panilha.itens || !jogoAtual.panilha.itens.length || !aprovacao.nomeAprovacao) {
            _ok = false;
        } else {
            _item = jogoAtual.panilha.itens.find((itemI) => TextosIguais(itemI.idItem, aprovacao.nomeAprovacao));
        }
        if (_item) {
            switch (aprovacao.comparacao) {
                case EComparacao.MAIOR_IGUAL:
                    _ok = !!(aprovacao.quantidade && _item.quantidade >= aprovacao.quantidade);
                    break;
                case EComparacao.MAIOR:
                    _ok = !!(aprovacao.quantidade && _item.quantidade > aprovacao.quantidade);
                    break;
                case EComparacao.MENOR_IGUAL:
                    _ok = !!(aprovacao.quantidade && _item.quantidade <= aprovacao.quantidade);
                    break;
                case EComparacao.MENOR:
                    _ok = !!(aprovacao.quantidade && _item.quantidade < aprovacao.quantidade);
                    break;
                case EComparacao.NAO_POSSUIR:
                    _ok = false;
                    break;
                case EComparacao._POSSUIR:
                default:
                    _ok = true;
                    break;
            }
        } else {
            switch (aprovacao.comparacao) {
                case EComparacao.MENOR:
                case EComparacao.MENOR_IGUAL:
                    _ok = !!aprovacao.quantidade;
                    break;
                case EComparacao.NAO_POSSUIR:
                    _ok = true;
                    break;
                case EComparacao.MAIOR_IGUAL:
                case EComparacao.MAIOR:
                case EComparacao._POSSUIR:
                default:
                    _ok = false;
                    break;
            }
        }
        return _ok;
    }
};

export default OperacoesJogoLivro;
