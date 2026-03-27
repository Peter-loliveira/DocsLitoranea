<template>
  <div class="remax-wrapper">
    <header class="remax-header">
      <div class="header-content">
        <img src="/img/LogoBalao.png" alt="RE/MAX" class="remax-logo" />
        <div class="brand-text">
          <span class="remax-red">RE/MAX</span> <span class="remax-blue">Litorânea</span>
          <p class="subtitle">Gerador de Documentos Jurídicos</p>
        </div>
      </div>
    </header>

    <main class="container">
      <section class="card selector-card">
        <h3 class="remax-black">Selecione o Tipo de Contrato:</h3>
        <select v-model="tipoSelecionado">
          <option value="aluguel">Contrato de Aluguel</option>
          <option value="representacao">Contrato de Representação</option>
          <option value="compra_venda">Contrato de Compra e Venda</option>
          <option value="aditivo_compra">Aditivo à Compra e Venda</option>
          <option value="aditivo_aluguel">Aditivo ao Aluguel</option>
        </select>
      </section>

      <div v-if="tipoSelecionado === 'aluguel'" class="form-grid fade-in">

          <section class="card full-width">
          <!-- <h3 class="remax-blue">Dados Corretor</h3> -->
          <h3 class="remax-black">Dados Corretor</h3>
          <div class="flex-row">
            <input v-model="form.nomeCorretor" placeholder="Nome do Corretor" class="flex-2" />
            <input v-model="form.cpfCorretor" placeholder="CPF do Corretor" class="flex-1" />
            <input v-model="form.creciCorretor" placeholder="CRECI/BA" class="flex-min" />
          </div>
          <input
            v-model="form.dataAssinatura"
            placeholder="Local e Data (Ex: Camaçari/BA, 26 de Março de 2026)"
            style="margin-top: 15px"
          />
        </section>

        <section class="card">
          <h3 class="remax-red"> <i class="fi fi-rr-user"></i> Dados do Locador</h3>
          <div class="fields-stack">
            <input v-model="form.nomeLocador" placeholder="Nome Completo" />
            <input v-model="form.nacionalidadeLocador" placeholder="Nacionalidade" />
            <input v-model="form.estadoCivilLocador" placeholder="Estado Civil" />
            <input v-model="form.profissaoLocador" placeholder="Profissão" />
            <input v-model="form.cpfLocador" placeholder="CPF" />
            <div class="input-row">
              <input v-model="form.rgLocador" placeholder="RG" />
              <input v-model="form.ufRgLocador" placeholder="UF" style="max-width: 60px" />
            </div>
            <input v-model="form.enderecoLocador" placeholder="Endereço de Residência" />
            <input v-model="form.telefoneLocador" placeholder="Telefone" />
            <input v-model="form.emailLocador" placeholder="E-mail" />
          </div>
        </section>

        <section class="card">
          <h3 class="remax-blue"> <i class="fi fi-rr-user"></i> Dados do Locatário</h3>
          <div class="fields-stack">
            <input v-model="form.nomeLocatario" placeholder="Nome Completo" />
            <input v-model="form.nacionalidadeLocataria" placeholder="Nacionalidade" />
            <input v-model="form.estadoCivilLocataria" placeholder="Estado Civil" />
            <input v-model="form.profissaoLocataria" placeholder="Profissão" />
            <input v-model="form.cpfLocatario" placeholder="CPF" />
            <div class="input-row">
              <input v-model="form.rgLocataria" placeholder="RG" />
              <input v-model="form.ufRgLocataria" placeholder="UF" style="max-width: 60px" />
            </div>
            <input v-model="form.enderecoLocataria" placeholder="Endereço de Residência" />
            <input v-model="form.telefoneLocataria" placeholder="Telefone" />
            <input v-model="form.emailLocataria" placeholder="E-mail" />
          </div>
        </section>

        <section class="card full-width">
          <h3 class="remax-red"> <i class="fi fi-rr-home"></i> Dados do Imóvel e Financeiro</h3>
          <div class="flex-row">
            <div class="flex-1">
              <label>Tipo de Imóvel</label>
              <select v-model="form.tipoImovel">
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Ponto Comercial">Ponto Comercial</option>
              </select>
            </div>
            <div class="flex-1">
              <label>Início da Locação</label>
              <input type="date" v-model="form.dataInicioLocacao" />
            </div>
            <div class="flex-min">
              <label>Prazo (Meses)</label>
              <input type="number" v-model.number="form.prazoMeses" />
            </div>
            <div class="flex-1">
              <label>Valor Aluguel (R$)</label>
              <input type="text" v-model="form.valorAluguel" placeholder="0,00" />
            </div>
            <div class="flex-min">
              <label>Dia Pagamento</label>
              <input type="number" v-model.number="form.diaPagamento" placeholder="Ex: 5" />
            </div>
          </div>

          <input
            v-model="form.enderecoImovel"
            placeholder="Endereço Completo do Imóvel Locado"
            style="margin-top: 15px"
          />

          <div class="flex-row" style="margin-top: 15px">
            <input v-model="form.contratoCoelba" placeholder="Nº Contrato COELBA" class="flex-1" />
            <input v-model="form.contratoEmbasa" placeholder="Nº Contrato EMBASA" class="flex-1" />
          </div>

          <label style="display: block; margin-top: 15px"
            >Descrição da Mobília / Estado do Imóvel</label
          >
          <textarea
            v-model="form.descricaoMobiliada"
            rows="3"
            placeholder="Ex: Sofá 3 lugares, ar-condicionado na suíte..."
          ></textarea>
        </section>



        <button class="btn-generate full-width" @click="handleGerar">
          GERAR CONTRATO COMPLETO (DOCX)
        </button>
      </div>

      <div v-else class="card unavailable-msg">
        <div class="msg-content">
          <span class="warning-icon">⚠️</span>
          <h2>O MODELO SELECIONADO AINDA NÃO ESTÁ DISPONÍVEL.</h2>
          <p>Por favor, selecione "Contrato de Aluguel" para gerar o documento.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// Importação do CSS e da Lógica Modular
import './styles/remax.css'
import { processarAluguel } from './logic/aluguel.js'

export default {
  name: 'App',
  data() {
    return {
      tipoSelecionado: 'aluguel', // Padrão solicitado
      form: {
        // Dados do Locador
        nomeLocador: '',
        nacionalidadeLocador: '',
        estadoCivilLocador: '',
        profissaoLocador: '',
        cpfLocador: '',
        rgLocador: '',
        ufRgLocador: '',
        enderecoLocador: '',
        telefoneLocador: '',
        emailLocador: '',

        // Dados do Locatário
        nomeLocatario: '',
        nacionalidadeLocataria: '',
        estadoCivilLocataria: '',
        profissaoLocataria: '',
        cpfLocatario: '',
        rgLocataria: '',
        ufRgLocataria: '',
        enderecoLocataria: '',
        telefoneLocataria: '',
        emailLocataria: '',

        // Imóvel e Financeiro
        tipoImovel: 'Casa',
        dataInicioLocacao: '',
        dataInicioLocacao: '',
        prazoMeses: 30,
        valorAluguel: '',
        diaPagamento: '',
        contratoCoelba: '',
        contratoEmbasa: '',
        descricaoMobiliada: '',
        enderecoImovel: '',

        // Corretor e Assinatura
        nomeCorretor: '',
        cpfCorretor: '',
        creciCorretor: '',
        dataAssinatura: '',
      },
    }
  },
  methods: {
    async handleGerar() {
      // Validação básica para evitar erros nas assinaturas e cálculos
      if (!this.form.nomeLocatario || this.form.valorAluguel === '') {
        alert('O Nome do Locatário e o Valor do Aluguel são campos obrigatórios.')
        return
      }

      try {
        await processarAluguel(this.form)
      } catch (error) {
        console.error('Erro ao processar documento:', error)
        alert('Ocorreu um erro técnico. Verifique se o arquivo modelo.docx está na pasta public.')
      }
    },
  },
}
</script>
