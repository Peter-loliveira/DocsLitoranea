<template>
  <div class="remax-wrapper">
    <header class="remax-header">
      <img src="/img/LogoBalao.png" alt="RE/MAX" class="remax-logo" />
      <div class="header-content">
        <div class="brand-text">
          <span class="remax-red">RE/MAX</span> <span class="remax-blue">Litorânea</span>
          <p class="subtitle">Gerador de Documentos Imobiliários</p>
        </div>
      </div>
    </header>

    <main class="container">
      <section class="card selector-card">
        <div class="flex-row" style="align-items: flex-end">
          <div class="flex-2">
            <label class="remax-black">Tipo de Contrato:</label>
            <select v-model="tipoSelecionado">
              <option value="aluguel">Contrato de Aluguel</option>
              <option value="representacao">Contrato de Representação</option>
              <option value="compra_venda">Contrato de Compra e Venda</option>
              <option value="aditivo_compra">Aditivo à Compra e Venda</option>
              <option value="aditivo_aluguel">Aditivo ao Aluguel</option>
            </select>
          </div>

          <div class="flex-2">
            <label class="remax-black">Corretor Responsável:</label>
            <select v-model="corretorSelecionado" @change="atualizarDadosCorretor">
              <option :value="null" disabled>Selecione o Corretor</option>
              <option v-for="corretor in corretores" :key="corretor.creci" :value="corretor">
                {{ corretor.nome }}
              </option>
            </select>
          </div>

          <div class="flex-1">
            <label class="remax-black">Data de Assinatura:</label>
            <input type="date" v-model="form.dataAssinatura" />
          </div>
        </div>
      </section>

      <div v-if="tipoSelecionado === 'aluguel'" class="form-grid fade-in">
        <section class="card">
          <h3 class="remax-red"><i class="fi fi-rr-user"></i> Dados do Locador</h3>
          <div class="fields-stack">
            <input v-model="form.nomeLocador" placeholder="Nome Completo" />
            <div class="flex-row" style="margin-bottom: 12px">
              <input
                v-model="form.nacionalidadeLocador"
                placeholder="Nacionalidade"
                class="flex-1"
              />
              <select v-model="form.estadoCivilLocador" class="flex-1">
                <option value="" disabled selected>Estado Civil</option>
                <option v-for="estado in estadosCivis" :key="estado" :value="estado">
                  {{ estado }}
                </option>
              </select>
            </div>
            <input v-model="form.profissaoLocador" placeholder="Profissão" />
            <input v-model="form.cpfLocador" placeholder="CPF" />
            <div class="flex-row" style="margin-bottom: 12px">
              <input v-model="form.rgLocador" placeholder="RG" class="flex-2" />
              <select v-model="form.ufRgLocador" class="flex-min">
                <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
              </select>
            </div>
            <input v-model="form.enderecoLocador" placeholder="Endereço de Residência" />
            <input v-model="form.telefoneLocador" placeholder="Telefone" />
            <input v-model="form.emailLocador" placeholder="E-mail" />
          </div>
        </section>

        <section class="card">
          <h3 class="remax-blue"><i class="fi fi-rr-user"></i> Dados do Locatário</h3>
          <div class="fields-stack">
            <input v-model="form.nomeLocatario" placeholder="Nome Completo" />
            <div class="flex-row" style="margin-bottom: 12px">
              <input
                v-model="form.nacionalidadeLocataria"
                placeholder="Nacionalidade"
                class="flex-1"
              />
              <select v-model="form.estadoCivilLocataria" class="flex-1">
                <option value="" disabled selected>Estado Civil</option>
                <option v-for="estado in estadosCivis" :key="estado" :value="estado">
                  {{ estado }}
                </option>
              </select>
            </div>
            <input v-model="form.profissaoLocataria" placeholder="Profissão" />
            <input v-model="form.cpfLocatario" placeholder="CPF" />
            <div class="flex-row" style="margin-bottom: 12px">
              <input v-model="form.rgLocataria" placeholder="RG" class="flex-2" />
              <select v-model="form.ufRgLocataria" class="flex-min">
                <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
              </select>
            </div>
            <input v-model="form.enderecoLocataria" placeholder="Endereço de Residência" />
            <input v-model="form.telefoneLocataria" placeholder="Telefone" />
            <input v-model="form.emailLocataria" placeholder="E-mail" />
          </div>
        </section>

        <section class="card">
          <h3 class="remax-red"><i class="fi fi-rr-home"></i> Dados do Imóvel e Financeiro</h3>
          <div class="card">
            <label class="remax-black">Forma de Garantia:</label>
            <div class="flex-row" style="gap: 10px; margin-bottom: 15px">
              <button
                type="button"
                :class="['btn-garantia', form.tipoGarantia === 'seguro' ? 'active-seguro' : '']"
                @click="form.tipoGarantia = 'seguro'"
              >
                SEGURO LOCATÍCIO
              </button>
              <button
                type="button"
                :class="['btn-garantia', form.tipoGarantia === 'caucao' ? 'active-caucao' : '']"
                @click="form.tipoGarantia = 'caucao'"
              >
                CAUÇÃO
              </button>
            </div>

            <div
              v-if="form.tipoGarantia === 'caucao'"
              class="flex-row animate-fade-in"
              style="margin-top: 10px"
            >
              <div style="width: 150px">
                <label>Meses de Aluguel</label>
                <input type="number" v-model="form.mesesCaucao" min="1" max="3" />
              </div>
            </div>
          </div>
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

        <button class="btn-generate" @click="handleGerar">GERAR CONTRATO COMPLETO (DOCX)</button>
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
import './styles/remax.css'
import { processarAluguel } from './logic/aluguel.js'

export default {
  name: 'App',
  data() {
    return {
      tipoSelecionado: 'aluguel',
      corretorSelecionado: null, // Novo estado para o seletor
      corretores: [
        { nome: 'Peter Lange Oliveira', creci: '31687', cpf: 'xxx.xxx.xxx-xx' },
        { nome: 'Alan Souza da Silva', creci: '35223', cpf: 'xxx.xxx.xxx-xx' },
        { nome: 'Victor Augusto Dos Santos Soares', creci: '8905', cpf: 'xxx.xxx.xxx-xx' },
        { nome: 'Luciano Braz dos Santos Rodrigues', creci: '11343', cpf: 'xxx.xxx.xxx-xx' },
        { nome: 'Chimeny Santos Chiacchiaretta', creci: '23278', cpf: 'xxx.xxx.xxx-xx' },
      ].sort((a, b) => a.nome.localeCompare(b.nome)), // Ordenação alfabética automática
      ufs: [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
      ],
      estadosCivis: [
        'Solteiro(a)',
        'Casado(a)',
        'Separado(a) (judicialmente)',
        'Divorciado(a)',
        'Viúvo(a)',
        'União Estável',
      ],
      form: {
        nomeLocador: '',
        nacionalidadeLocador: 'Brasileiro(a)',
        estadoCivilLocador: '',
        profissaoLocador: '',
        cpfLocador: '',
        rgLocador: '',
        ufRgLocador: 'BA',
        enderecoLocador: '',
        telefoneLocador: '',
        emailLocador: '',
        nomeLocatario: '',
        nacionalidadeLocataria: 'Brasileiro(a)',
        estadoCivilLocataria: '',
        profissaoLocataria: '',
        cpfLocatario: '',
        rgLocataria: '',
        ufRgLocataria: 'BA',
        enderecoLocataria: '',
        telefoneLocataria: '',
        emailLocataria: '',
        tipoImovel: 'Casa',
        dataInicioLocacao: '',
        prazoMeses: 30,
        valorAluguel: '',
        diaPagamento: '',
        contratoCoelba: '',
        contratoEmbasa: '',
        descricaoMobiliada: '',
        enderecoImovel: '',
        dataAssinatura: '',
        nomeCorretor: '',
        creciCorretor: '',
        cpfCorretor: '',
        tipoGarantia: 'seguro', // Valor padrão
        mesesCaucao: 3, // Valor padrão sugerido
      },
    }
  },
  methods: {
    // Nova função para atualizar o formulário ao selecionar o corretor
    atualizarDadosCorretor() {
      if (this.corretorSelecionado) {
        this.form.nomeCorretor = this.corretorSelecionado.nome
        this.form.creciCorretor = this.corretorSelecionado.creci
        this.form.cpfCorretor = this.corretorSelecionado.cpf
      }
    },

    async handleGerar() {
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
