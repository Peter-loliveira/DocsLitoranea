# 📑 Gerador de Documentos RE/MAX Litorânea

> Sistema inteligente para automação de contratos e documentos imobiliários, focado em precisão jurídica e agilidade operacional.

---

## 🛠️ Funções do Sistema

### 1. Inteligência Financeira

- **Conversão Automática por Extenso:** Transforma valores numéricos em texto completo (reais e centavos) sem erros de digitação.
- **Cálculo de Caução:** Multiplica o valor do aluguel pelo número de meses selecionado, gerando o montante total e seu respectivo extenso.
- **Formatação de Moeda:** Aplica automaticamente a máscara de milhar e centavos no padrão brasileiro (R$ #.###,##).

### 2. Gestão de Garantias (Cláusula 3.4)

- **Seguro Locatício:** Gera automaticamente o texto jurídico padrão para exigência de seguradora.
- **Caução:** Gera o texto específico citando o valor total, a equivalência em meses e o embasamento na Lei do Inquilinato.

### 3. Automação de Corretores

- **Banco de Dados Integrado:** Lista suspensa com nomes e CRECI dos corretores da unidade.
- **Ordenação Alfabética:** Organização automática para facilitar a seleção.

### 4. Processamento de Datas

- **Datas Inteligentes:** Formatação automática para o padrão brasileiro (DD/MM/AAAA).
- **Cálculo de Vigência:** Calcula a data final do contrato baseando-se na data de início e no prazo em meses.

---

## 📖 Como Utilizar

1. **Configuração Inicial**
   - Selecione o **Tipo de Contrato** desejado no menu superior.
   - Escolha o **Corretor Responsável** para que o CRECI seja preenchido automaticamente.
   - Defina a **Data de Assinatura**.

2. **Preenchimento de Dados**
   - Insira os dados do **Locador** (Proprietário) e do **Locatário** (Inquilino).
   - Informe os detalhes do **Imóvel** e as informações de contas de consumo (Coelba/Embasa).

3. **Definição da Garantia**
   - Escolha entre os botões `SEGURO LOCATÍCIO` ou `CAUÇÃO`.
   - Caso selecione **Caução**, informe a quantidade de meses no campo que aparecerá abaixo.

4. **Geração do Arquivo**
   - Clique no botão **Gerar Documento**.
   - O sistema processará as informações e iniciará o download de um arquivo `.docx`.
   - O texto inserido na cláusula de garantia será formatado automaticamente em **Calibri, tamanho 10**.

---

## 📋 Tags de Template (Word)

Para o correto funcionamento, o arquivo `modelo.docx` deve conter as seguintes tags principais:

- `{ValorAluguel}` e `{ValorAluguelExtenso}`
- `{TextoSeguro}` (Para a cláusula de garantia dinâmica)
- `{NomeCorretor}` e `{CreciCorretor}`
- `{DataInicioLocacao}` e `{DataFimLocacao}`

---

_Desenvolvido para uso exclusivo da RE/MAX Litorânea._
