import { IEfeito } from "../tipos";

interface IPanilhaPopupProps {
    efeitos: IEfeito[];
}

export const PanilhaPopup = ({ efeitos }: IPanilhaPopupProps) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-70">
            <div className="bg-white rounded-md overflow-hidden max-w-md w-full mx-4">
                <nav className="bg-black text-white flex justify-between px-4 py-2">
                    <span className="text-lg">efeitos</span>
                </nav>
                <div className="text-3xl font-bold py-8 pl-4">
                    <div>
                        {efeitos?.map((efeitoI, indiceI) => {
                            return (
                                <div
                                    key={indiceI}
                                    //className={styles.historias_efeito}
                                >
                                    <h5>{efeitoI.texto}</h5>
                                    <h6>{efeitoI.quantidade + "  " + efeitoI.sobre}</h6>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanilhaPopup;
