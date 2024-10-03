import { TelaListaJogosSalvos } from "../telas";

export const PaginaInicial = () => {
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
                <ul>
                    {
                        //!livro.resumoInicial?.map((textoI: string) => {
                        //    <li>{textoI}</li>;
                        //})
                    }
                </ul>
            </div>
        );
    }

    return (
        <div>
            {MontarImagemCapa()}
            <TelaListaJogosSalvos />
        </div>
    );
};

export default PaginaInicial;
