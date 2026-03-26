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

    // --- 1. TRATAMENTO DO VALOR (CORREÇÃO DE CENTAVOS E EXTENSO) ---
    let valorBruto = String(dados.valorAluguel || "0");
    
    // Limpeza: remove R$, espaços e pontos de milhar, mantém a vírgula
    let valorLimpo = valorBruto.replace("R$", "").replace(/\s/g, "").replace(/\./g, "");
    // Conversão: troca vírgula por ponto para o JS entender decimais (evita deslocamento)
    valorLimpo = valorLimpo.replace(",", ".");

    let valorNumerico = parseFloat(valorLimpo);
    if (isNaN(valorNumerico)) valorNumerico = 0;

    // Formatação para o Word (Padrão brasileiro: 1.200,50)
    const valorFormatado = valorNumerico.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

    // Geração do Extenso Seguro
    let valorExtenso = "zero reais";
    try {
      if (valorNumerico > 0) {
        valorExtenso = extenso(valorNumerico.toFixed(2), { mode: 'currency' });
      }
    } catch (e) {
      valorExtenso = valorFormatado + " reais";
    }

    // --- 2. TRATAMENTO DE DATAS (INÍCIO E CÁLCULO DO FIM) ---
    let dataInicioFormatada = "";
    let dataFimFormatada = "";

    if (dados.dataInicioLocacao) {
      // Ajuste para evitar problemas de fuso horário no input date
      const dataAux = new Date(dados.dataInicioLocacao + 'T12:00:00');
      
      // Data de Início (DD/MM/AAAA)
      dataInicioFormatada = dataAux.toLocaleDateString('pt-BR');

      // Cálculo da Data de Fim (Soma os meses definidos no campo prazoMeses)
      const prazo = parseInt(dados.prazoMeses) || 0;
      const dataFimObj = new Date(dataAux);
      dataFimObj.setMonth(dataFimObj.getMonth() + prazo);
      
      dataFimFormatada = dataFimObj.toLocaleDateString('pt-BR');
    }

    // --- 3. MAPEAMENTO FINAL DOS DADOS PARA O DOCX ---
    doc.setData({
      // Financeiro e Prazos
      ValorAluguel: valorFormatado,
      ValorAluguelExtenso: valorExtenso,
      DataInicioLocacao: dataInicioFormatada,
      DataFimLocacao: dataFimFormatada,
      DiaMensalPagamentoAluguel: dados.diaPagamento || "",
      
      // Imóvel
      tipoImovel: dados.tipoImovel || "Casa",
      EnderecoImovel: dados.enderecoImovel || "",
      DescricaoMobiliada: dados.descricaoMobiliada || "",
      CotratoCoelba: dados.contratoCoelba || "",
      CotratoEmbasa: dados.contratoEmbasa || "", // Campo sem espaço conforme solicitado

      // Locador
      NomeLocador: dados.nomeLocador || "",
      NacionalizadeLocador: dados.nacionalidadeLocador || "",
      EstadoCivilLocador: dados.estadoCivilLocador || "",
      ProfissaoLocador: dados.profissaoLocador || "",
      CPFLocador: dados.cpfLocador || "",
      GRLocador: dados.rgLocador || "",
      UfRgLocador: dados.ufRgLocador || "",
      EnderecoLocador: dados.enderecoLocador || "",
      telefoneLocador: dados.telefoneLocador || "",
      "E-mailLocador": dados.emailLocador || "",

      // Locatário
      NomeLocatario: dados.nomeLocatario || "",
      NacionalidadeLocatario: dados.nacionalidadeLocataria || "",
      EstadoCivilLocatario: dados.estadoCivilLocataria || "",
      ProfissaoLocatario: dados.profissaoLocataria || "",
      CPFLocatario: dados.cpfLocatario || "",
      RGLocatario: dados.rgLocataria || "",
      UfRgLocatario: dados.ufRgLocataria || "",
      EnderecoLocatario: dados.enderecoLocataria || "",
      TelefoneLocatario: dados.telefoneLocataria || "",
      "E-mailLocatario": dados.emailLocataria || "",

      // Corretor (Usa CRECI em vez de CPF conforme última alteração)
      NomeCorretor: dados.nomeCorretor || "",
      CreciCorretor: dados.creciCorretor || "",
      DataAssinaturaContrato: dados.dataAssinatura || ""
    });

    // --- 4. RENDERIZAÇÃO E DOWNLOAD ---
    doc.render();
    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(out, `Contrato_Locacao_${dados.nomeLocatario || 'REMAX'}.docx`);

  } catch (error) {
    console.error("Erro detalhado na geração:", error);
    alert("Erro ao gerar o documento. Verifique os dados inseridos.");
  }
};