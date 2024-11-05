import styles from "./FlipBookPagina.module.scss";
import { forwardRef, ReactElement } from "react";

interface IFlipPaginaProps {
    children?: ReactElement;
}

export const FlipBookPagina = forwardRef<HTMLDivElement, IFlipPaginaProps>((props, ref) => {
    return (
        <div
            className={"demoPage " + styles.flipBookPagina}
            ref={ref}
        >
            {props.children}
        </div>
    );
});

export interface IHTMLFlipBookRef {
    pageFlip: () => any;
}
