import "./globais/EstilosGlobais.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvedorLivro, ProvedorJogos } from "./provedores";
import { PaginaInicial, PaginaLivroJogo } from "./paginas";

function App() {
    return (
        <>
            <ProvedorLivro>
                <ProvedorJogos>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={<PaginaInicial />}
                            >
                                <Route
                                    index
                                    element={<PaginaInicial />}
                                />
                            </Route>
                            <Route
                                path="/:idJogo"
                                element={<PaginaLivroJogo />}
                            />
                        </Routes>
                    </BrowserRouter>
                </ProvedorJogos>
            </ProvedorLivro>
        </>
    );
}

export default App;
