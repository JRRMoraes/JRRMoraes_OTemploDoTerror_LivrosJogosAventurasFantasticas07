import "./App.css";
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
                                    element={<PaginaLivroJogo />}
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ProvedorJogos>
            </ProvedorLivro>
        </>
    );
}

export default App;
