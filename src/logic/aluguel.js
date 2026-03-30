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
        // 1. Separamos a parte inteira e a decimal manualmente
        const partes = valorNumerico.toFixed(2).split(".");
        const inteiros = parseInt(partes[0]);
        const centavos = parseInt(partes[1]);

        // 2. Pegamos o extenso de cada parte separadamente (sem modo currency)
        const textoInteiro = extenso(inteiros);
        const textoCentavos = centavos > 0 ? extenso(centavos) : "";

        // 3. Montamos a frase manualmente para evitar erros da biblioteca
        let resultado = textoInteiro + (inteiros === 1 ? " real" : " reais");

        if (centavos > 0) {
          resultado += " e " + textoCentavos + (centavos === 1 ? " centavo" : " centavos");
        }

        campoExtenso = resultado;
      } else {
        campoExtenso = "Zero reais";
      }
    } catch (e) {
      console.error("Erro na conversão manual:", e);
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

    // --- 4. RENDERIZAÇÃO (MAPEAMENTO COMPLETO) ---
    doc.render({
      // Financeiro e Prazos
      ValorAluguel: campoNumero,
      ValorAluguelExtenso: campoExtenso,
      DiaMensalPagamentoAluguel: dados.diaPagamento || "",
      DataInicioLocacao: dataInicioFormatada || "",
      DataFimLocacao: dataFimFormatada || "",
      PrazoMeses: dados.prazoMeses || "",

      // Imóvel
      tipoImovel: dados.tipoImovel || "Casa",
      EnderecoImovel: dados.enderecoImovel || "",
      DescricaoMobiliada: dados.descricaoMobiliada || "",
      CotratoCoelba: dados.contratoCoelba || "",
      CotratoEmbasa: dados.contratoEmbasa || "",

      // Locador
      NomeLocador: dados.nomeLocador || "",
      NacionalizadeLocador: dados.nacionalidadeLocador || "",
      EstadoCivilLocador: dados.estadoCivilLocador || "",
      ProfissaoLocador: dados.profissaoLocador || "",
      CPFLocador: dados.cpfLocador || "",
      GRLocador: dados.rgLocador || "", // Verifique se no Word é {GRLocador} ou {RGLocador}
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

      // Corretor e Assinatura
      NomeCorretor: dados.nomeCorretor || "",
      CreciCorretor: dados.creciCorretor || "",
      CPFCorretor: dados.cpfCorretor || "",
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
