📝 Gerador de Documentos Imobiliários - RE/MAX Litorânea
Este sistema é uma ferramenta interna desenvolvida para automatizar a criação de contratos de locação e documentos imobiliários. O objetivo é reduzir erros de digitação, padronizar a identidade visual da unidade e agilizar o dia a dia dos corretores.

🚀 Funcionalidades Principais
Automação de Valores por Extenso: Sistema inteligente que converte valores numéricos em texto (Reais e Centavos) de forma automática e precisa.

Seleção de Corretores: Banco de dados integrado com nome e CRECI dos corretores da unidade, ordenados alfabeticamente.

Garantia Locatícia Dinâmica: Alternância entre Seguro Locatício e Caução com um clique:

Cálculo automático do valor total da caução (Aluguel × Meses).

Geração de parágrafos jurídicos específicos para cada modalidade.

Cálculo de Datas: Define automaticamente a data de término do contrato com base no prazo de meses informado.

Preenchimento em Lote: Mapeia mais de 30 campos entre Locador, Locatário, Imóvel e Financeiro diretamente para um modelo .docx.

🛠️ Tecnologias Utilizadas
Vue.js 3: Framework para uma interface reativa e rápida.

Docxtemplater: Motor para manipulação e preenchimento de arquivos Word.

PizZip: Manipulação de arquivos compactados (essencial para arquivos .docx).

File-saver: Gerenciamento de downloads no navegador.

Extenso.js: Biblioteca base para conversão de números em texto.

📂 Estrutura de Arquivos Críticos
App.vue: Contém a interface do usuário, a lista de corretores e o estado do formulário.

aluguel.js: O "cérebro" do sistema. Processa a limpeza de dados, cálculos financeiros, lógica de garantia e renderização do arquivo final.

/public/modelo.docx: O arquivo de template que deve conter as tags entre chaves, ex: {NomeLocatario}, {ValorAluguel}, {TextoSeguro}.

📋 Como usar
Selecione o Corretor: Os dados de CRECI serão preenchidos automaticamente.

Preencha os Dados: Insira as informações do locador, locatário e imóvel.

Defina a Garantia: Escolha entre Seguro ou Caução. Se escolher Caução, informe o número de meses.

Gere o Documento: Clique em gerar para baixar o arquivo .docx já formatado em Calibri 10.

⚠️ Observações de Manutenção
Ao editar o arquivo modelo.docx, certifique-se de que as tags no Word correspondam exatamente às chaves definidas no objeto doc.render dentro do arquivo aluguel.js. O sistema diferencia maiúsculas de minúsculas.