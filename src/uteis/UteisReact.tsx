import { ReactElement, Dispatch, SetStateAction, useState, useEffect } from "react";

export interface IChildrenProps {
    children?: ReactElement;
}

export function CriarState<T>(original: T): [T, Dispatch<SetStateAction<T>>] {
    const [valor, setValor] = useState<T>(original);
    return [valor, setValor];
}

export function CriarStateComLocalStorage<T>(chaveStorage: string, original: T): [T, Dispatch<SetStateAction<T>>] {
    const [valor, setValor] = useState<T>(CarregarInicial());

    useEffect(() => {
        if (chaveStorage) {
            localStorage.setItem(chaveStorage, JSON.stringify(valor));
        }
    }, [valor]);

    return [valor, setValor];

    function CarregarInicial() {
        let inicial = original;
        let carregado = localStorage.getItem(chaveStorage);
        if (carregado && carregado !== "null") {
            inicial = JSON.parse(carregado) as T;
        }
        return inicial;
    }
}

export enum EProcesso {
    _ZERO = "_Zero",
    INICIANDO = "Iniciando",
    PROCESSANDO = "Processando",
    CONCLUIDO = "Concluído",
    DESTRUIDO = "Destruido",
}
