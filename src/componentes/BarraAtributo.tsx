import styles from "./BarraAtributo.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FlashOffIcon from "@mui/icons-material/FlashOff";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import NoMealsIcon from "@mui/icons-material/NoMeals";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { COR_ENERGIA, COR_HABILIDADE, COR_SORTE, COR_OURO } from "../globais/Constantes";

const BarraAtributo = (atributoAtual: number, atributoTotal: number, barraAtributo: EBarraAtributo) => {
    const _direita = [EBarraAtributo.ENERGIA_INIMIGO].includes(barraAtributo);

    const COR_INATIVO = "#808080";

    return <div className={MontarRetorno_Estilo()}>{MontarRetorno_Barra()}</div>;

    function MontarRetorno_Barra() {
        atributoTotal = Math.max(atributoTotal, 1);
        atributoAtual = Math.max(atributoAtual, 0);
        atributoAtual = Math.min(atributoAtual, atributoTotal);
        const _atributos = [];
        for (let atributoI = 1; atributoI <= atributoTotal; atributoI++) {
            if (atributoI <= atributoAtual) {
                _atributos.push(MontarRetorno_IconeAtivo(atributoI));
            } else {
                _atributos.push(MontarRetorno_IconeInativo(atributoI));
            }
        }
        if (_direita) {
            return _atributos.reverse();
        } else {
            return _atributos;
        }
    }

    function MontarRetorno_Estilo() {
        let _estilo = styles.barraAtributo;
        if (_direita) {
            _estilo += " " + styles.barraAtributo_direita;
        }
        return _estilo;
    }

    function MontarRetorno_IconeAtivo(key: number) {
        switch (barraAtributo) {
            case EBarraAtributo._ENERGIA:
                return (
                    <FavoriteIcon
                        key={key}
                        htmlColor={COR_ENERGIA}
                    />
                );
            case EBarraAtributo.HABILIDADE:
                return (
                    <FlashOnIcon
                        key={key}
                        htmlColor={COR_HABILIDADE}
                    />
                );
            case EBarraAtributo.SORTE:
                return (
                    <StarIcon
                        key={key}
                        htmlColor={COR_SORTE}
                    />
                );
            case EBarraAtributo.OURO:
                return (
                    <AttachMoneyIcon
                        key={key}
                        htmlColor={COR_OURO}
                    />
                );
            case EBarraAtributo.PROVISAO:
                return (
                    <RestaurantIcon
                        key={key}
                        htmlColor={"#00ff00"}
                    />
                );
            case EBarraAtributo.ENCANTOS:
                return (
                    <FavoriteIcon
                        key={key}
                        htmlColor={"#00ff00"}
                    />
                );
            case EBarraAtributo.ITENS:
                return (
                    <FavoriteIcon
                        key={key}
                        htmlColor={"#00ff00"}
                    />
                );
            case EBarraAtributo.ENERGIA_INIMIGO:
                return (
                    <FavoriteIcon
                        key={key}
                        htmlColor={"#00ff00"}
                    />
                );
        }
    }

    function MontarRetorno_IconeInativo(key: number) {
        switch (barraAtributo) {
            case EBarraAtributo._ENERGIA:
                return (
                    <HeartBrokenIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
            case EBarraAtributo.HABILIDADE:
                return (
                    <FlashOffIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
            case EBarraAtributo.SORTE:
                return (
                    <StarHalfIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
            case EBarraAtributo.OURO:
                return (
                    <MoneyOffIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
            case EBarraAtributo.PROVISAO:
                return (
                    <NoMealsIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
            case EBarraAtributo.ENCANTOS:
                return (
                    <HeartBrokenIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
            case EBarraAtributo.ITENS:
                return (
                    <HeartBrokenIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
            case EBarraAtributo.ENERGIA_INIMIGO:
                return (
                    <HeartBrokenIcon
                        key={key}
                        htmlColor={COR_INATIVO}
                    />
                );
        }
    }
};

enum EBarraAtributo {
    _ENERGIA = "ENERGIA",
    HABILIDADE = "HABILIDADE",
    SORTE = "SORTE",
    OURO = "OURO",
    PROVISAO = "PROVISAO",
    ENCANTOS = "ENCANTOS",
    ITENS = "ITENS",
    ENERGIA_INIMIGO = "ENERGIA_INIMIGO",
}

export const BarraEnergia = (energiaAtual: number, energiaTotal: number) => {
    return BarraAtributo(energiaAtual, energiaTotal, EBarraAtributo._ENERGIA);
};

export const BarraHabilidade = (habilidadeAtual: number, habilidadeTotal: number) => {
    return BarraAtributo(habilidadeAtual, habilidadeTotal, EBarraAtributo.HABILIDADE);
};

export const BarraSorte = (sorteAtual: number, sorteTotal: number) => {
    return BarraAtributo(sorteAtual, sorteTotal, EBarraAtributo.SORTE);
};

export const BarraEnergiaInimigo = (energiaAtual: number, energiaTotal: number) => {
    return BarraAtributo(energiaAtual, energiaTotal, EBarraAtributo.ENERGIA_INIMIGO);
};
