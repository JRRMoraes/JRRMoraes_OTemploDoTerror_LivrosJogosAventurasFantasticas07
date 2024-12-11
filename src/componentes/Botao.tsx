import styles from "./Botao.module.scss";
import { ReactElement } from "react";

interface IBotaoProps {
    children: string | ReactElement | ReactElement[] | undefined;
    aoClicar: () => void;
    tipo?: "button" | "submit" | "reset";
    desativado?: boolean;
    dica?: string;
}

export const Botao = ({ children, aoClicar, tipo = "button", desativado = false, dica = "" }: IBotaoProps) => {
    return (
        <div className={styles.botao}>
            <button
                type={tipo}
                onClick={() => AoClicar()}
                disabled={desativado}
            >
                {children}
            </button>
            {MontarRetorno_Dica()}
        </div>
    );

    function AoClicar() {
        if (aoClicar) {
            aoClicar();
        }
    }

    function MontarRetorno_Dica() {
        if (dica) {
            return <span className={styles.botao_dica}>{dica}</span>;
        } else {
            return <></>;
        }
    }
};
