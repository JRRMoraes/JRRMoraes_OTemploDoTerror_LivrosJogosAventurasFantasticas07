import styles from "./BarraEnergia.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";

export const BarraEnergia = (energiaAtual: number, energiaTotal: number) => {
    return <div className={styles.barraEnergia}>{MontarRetorno_Energias()}</div>;

    function MontarRetorno_Energias() {
        energiaTotal = Math.max(energiaTotal, 1);
        energiaAtual = Math.max(energiaAtual, 0);
        energiaAtual = Math.min(energiaAtual, energiaTotal);
        const _energias = [];
        for (let energiaI = 1; energiaI <= energiaTotal; energiaI++) {
            const _temEnergia = energiaI <= energiaAtual;
            if (_temEnergia) {
                _energias.push(
                    <FavoriteIcon
                        key={energiaI}
                        color="error"
                    />
                );
            } else {
                _energias.push(
                    <HeartBrokenIcon
                        key={energiaI}
                        color="disabled"
                    />
                );
            }
        }
        return _energias;
    }
};
