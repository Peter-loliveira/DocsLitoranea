import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import extenso from "extenso";

export const processarAluguel = async (dados) => {
  try {
    const response = await fetch("/modelo.docx");
    const content = await response.arrayBuffer();
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // --- 1. TRATAMENTO DO VALOR (LIMPEZA ULTRA-RIGOROSA) ---
    // Forçamos a conversão para string e removemos tudo que não for dígito ou vírgula
    let valorEntrada = String(dados.valorAluguel || "0");
    let apenasNumeros = valorEntrada.replace(/[^\d,]/g, "");

    // Converte vírgula para ponto para o parseFloat
    let valorParaCalculo = apenasNumeros.replace(",", ".");
    let valorNumerico = parseFloat(valorParaCalculo);

    if (isNaN(valorNumerico)) valorNumerico = 0;

    // Formatação para {ValorAluguel} (ex: 1.256,66)
    const campoNumero = valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // --- 2. GERAÇÃO DO EXTENSO (MÉTODO DE COMPATIBILIDADE) ---
    let campoExtenso = "";
    try {
      if (valorNumerico > 0) {
        // Algumas versões da biblioteca preferem receber o número como String fixa
        const stringParaBiblioteca = valorNumerico.toFixed(2);

        // Tentativa 1: Modo Moeda Direto
        let resultado = extenso(stringParaBiblioteca, { mode: 'currency' });

        // Verificação: Se a biblioteca falhou e retornou o número de novo (seu erro atual)
        if (!resultado || /\d/.test(resultado)) {
            // Tentativa 2: Modo padrão + sufixo manual
            const textoPuro = extenso(stringParaBiblioteca.replace('.', ','), { locale: 'br' });
            resultado = textoPuro + " reais";
        }

        campoExtenso = resultado.charAt(0).toUpperCase() + resultado.slice(1);
      } else {
        campoExtenso = "Zero reais";
      }
    } catch (e) {
      console.error("Erro no processamento do extenso:", e);
      campoExtenso = campoNumero + " reais";
    }

    // --- 3. TRATAMENTO DE DATAS ---
    let dataAssinaturaFormatada = "";
    let dataInicioFormatada = "";
    let dataFimFormatada = "";

    if (dados.dataAssinatura) {
      const d = new Date(dados.dataAssinatura + 'T12:00:00');
      dataAssinaturaFormatada = d.toLocaleDateString('pt-BR');
    }

    if (dados.dataInicioLocacao) {
      const dInicio = new Date(dados.dataInicioLocacao + 'T12:00:00');
      dataInicioFormatada = dInicio.toLocaleDateString('pt-BR');
      const prazo = parseInt(dados.prazoMeses) || 0;
      const dFim = new Date(dInicio);
      dFim.setMonth(dFim.getMonth() + prazo);
      dataFimFormatada = dFim.toLocaleDateString('pt-BR');
    }

    // --- 4. RENDERIZAÇÃO (MAPEAMENTO) ---
    doc.render({
      ValorAluguel: campoNumero,
      ValorAluguelExtenso: campoExtenso,
      NomeLocatario: dados.nomeLocatario || "",
      // Usamos operadores || "" para garantir que campos vazios não quebrem o Word
      DiaMensalPagamentoAluguel: dados.diaPagamento || "",
      DataInicioLocacao: dataInicioFormatada || "",
      DataFimLocacao: dataFimFormatada || "",
      EnderecoImovel: dados.enderecoImovel || "",
      NomeLocador: dados.nomeLocador || "",
      DataAssinaturaContrato: dataAssinaturaFormatada || ""
    });

    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(out, `Contrato_${dados.nomeLocatario || 'REMAX'}.docx`);

  } catch (error) {
    console.error("Erro detalhado:", error);
    alert("Erro ao gerar contrato. Verifique o console.");
  }
};
