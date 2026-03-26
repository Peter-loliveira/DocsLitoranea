<template>
  <div id="app" class="remax-wrapper">
    <header class="remax-header">
      <div class="logo-area">
        <span class="remax-red">RE/MAX</span>
        <span class="remax-blue"> Litorânea</span>
      </div>
      <p>Sistema de Geração de Documentos</p>
    </header>

    <main class="container">
      <div class="form-grid">
        <section class="card">
          <h2 class="section-title red-border">Dados da Locadora</h2>
          <div class="input-group">
            <input v-model="form.nomeLocadora" placeholder="Nome Completo" />
            <input v-model="form.cpfLocadora" placeholder="CPF" />
            <input v-model="form.rgLocadora" placeholder="RG" />
            <input v-model="form.enderecoLocadora" placeholder="Endereço Completo" />
          </div>
        </section>

        <section class="card">
          <h2 class="section-title blue-border">Dados da Locatária</h2>
          <div class="input-group">
            <input v-model="form.nomeLocataria" placeholder="Nome Completo" />
            <input v-model="form.cpfLocataria" placeholder="CPF" />
            <input v-model="form.rgLocataria" placeholder="RG" />
            <input v-model="form.enderecoLocataria" placeholder="Endereço Completo" />
          </div>
        </section>

        <section class="card full-width">
          <h2 class="section-title blue-border">Dados do Corretor</h2>
          <div class="input-row">
            <input v-model="form.nomeCorretor" placeholder="Nome do Corretor" />
            <input v-model="form.creciCorretor" placeholder="CRECI-BA" />
          </div>
        </section>

        <section class="card full-width">
          <h2 class="section-title red-border">Conteúdo do Documento</h2>
          <textarea
            v-model="form.textoCorpo"
            placeholder="Digite aqui o texto que será inserido entre o cabeçalho e o rodapé..."
            rows="8"
          ></textarea>
        </section>
      </div>

      <button class="btn-generate" @click="gerarDocumento">GERAR DOCUMENTO DOCX</button>
    </main>
  </div>
</template>

<script>
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { saveAs } from 'file-saver'

export default {
  data() {
    return {
      // Campos iniciam totalmente vazios conforme solicitado
      form: {
        nomeLocadora: '',
        cpfLocadora: '',
        rgLocadora: '',
        enderecoLocadora: '',
        nomeLocataria: '',
        cpfLocataria: '',
        rgLocataria: '',
        enderecoLocataria: '',
        nomeCorretor: '',
        creciCorretor: '',
        textoCorpo: '',
      },
    }
  },
  methods: {
    async gerarDocumento() {
      if (!this.form.nomeLocataria || !this.form.textoCorpo) {
        alert('Por favor, preencha ao menos o nome da locatária e o conteúdo.')
        return
      }

      try {
        const response = await fetch('/modelo.docx')
        const content = await response.arrayBuffer()
        const zip = new PizZip(content)

        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        })

        doc.setData(this.form)
        doc.render()

        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })

        saveAs(out, `Documento_${this.form.nomeLocataria.replace(/\s+/g, '_')}.docx`)
      } catch (error) {
        console.error(error)
        alert('Erro ao processar o arquivo modelo.')
      }
    },
  },
}
</script>

<style scoped>
/* Identidade Visual RE/MAX */
:root {
  --remax-blue: #003da5;
  --remax-red: #e11b22;
  --remax-grey: #f4f4f4;
}

.remax-wrapper {
  background-color: #f4f4f4;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.remax-header {
  background-color: white;
  padding: 20px;
  text-align: center;
  border-bottom: 5px solid #003da5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo-area {
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
}

.remax-red {
  color: #e11b22;
}
.remax-blue {
  color: #003da5;
}

.container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.full-width {
  grid-column: span 2;
}

.section-title {
  font-size: 1.1rem;
  margin-bottom: 15px;
  padding-bottom: 5px;
  text-transform: uppercase;
  color: #333;
}

.red-border {
  border-bottom: 3px solid #e11b22;
}
.blue-border {
  border-bottom: 3px solid #003da5;
}

.input-group input,
.input-row input,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-row {
  display: flex;
  gap: 10px;
}

textarea {
  resize: vertical;
}

.btn-generate {
  display: block;
  width: 100%;
  margin-top: 30px;
  padding: 20px;
  background-color: #003da5;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-generate:hover {
  background-color: #e11b22;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>
