import { useState } from "react";
import { IJogo, IPagina, IPaginaCampanha, ECampanhaCapitulo, IEfeito, CriarJogoNulo } from "../tipos";
import { ContextoBaseJogos } from "../contextos";
import { IChildrenProps, CriarStateComLocalStorage } from "../uteis";

const LOCALSTORAGE_JOGOS = "JRRMoraes_LJAF07_OTemploDoTerror__JogoSalvo";

export const ProvedorJogos = ({ children }: IChildrenProps) => {
    const [jogoSalvo1, setJogoSalvo1] = CriarStateComLocalStorage<IJogo>(LOCALSTORAGE_JOGOS + "1", CriarJogoNulo(1));

    const [jogoSalvo2, setJogoSalvo2] = CriarStateComLocalStorage<IJogo>(LOCALSTORAGE_JOGOS + "2", CriarJogoNulo(2));

    const [jogoSalvo3, setJogoSalvo3] = CriarStateComLocalStorage<IJogo>(LOCALSTORAGE_JOGOS + "3", CriarJogoNulo(3));

    const [jogoAtual, setJogoAtual] = useState<IJogo>(null!);

    const [paginaAtual, setPaginaAtual] = useState<IPagina>(null!);

    const [paginaCampanha, setPaginaCampanha] = useState<IPaginaCampanha>(null!);

    const [padraoCapitulo, setPadraoCapitulo] = useState<ECampanhaCapitulo>(ECampanhaCapitulo.PAGINAS_INICIAIS);

    const [efeitosAtuais, setEfeitosAtuais] = useState<IEfeito[]>([]);

    return (
        <ContextoBaseJogos.Provider
            value={{
                jogoSalvo1,
                setJogoSalvo1,
                jogoSalvo2,
                setJogoSalvo2,
                jogoSalvo3,
                setJogoSalvo3,
                jogoAtual,
                setJogoAtual,
                paginaAtual,
                setPaginaAtual,
                paginaCampanha,
                setPaginaCampanha,
                padraoCapitulo,
                setPadraoCapitulo,
                efeitosAtuais,
                setEfeitosAtuais,
            }}
        >
            {children}
        </ContextoBaseJogos.Provider>
    );
};
