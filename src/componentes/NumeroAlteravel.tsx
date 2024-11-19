import styles from "./NumeroAlteravel.module.scss";
import { useEffect, useState } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface INumeroAlteravelProps {
    numeroAtual: number;
}

export const NumeroAlteravel = ({ numeroAtual }: INumeroAlteravelProps) => {
    const [numeroFisico, setNumeroFisico] = useState(numeroAtual);
    const numeroMotion = useMotionValue(numeroFisico);
    const numeroSpring = useSpring(numeroMotion);
    const numeroTransform = useTransform(numeroSpring, (numeroI) => Math.round(numeroI));

    useEffect(() => {
        if (numeroAtual === numeroFisico) {
            return;
        }
        setNumeroFisico((prevNumeroFisico) => {
            numeroSpring.set(numeroAtual);
            return numeroAtual;
        });
    }, [numeroAtual]);

    return <motion.span className={styles.numeroAlteravel}>{numeroTransform}</motion.span>;
};

export default NumeroAlteravel;
