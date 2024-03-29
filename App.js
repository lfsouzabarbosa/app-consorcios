const AdminJS = require('adminjs')
const AdminJSExpressjs = require('@adminjs/express')
const axios = require('axios');

const bodyParser = require('body-parser')

const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const app = express()
const apiTK = express()
const apiExport = express()
const apiCotas = express()
const apiEmbracon = express()
const fs = require('fs');

const AdminJSMongoose = require('@adminjs/mongoose')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
let tokenLocal;



const run = async () => {
  await mongoose.connect('mongodb+srv://appconsorcio:40464586828@cluster0.jvr8z.mongodb.net/usuarios?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
run();

const User = mongoose.model('User', {
  password: { type: String, required: true },
  email: { type: String, required: true },
  acesso: { type: String, enum: ['Admin', 'Operacional'], required: true },
})


const podeEditarUsuarios = ({ currentAdmin }) => currentAdmin && currentAdmin.acesso === 'Admin'

AdminJS.registerAdapter(AdminJSMongoose)

const adminJS = new AdminJS({
  rootPath: '/admin',

  resources: [
    {
      resource: User,
      options: {
        parent: 'Configurações',
        properties: {
          password: {
            isVisible: false,
          },
          senha: {
            type: 'password',
            isVisible: {
              list: false, edit: true, filter: false, show: false,
            },
          },
          _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
          },
        },
        actions: {
          edit: { isAccessible: podeEditarUsuarios },
          delete: { isAccessible: podeEditarUsuarios },
          new: { isAccessible: podeEditarUsuarios },
          show: { isAccessible: podeEditarUsuarios },
          list: { isAccessible: podeEditarUsuarios },
          new: {
            before: async (request) => {
              if (request.payload.senha) {
                request.payload = {
                  ...request.payload,
                  password: await bcrypt.hash(request.payload.senha, 10),
                  senha: undefined,
                }
              }
              return request
            },
          },
        }

      }
    }
  ],



   pages: {
     Ademicon: {
       component: AdminJS.bundle('./src/components/ademicon'),
     },
     Scania: {
      component: AdminJS.bundle('./src/components/scania'),
    }
   },

  branding: {
    companyName: 'Consórcios',
    logo: 'https://www.r7consorcios.com.br/assets/img/home.png',
    //logo: 'https://www.quisto.com.br/wp-content/uploads/2021/05/quisto-seguro-consorcio-banner-1-1024x576.png',
    softwareBrothers: false,
  },
    dashboard: {
    component: AdminJS.bundle('./src/components/dashboard'),
  },
  locale: {
    translations: {
      actions: {
        new: 'Registrar',
        edit: 'Editar',
        show: 'Mostrar',
        delete: 'Deletar',
        bulkDelete: 'Deletar tudo',
        list: '',
      },
      buttons: {
        save: 'Salvar',
        addNewItem: 'Adicionar Novo Item',
        filter: 'Filtro',
        applyChanges: 'Aplicar Mudanças',
        resetFilter: 'Limpar Filtros',
        confirmRemovalMany: 'Confirmar a remoção de {{count}} registro(s)',
        confirmRemovalMany_plural: 'Confirmar a remoção de {{count}} registros',
        logout: 'Sair',
        login: 'Entrar',
        seeTheDocumentation: 'Ver: <1>a documentação</1>',
        createFirstRecord: 'Criar primeiro registro',
      },
      labels: {
        navigation: '',
        Logout: 'Sair',
        Login: 'Entrar',
        pages: '',
        selectedRecords: 'Selecionados ({{selected}})',
        filters: 'Filtros',
        adminVersion: 'Admin: {{version}}',
        appVersion: 'App: {{version}}',
        loginWelcome: 'Bem vindo',
        Product: "Produtos",
        myFirstDatabase: 'Configurações'
      },
      messages: {
        successfullyBulkDeleted: 'removido(s) {{count}} registro(s)',
        successfullyBulkDeleted_plural: 'removidos {{count}} registros',
        successfullyDeleted: 'Registro deletado',
        successfullyUpdated: 'Registro atualizado',
        thereWereValidationErrors: 'Erros de validação, cheque-os abaixo',
        forbiddenError: 'Você não pode executar a ação {{actionName}} em {{resourceId}}',
        anyForbiddenError: 'Você não pode executar esta ação',
        successfullyCreated: 'Criado novo registro',
        bulkDeleteError: 'Houve um erro deletando registros, cheque o console para saber mais.',
        errorFetchingRecords: 'Houve um erro buscando registros, cheque o console para saber mais.',
        errorFetchingRecord: 'Houve um erro buscando record, cheque o console para saber mais.',
        noRecordsSelected: 'Você não selecionou nenhum dos registros',
        theseRecordsWillBeRemoved: 'O(s) seguinte(s) registro(s) vai(ão) ser deletado(s)',
        theseRecordsWillBeRemoved_plural: 'Os seguintes registros vão ser deletados',
        pickSomeFirstToRemove: 'Para deletar registros, você precisa selecionar primeiro',
        error404Resource: 'Recurso de id: {{resourceId}} não encontrado',
        error404Action: 'Recurso de id: {{resourceId}} não tem nenhuma ação nomeada de: {{actionName}}',
        error404Record: 'Recurso de id: {{resourceId}} não tem nenhum registro com o ID: {{recordId}}',
        seeConsoleForMore: 'Veja o console de desenvolvimento para mais detalhes...',
        noActionComponent: 'Você deve implementar o componente de ação para a sua Ação',
        noRecordsInResource: '',
        noRecords: 'Sem registros',
        confirmDelete: 'Tem certeza de que deseja remover este item?',
        welcomeOnBoard_title: 'Bem-vindo a bordo!',
        welcomeOnBoard_subtitle: 'Agora você é um de nós! Preparamos algumas dicas para você começar:',
        loginWelcome: '',
        addingResources_title: 'Adicionando recursos',
        addingResources_subtitle: 'Como adicionar novos recursos à barra lateral',
        customizeResources_title: 'Recursos Personalizados',
        customizeResources_subtitle: 'Definindo comportamento, adicionando propriedades e mais ...',
        customizeActions_title: 'Personalizar Ações',
        customizeActions_subtitle: 'Modificando ações existentes e adicionando novas',
        writeOwnComponents_title: 'Escreva os Componentes',
        writeOwnComponents_subtitle: 'Como modificar a aparência do AdminJS',
        customDashboard_title: 'Painel Personalizado',
        customDashboard_subtitle: 'Como modificar esta visualização e adicionar novas páginas na barra lateral',
        roleBasedAccess_title: 'Controle de acesso baseado em função',
        roleBasedAccess_subtitle: 'Crie funções de usuário e permissões no AdminJS',
        community_title: 'Junte-se à comunidade slack',
        community_subtitle: 'Fale com os criadores do AdminJS e outros usuários AdminJS',
        foundBug_title: 'Encontrou um bug? precisa de melhorias?',
        foundBug_subtitle: 'Levantar um problema em nosso repositório GitHub',
        needMoreSolutions_title: 'Precisa de soluções mais avançadas?',
        needMoreSolutions_subtitle: 'Estamos aqui para fornecer a você um belo design de UX/UI e um software feito sob medida com base (não apenas) no AdminJS',
        invalidCredentials: 'Email e/ou password errados',
      }
    }
  }
})

//const router = AdminJSExpressjs.buildRouter(adminJS)
const router = AdminJSExpressjs.buildAuthenticatedRouter(adminJS, {
  authenticate: async (email, senha) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(senha, user.password)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})


/*
const router = AdminJSExpressjs.buildAuthenticatedRouter(adminJS, {
  authenticate: async (email, senha) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(senha, user.password)
      if (matched) {
        return user
      } 
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})
*/

app.use(adminJS.options.rootPath, router)

apiTK.use(morgan('dev'))
apiTK.use(bodyParser.urlencoded({ extended: false }))
apiTK.use(express.json())
apiTK.use(cors())

apiExport.use(morgan('dev'))
apiExport.use(bodyParser.urlencoded({ extended: false }))
apiExport.use(express.json())
apiExport.use(cors())

apiCotas.use(morgan('dev'))
apiCotas.use(bodyParser.urlencoded({ extended: false }))
apiCotas.use(express.json())
apiCotas.use(cors())

apiEmbracon.use(morgan('dev'))
apiEmbracon.use(bodyParser.urlencoded({ extended: false }))
apiEmbracon.use(express.json())
apiEmbracon.use(cors())


app.listen(9999, () => console.log('Sistema rodando localhost:9999/admin'))
apiTK.listen(8081, () => console.log('API pega token rodando localhost:8081'))
apiExport.listen(8082, () => console.log('API exporta token rodando localhost:8082'))
apiEmbracon.listen(8083, () => console.log('API exporta token embracon localhost:8083'))

apiEmbracon.get('/', (req, res) => {
  const cota = req.query.cota
  const tokenRobo = req.query.tokenRobo
  console.log("api token encode", cota)
  const timer = (seconds) => {
    let time = seconds * 3000
    return new Promise(res => setTimeout(res, time))
  }

  async function doSomething() {
    //let tokenEnbracom = "deb6fe32-540d-4701-a296-be568039723d";
    for (let i = cota; i < 10000000; i++) {
      //console.log("Looping... " + i);   \    

      axios({
        method: 'get',
        url: "https://api.embraconnet.com.br/app-cliente/v1/cota/" + i + "?access_token=" + tokenRobo + "&client_id=530f6324-16c7-3e67-b33f-4115e4205ae6",

      }).then(response => {
        console.log(response.data[0].id_cota)
        if (response.data[0].data_entrega_bem == null && response.data[0].data_devolucao == null && response.data[0].data_contemplacao != null && response.data[0].valor_total_pago > 30000 && response.data[0].situacao_cota === "cancelada") {
          console.log("FILTRADA CANCELADA>>", response.data[0].id_cota);
        }
        if (response.data[0].data_entrega_bem == null && response.data[0].data_devolucao == null && response.data[0].data_contemplacao == null && response.data[0].valor_total_pago > 30000 && response.data[0].situacao_cota === "cancelada") {
          console.log("FILTRADA CANCELADA NAO CONTEMPLADA>>", response.data[0].id_cota);
        }
        if (response.data[0].data_entrega_bem == null && response.data[0].data_devolucao == null && response.data[0].data_contemplacao != null && response.data[0].valor_total_pago > 30000 && response.data[0].situacao_cota === "quitada") {
          console.log("FILTRADA QUITADA>>", response.data[0].id_cota);
        }
        if (response.data[0].data_entrega_bem == null && response.data[0].data_devolucao == null && response.data[0].data_contemplacao != null && response.data[0].valor_total_pago > 30000 && response.data[0].situacao_cota === "ativa") {
          console.log("FILTRADA ATIVA>>", response.data[0].id_cota);
        }
        if (response.data[0].data_entrega_bem == null && response.data[0].data_devolucao == null && response.data[0].data_contemplacao == null && response.data[0].valor_total_pago > 30000 && response.data[0].situacao_cota === "ativa") {
          console.log("FILTRADA ATIVA NAO CONTEMPLADA>>", response.data[0].id_cota);
        }
      })

      await timer(2);
    }
  }
  doSomething();

})


apiTK.get('/', (req, res) => {
  const grupo = req.query.grupo
  const cota = req.query.cota
  const documento = req.query.documento
  const contrato = req.query.contrato
  let apiKey;
  let tk;
  let chave;
  const puppeteer = require('puppeteer');
  (async () => {
    const browser = await puppeteer.launch({
      //headless: true,
      args: ["--no-sandbox",
        "--disable-setuid-sandbox"],
      executablePath: '/usr/bin/chromium-browser'
    })
    const page = await browser.newPage();
    await page.goto('https://canalconsorciado.bradesco.com.br/valor-receber');
    await page.waitForSelector('input[name=grupo]');
    await page.type('input[name=grupo]', grupo, { delay: 100 }); // '4830'
    await page.waitForSelector('input[name=cota]');
    await page.type('input[name=cota]', cota, { delay: 100 }); // '23'
    await page.waitForSelector('input[name=inscricaoNacional]');
    await page.type('input[name=inscricaoNacional]', documento, { delay: 100 }); // '51941163653'
    await page.waitForSelector('input[name=numeroContrato]');
    await page.type('input[name=numeroContrato]', contrato, { delay: 100 }); // '109242563'
    await page.click('button[type="submit"]');

    page.on('request', async (request) => {
      //console.log('<<', request.url())
      let url = request.url()
      let dados = request.headers()
      if (url == 'https://canalconsorciado.bradesco.com.br/GatewayAutoAtendimento/autoatendimento/v1/cotas') {
        tk = dados.authorization
        if (tk != undefined) {
          apiKey = tk.replace('Bearer ', '')
        }
        chave = apiKey;
        return res.json(chave);
        /*

           axios({
          method: 'get',
          url: "http://localhost:8082",
          params: {
            token: chave
          } 
        });   
        //console.log(chave);
        */

      }
    })
  })
    .then(console.log('cantou!'))
})

apiExport.get('/', (req, res) => {
  tokenLocal = req.query.token

  console.log('>> bateu na api', tokenLocal);

  return res.json(tokenLocal);

  /*
      axios({
    method: 'get',
    headers: { 'Authorization': 'Bearer '+tokenLocal },
    url: "https://canalconsorciado.bradesco.com.br/GatewayAutoAtendimento/autoatendimento/v1/cotas"    
  })
  .then(response => {
    console.log(response.data)
    const cotas = response.data
    // return res.json(cotas);    
  })

  */
})
