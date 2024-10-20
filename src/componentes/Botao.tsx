import styles from "./Botao.module.scss";
import { ReactElement } from "react";

interface IBotaoProps {
    children: string | ReactElement | ReactElement[] | undefined;
    aoClicar: () => void;
    tipo?: "button" | "submit" | "reset";
    desativado?: boolean;
}

export const Botao = ({ children, aoClicar, tipo = "button", desativado = false }: IBotaoProps) => {
    return (
        <button
            className={styles.botao}
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
