/**
 * Lógica base para modelos não implementados
 * Este ficheiro serve para gerir as mensagens de erro ou logs 
 * enquanto os outros modelos (Venda, Representação, etc.) 
 * não são criados individualmente.
 */

export const modeloNaoDisponivel = (tipo) => {
    const modelos = {
        representacao: "Contrato de Representação",
        compra_venda: "Contrato de Compra e Venda",
        aditivo_compra: "Aditivo à Compra e Venda",
        aditivo_aluguel: "Aditivo à Aluguel"
    };

    const nomeModelo = modelos[tipo] || "Este modelo";

    console.warn(`Tentativa de gerar: ${nomeModelo}. Funcionalidade ainda em desenvolvimento.`);
    
    // Esta função pode ser expandida no futuro para retornar 
    // configurações padrão de formulário.
    return {
        status: "error",
        message: `${nomeModelo} ainda não está disponível no sistema.`
    };
};

/**
 * Função utilitária para limpar campos do formulário
 * Pode ser usada por todos os scripts de documentos.
 */
export const limparFormulario = (formObj) => {
    Object.keys(formObj).forEach(key => {
        formObj[key] = "";
    });
};