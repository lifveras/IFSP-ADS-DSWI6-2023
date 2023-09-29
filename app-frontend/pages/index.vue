<template>
  <div>
    <!-- Navegação -->
    <v-app-bar color="primary">
      <v-app-bar-title>IFalmoxarifado</v-app-bar-title>

      <v-btn @click="openCardView()">
        Card View
      </v-btn>

      <v-btn @click="openTabView()">
        Table View
      </v-btn>

      <!-- Modal para inserir novo -->
      <v-dialog id="modal-novo-item" variant="tonal">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" text="Novo Item"> </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="CRIAR NOVO">
            <v-container>
              <v-form v-on:submit="createNewItem">
                <v-container>

                </v-container>
                <label class="mr-sm-2" for="input-patrimonio">Patrimônio:</label>
                <v-text-field id="input-patrimonio" v-model="novoItem.patrimonio" class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Ex: IFSP-BRA-001"></v-text-field>

                <label class="mr-sm-2" for="input-descricao">Descrição:</label>
                <v-text-field id="input-descricao" v-model="novoItem.descricao" class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Descrição do item"></v-text-field>

                <label class="mr-sm-2" for="item-type">Tipo de item:</label>
                <v-text-field id="item-type" v-bind:options="listaTiposItens" v-bind:value="null"
                  v-model="novoItem.itemTipo">
                </v-text-field>

                <label class="mr-sm-2" for="input-data">Data de aquisição:</label>
                <b-form-datepicker id="input-data" v-model="novoItem.dataAquisicao" class="mb-2">
                </b-form-datepicker>

                <label class="mr-sm-2" for="input-preco">Preço de aquisição</label>
                <v-text-field id="input-preco" v-model="novoItem.precoAquisicao" class="mb-2 mr-sm-2 mb-sm-0"
                  placeholde="0.00"></v-text-field>

                <label class="mr-sm-2" for="input-departamento">Departamento</label>
                <v-text-field id="input-departamento" v-bind:options="departamentos" v-model="novoItem.departamento"
                  v-bind:value="null">
                </v-text-field>

                <label class="mr-sm-2" for="input-responsavel">Responsável</label>
                <v-text-field v-model="novoItem.responsavel" id="input-responsavel" class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Nome do Servidor"></v-text-field>

                <v-row>
                  <v-col>
                    <v-btn type="submit" color="blue" variant="elevated" @click="show = !show">Criar</v-btn>
                  </v-col>
                  <v-col>
                    <v-btn type="reset" color="red" variant="elevated">Limpar</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card>
        </template>
      </v-dialog>

      <!-- <v-toolbar>
        <b-nav-form>
        <b-form-input size="sm" v-model="itemSearch" class="sr-sm-3" placeholder="Busca por descrição"></b-form-input>
      </b-nav-form>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav right>
          <b-nav-item @click="openCardView()">
            Card View
          </b-nav-item>
          <b-nav-item @click="openTabView()">
            Table View
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>

      <b-button v-b-modal.modal-novo-item variant="dark">Novo Item</b-button>
      </v-toolbar>       -->
    </v-app-bar>

    <!-- Conteúdo principal da página -->
    <v-main>
      <!-- Tabela do iventário -->
      <div class="invent-table" v-if="tableView">
        <v-table id="items-table">
          <!-- <v-table id="items-table" striped hover :per-page="perPage" :current-page="currentPage" v-bind:items="items"> -->
          <!-- v-bind:items="items | filterSearch(itemSearch)"> -->
          <thead>
            <tr>
              <th>Patrimonio</th>
              <th>Descricao</th>
              <th>Item Tipo</th>
              <th>Data de Aquisição</th>
              <th>Responsavel</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in items" :key="item.nome">
              <td>{{ item.patrimonio }}</td>
              <td>{{ item.descricao }}</td>
              <td>{{ item.itemTipo.nome }}</td>
              <td>{{ item.dataAquisicao }}</td>
              <td>{{ item.responsavel.nome }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- <b-pagination align="center" v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
          aria-controls="items-table">
        </b-pagination> -->
      </div>

      <!-- Cards do iventário -->
      <div class="invent-cards" v-if="cardView">
        <v-container>
          <v-row>
            <v-col v-for="item in items" :key="item.patrimonio">
              <!-- Dentro do v-for, o filtro deve ser invocado como um método -->
              <!-- <card-item v-bind:key="item.patrimonio" v-for="item in filterSearch(items, itemSearch)" -->
              <card-item v-bind:key="item.patrimonio" v-for="item in items" v-bind:item="item">
              </card-item>
            </v-col>
          </v-row>
        </v-container>

      </div>
    </v-main>
  </div>
</template>

<script setup lang="js">
// import {} from 'vue';
// import CardItem from '../components/CardItem.vue'
//Executado quando a instância do Vue estiver construída
// async asyncData({ $axios }) {
//   let items, totalRows;
//   try {
//     const response = await $axios.$get('patrimonio');
//     items = response;
//     totalRows = items.length;
//   } catch (ex) {
//     console.log(ex);
//   }
//   return { items, totalRows }
// }, 
// ===== DATA ======
const show = ref(false);
const tableView = ref(true);
const cardView = ref(false);
const itemSearch = ref("ok");
const currentPage = ref(1);
const totalRows = ref(0);
const perPage = ref(3);
const url = ref('');
const items = reactive([
  {
    patrimonio: "IFSP-BR-001",
    descricao: "Armário de arquivos",
    itemTipo: {
      nome: "Escritorio",
      descricao: "Materiais utilizados em escritório",
      imagem:
        "https://images.unsplash.com/photo-1524820801657-fd59673fbb05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1144&q=80",
    },
    dataAquisicao: "2016-08-29T09=12=33.001Z",
    precoAquisicao: 999.99,
    departamento: "Informática",
    responsavel: {
      prontuario: "BP0910292",
      nome: "Luiz Gustavo Véras",
      telefone: "408-867-5309",
      email: "gustavo_veras@ifsp.edu.br",
    }
  },
  {
    patrimonio: "IFSP-BR-001",
    descricao: "Armário de arquivos",
    itemTipo: {
      nome: "Escritorio",
      descricao: "Materiais utilizados em escritório",
      imagem:
        "https://images.unsplash.com/photo-1524820801657-fd59673fbb05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1144&q=80",
    },
    dataAquisicao: "2016-08-29T09=12=33.001Z",
    precoAquisicao: 999.99,
    departamento: "Informática",
    responsavel: {
      prontuario: "BP0910292",
      nome: "Luiz Gustavo Véras",
      telefone: "408-867-5309",
      email: "gustavo_veras@ifsp.edu.br",
    }
  },
  {
    patrimonio: "IFSP-BR-001",
    descricao: "Armário de arquivos",
    itemTipo: {
      nome: "Escritorio",
      descricao: "Materiais utilizados em escritório",
      imagem:
        "https://images.unsplash.com/photo-1524820801657-fd59673fbb05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1144&q=80",
    },
    dataAquisicao: "2016-08-29T09=12=33.001Z",
    precoAquisicao: 999.99,
    departamento: "Informática",
    responsavel: {
      prontuario: "BP0910292",
      nome: "Luiz Gustavo Véras",
      telefone: "408-867-5309",
      email: "gustavo_veras@ifsp.edu.br",
    }
  },
]);
const listaTiposItens = reactive([
  { text: "Escolha um:", value: null },
  "Escritório",
  "Sala de Aula",
  "Infraestrutura"
]);
const departamentos = reactive([
  { text: "Escolha um:", value: null },
  "CAE",
  "Informática",
  "Almoxarifado"
]);
const novoItem = reactive({
  patrimonio: "",
  descricao: "",
  itemTipo: "",
  dataAquisicao: null,
  precoAquisicao: 0.00,
  departamento: "",
  responsavel: ""
});

// ===== METHODS ======
const createNewItem = function (event) {
  event.preventDefault();
  console.log(JSON.stringify(this.novoItem));
  // A instância do axios disponível no Nuxt.js é acessível
  // por this.$axios.
  // Veja mais sobre em https://axios.nuxtjs.org/usage
  this.$axios
    .$post("patrimonio", this.novoItem)
    .then((response) => {
      console.log('Resposta do servidor obtida');
      // Acessa o objeto que controla os modais e esconde aquele que você passar o id.
      this.$bvModal.hide('modal-novo-item');
      this.show = false;
      this.updateItemList();
    })
    .catch((error) => {
      console.error('Não foi possível criar um novo item');
      console.log(error);
      this.$bvModal.hide('modal-novo-item');
      this.show = false;
    });
};

const openCardView = function () {
  // Use o this para referenciar as propriedades definidas acima;
  this.cardView = true;
  this.tableView = false;
};

const openTabView = function () {
  this.cardView = false;
  this.tableView = true;
}

const updateItemList = function () {
  // A instância do axios disponível no Nuxt.js é acessível
  // por this.$axios.
  // Veja mais sobre em https://axios.nuxtjs.org/usage
  this.$axios.$get("patrimonio").then((response) => {
    this.items = response;
    this.totalRows = this.items.length
  })
};

const removeSelectedItem = function (item) {
  // A instância do axios disponível no Nuxt.js é acessível
  // por this.$axios.
  // Veja mais sobre em https://axios.nuxtjs.org/usage
  this.$axios.$delete(`patrimonio/${patrimonioId}`).then((response) => {
    let msg = response.data
    alert(msg);
    this.updateItemList();
  });
};


// const filterSearch = function (items, itemSearch) {
//   if (itemSearch.length > 0) {
//     return items.filter((item) =>
//       item.itemTipo.descricao.toLowerCase().includes(itemSearch.toLowerCase())
//     )
//   } else {
//     return items
//   }
// };
</script>

<style scoped>
.invent-table {
  padding: 0 100px;
  margin: 0 auto;
}

.invent-cards {
  padding: 0px 100px;
  margin: 20px auto;
}
</style>
