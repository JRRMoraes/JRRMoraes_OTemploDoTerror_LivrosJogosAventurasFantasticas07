import "./Botao.module.scss";
import { ReactElement } from "react";

interface IBotaoProps {
    children: ReactElement | string;
    aoClicar: () => void;
    tipo?: "button" | "submit" | "reset";
    desativado?: boolean;
}

export const Botao = ({ children, aoClicar, tipo = "button", desativado = false }: IBotaoProps) => {
    return (
        <button
            type={tipo}
            onClick={() => AoClicar()}
            disabled={desativado}
        >
            {children}
        </button>
    );

    function AoClicar() {
        if (aoClicar) {
            aoClicar();
        }
    }
};
