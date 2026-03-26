<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style> -->

<template>
  <div id="app">
    <div class="container">
      <h1>Gerador de Documentos</h1>

      <div class="input-group">
        <label for="texto">Digite o texto para o documento:</label>
        <textarea
          id="texto"
          v-model="textoUsuario"
          placeholder="Escreva aqui o conteúdo que será inserido entre o cabeçalho e o rodapé..."
          rows="10"
        ></textarea>
      </div>

      <button @click="gerarDocumento" :disabled="!textoUsuario">GERAR DOCUMENTO</button>
    </div>
  </div>
</template>

<script>
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { saveAs } from 'file-saver'

export default {
  name: 'App',
  data() {
    return {
      textoUsuario: '',
    }
  },
  methods: {
    async gerarDocumento() {
      try {
        // 1. Carregar o arquivo modelo da pasta public
        const response = await fetch('/modelo.docx')
        const content = await response.arrayBuffer()

        // 2. Inicializar o PizZip com o conteúdo do arquivo
        const zip = new PizZip(content)

        // 3. Configurar o Docxtemplater
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        })

        // 4. Substituir a tag {conteudo} pelo texto do textarea
        doc.setData({
          conteudo: this.textoUsuario,
        })

        // 5. Renderizar o documento (aplicar as mudanças)
        doc.render()

        // 6. Gerar o blob do arquivo final
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })

        // 7. Disparar o download para o usuário
        saveAs(out, 'documento_gerado.docx')
      } catch (error) {
        console.error('Erro ao gerar documento:', error)
        alert(
          'Ocorreu um erro ao processar o arquivo. Verifique se o modelo.docx está na pasta public.',
        )
      }
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

button {
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #3aa876;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
</style>
