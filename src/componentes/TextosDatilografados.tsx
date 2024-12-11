import { useState, useEffect } from "react";

interface ITextosDatilografadosProps {
    textos: string[];
    velocidade: number;
    aoConcluir?: () => void;
}

export const TextosDatilografados = ({ textos, velocidade, aoConcluir }: ITextosDatilografadosProps) => {
    const [datilografados, setDatilografados] = useState<string[]>([]);
    const [indiceTexto, setIndiceTexto] = useState(0);
    const [indiceLetra, setIndiceLetra] = useState(0);

    useEffect(() => {
        if (!textos) {
            return;
        }
        const timer = setTimeout(Datilografar, velocidade);
        return () => clearTimeout(timer);
    }, [textos, velocidade, datilografados, indiceTexto, indiceLetra]);

    if (ContextosReprovados()) {
        return <></>;
    }
    return (
        <div className="datilografados_container">
            {datilografados.map((datilografadoI, indiceI) => {
                return (
                    <p
                        key={indiceI}
                        className="datilografados_paragrafo"
                    >
                        {datilografadoI}
                    </p>
                );
            })}
        </div>
    );

    function ContextosReprovados() {
        return !textos || !textos.length;
    }

    function TextoAtual() {
        if (textos[indiceTexto]) {
            return textos[indiceTexto];
        } else {
            return "";
        }
    }

    function IncrementarDatilografado(letra: string) {
        if (datilografados[indiceTexto]) {
            datilografados[indiceTexto] += letra;
        } else {
            setDatilografados((prevDatilografados) => [...prevDatilografados, letra]);
        }
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
            if (aoConcluir) {
                aoConcluir();
            }
        }
    }
};

export default TextosDatilografados;
