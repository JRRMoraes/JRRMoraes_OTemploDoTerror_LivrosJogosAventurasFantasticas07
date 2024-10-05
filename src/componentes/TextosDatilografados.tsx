import { useState, useEffect } from "react";

interface ITextosDatilografadosProps {
    textos: string[];
    velocidade: number;
    aoConcluir?: () => void;
}

export const TextosDatilografados = ({ textos, velocidade, aoConcluir }: ITextosDatilografadosProps) => {
    const [datilografados, setDatilografados] = useState<string[]>([]);
    const [concluido, setConcluido] = useState(false);
    const [indiceTexto, setIndiceTexto] = useState(0);
    const [indiceLetra, setIndiceLetra] = useState(0);

    function TextoAtual() {
        if (textos[indiceTexto]) {
            return textos[indiceTexto];
        } else {
            return "";
        }
    }

    function IncrementarDatilografado(letra: string) {
        if (!datilografados[indiceTexto]) {
            setDatilografados((prevDatilografados) => [...prevDatilografados, ""]);
        }
        datilografados[indiceTexto] += letra;
    }

    useEffect(() => {
        if (!textos || !textos.length) {
            return;
        }

        function Datilografar() {
            if (indiceTexto < TextoAtual().length) {
                if (indiceLetra < TextoAtual().length) {
                    IncrementarDatilografado(TextoAtual()[indiceLetra]);
                    setIndiceLetra((prevIndiceLetra) => prevIndiceLetra + 1);
                } else {
                    setTimeout(() => {
                        setIndiceTexto((prevIndiceTexto) => prevIndiceTexto + 1);
                        setIndiceLetra(0);
                    }, velocidade);
                }
            } else {
                setConcluido(true);
                if (aoConcluir) aoConcluir();
            }
        }

        const timer = setTimeout(Datilografar, velocidade);
        return () => clearTimeout(timer);
    }, [textos, velocidade, datilografados, indiceTexto, indiceLetra]);

    if (!textos || !textos.length) return <></>;
    return (
        <div>
            {datilografados.map((datilografadoI, indiceI) => {
                return <p key={indiceI}>{datilografadoI}</p>;
            })}
        </div>
    );
};

export default TextosDatilografados;
