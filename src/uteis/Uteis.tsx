export function TextosIguais(texto1: string, texto2: string, ehCaseSensitive: boolean = false) {
    if (!texto1) texto1 = "";
    if (!texto2) texto2 = "";
    if (ehCaseSensitive) {
        return texto1 === texto2;
    } else {
        return texto1.toLocaleUpperCase() === texto2.toLocaleUpperCase();
    }
}

export function ContemTexto(textoBuscado: string, textoCompleto: string, ehCaseSensitive: boolean = false) {
    if (!textoBuscado || !textoCompleto) {
        return false;
    }
    if (ehCaseSensitive) {
        return textoCompleto.indexOf(textoBuscado) !== 0;
    } else {
        return textoCompleto.toLocaleUpperCase().indexOf(textoBuscado.toLocaleUpperCase()) >= 0;
    }
}

export function SubstituirTexto(textoTratado: string, textoBuscado: string, textoSubstituto: string, saoTodos: boolean, ehCaseSensitive: boolean = false) {
    if (!textoTratado) textoTratado = "";
    if (!textoBuscado) textoBuscado = "";
    if (!textoSubstituto) textoSubstituto = "";
    let _regexTexto = "";
    if (saoTodos) _regexTexto += "g";
    if (!ehCaseSensitive) _regexTexto += "i";
    let _regex = new RegExp(textoBuscado, _regexTexto);
    return textoTratado.replace(_regex, textoSubstituto);
}
