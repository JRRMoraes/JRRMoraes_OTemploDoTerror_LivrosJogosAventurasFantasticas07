import { createContext, Dispatch, SetStateAction } from "react";
import { IAudioExecutor, ILivro } from "../tipos";

export type TContextoBaseLivro = {
    livro: ILivro;
    setLivro: Dispatch<SetStateAction<ILivro>>;
    audioExecutor: IAudioExecutor;
    setAudioExecutor: Dispatch<SetStateAction<IAudioExecutor>>;
};

export const ContextoBaseLivro = createContext<TContextoBaseLivro>(null!);
ContextoBaseLivro.displayName = "Livro";

export default ContextoBaseLivro;
