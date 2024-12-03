import { createContext, Dispatch, SetStateAction } from "react";
import { ILivro, IAudioExecutor, IAudioMusica, IAudioEfeito } from "../tipos";

export type TContextoBaseLivro = {
    livro: ILivro;
    setLivro: Dispatch<SetStateAction<ILivro>>;
    audioExecutor: IAudioExecutor;
    setAudioExecutor: Dispatch<SetStateAction<IAudioExecutor>>;
    audioMusica: IAudioMusica;
    setAudioMusica: Dispatch<SetStateAction<IAudioMusica>>;
    audioEfeitos: IAudioEfeito[];
    setAudioEfeitos: Dispatch<SetStateAction<IAudioEfeito[]>>;
};

export const ContextoBaseLivro = createContext<TContextoBaseLivro>(null!);
ContextoBaseLivro.displayName = "Livro";

export default ContextoBaseLivro;
