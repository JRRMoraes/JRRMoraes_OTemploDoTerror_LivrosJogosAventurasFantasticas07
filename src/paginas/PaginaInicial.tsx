import { TextosDatilografados } from "../componentes";
import { ContextoLivro } from "../contextos";
import { TelaListaJogosSalvos } from "../telas";

export const PaginaInicial = () => {
    const { livro } = ContextoLivro();

    function MontarImagemCapa() {
        return (
            <img
                className="capa"
                src="src\assets\LJAF07_OTemploDoTerror\imagens\Capa.png"
                alt="O Templo do Terror"
                height="100%"
            ></img>
        );
    }

    function MontarRetorno_ResumoInicial() {
        return (
            <div>
                <TextosDatilografados
                    textos={livro.resumoInicial}
                    velocidade={50}
                />
            </div>
        );
    }

    if (!livro) {
        return <></>;
    }
    return (
        <div>
            {MontarImagemCapa()}
            {MontarRetorno_ResumoInicial()}
            <TelaListaJogosSalvos />
        </div>
    );
};

export default PaginaInicial;
