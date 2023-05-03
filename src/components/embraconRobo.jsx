import React, { Component } from 'react';
import {
    Input,
    Box,
    Button,
    Text,
    Table,
    TableCell,
    TableBody,
    TableHead,
    Link,
    Loader
} from '@adminjs/design-system';
import axios from "axios";
import { Base64 } from "js-base64";
class embracon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cpf: '',
            cotaDetalhes: 1,
        }
        this.bucarCotaInicial = this.bucarCotaInicial.bind(this);
        this.gerarToken = this.gerarToken.bind(this);
        this.cotaAnterior = this.cotaAnterior.bind(this);
        this.cotaProxima = this.cotaProxima.bind(this);
    }

    async bucarCotaInicial() {
        const timer = (seconds) => {  
            let time = seconds * 3000
            return new Promise(res => setTimeout(res, time))
          }
        const cotaInicial = this.state.cotaInicial;
        console.log(cotaInicial)
        //let tokenEnbracom = "42275ca9-fcb5-4828-8cc8-db8af3d8f7f1";
        //console.log(this.state.token)
        this.setState({ loader: 1 })

            //let tokenEnbracom = "deb6fe32-540d-4701-a296-be568039723d";
    for (let i = cotaInicial; i < 10000000; i++) {
        //console.log("Looping... " + i);   \    
                           
        //console.log(i);
        
        axios({           
            method: 'get' ,        
            url: "https://api.embraconnet.com.br/app-cliente/v1/cota/" + i + "?access_token=" + this.state.token + "&client_id=530f6324-16c7-3e67-b33f-4115e4205ae6",
      
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
          this.setState({ loader: 0 });
          this.setState({ cota: 0 });
        await timer(2);
      } 
    
    };

    async gerarToken() {
        this.setState({ loader: 1 })
        const headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "pt-BR,pt;q=0.9",
            "authorization": "Basic NTMwZjYzMjQtMTZjNy0zZTY3LWIzM2YtNDExNWU0MjA1YWU2OjViNGNjMTVjLWQyZDEtMzM2ZS05NzgwLTlmOTZjZmMyMDM5NQ==",
            "client_id": "530f6324-16c7-3e67-b33f-4115e4205ae6",
            "content-type": "application/json",
            "platform": "web",
            "version_app": "1.56.00",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        };

        const data = {
            type: "person",
            inscricaoNacional: "33592082850",
            senha: "030909",
            grant_type: "password"
        };
        axios.post('https://api.embraconnet.com.br/app-cliente/v1/login', data, {
            headers: headers
        }).then(response => {
            //console.log(response.data)
            this.setState({ token: response.data.access_token })
            this.setState({ loader: 0 })
        }).catch(function (error) {
            console.log(error);
        });
    };

    async cotaAnterior() {
        //console.log('teste voltar')
        const cotaInicial = this.state.cotaInicial--;
        console.log(cotaInicial)
        //console.log(this.state.token)


        axios({
            method: 'get',
            url: "https://api.embraconnet.com.br/app-cliente/v1/cota/" + cotaInicial + "?access_token=" + this.state.token + "&client_id=530f6324-16c7-3e67-b33f-4115e4205ae6",

        }).then(response => {
            console.log(response.data)
            this.setState({ detalhesCota: response.data[0] })
            //this.setState({ cotaDetalhes: 0 })
        })
    };

    async cotaProxima() {
        //console.log('teste proxima')
        //const i ++;
        const cotaInicial = this.state.cotaInicial++;
        //console.log(cotaInicial)
        //console.log(this.state.token)
        //" + this.state.token + "

        axios({
            method: 'get',
            url: "https://api.embraconnet.com.br/app-cliente/v1/cota/" + cotaInicial + "?access_token=" + this.state.token + "&client_id=530f6324-16c7-3e67-b33f-4115e4205ae6",

        }).then(response => {
            console.log(response.data)
            this.setState({ detalhesCota: response.data[0] })
            //this.setState({ cotaDetalhes: 0 })
        })
    };


    render() {
        let cota = this.state.cotaDetalhes;
        let detalhesCota = this.state.detalhesCota
        let loader = this.state.loader;

        while (loader == 1) {
            return (
                <div align="center">
                    <Text fontSize="h4" fontWeight="5px" alignSelf="center" justifyContent="space-between" margin="2%">Por favor, aguarde...</Text>
                    <Loader />
                </div>
            );
        }

        while (cota == 1) {
            return (
                <Box display={["block", "flex"]} flexDirection="row" justifyContent="space-between" margin="2%">
                    <Box flex flexDirection="row" variant="white">

                        <Table>
                            <TableBody>
                                <TableCell>
                                    <Text fontSize="h4" fontWeight="5px">Gerar Token</Text>
                                    <Text fontSize="h5" variant="primary" fontWeight="2px">{this.state.token != null ? "Token gerado com sucesso" : ""}</Text>
                                </TableCell>

                                <TableCell>
                                    <Text fontSize="h5" fontWeight="2px">Gerar</Text>
                                    <Button alignSelf="center" onClick={this.gerarToken}>
                                        <Text fontSize="h5" fontWeight="2px"><strong>...</strong></Text>
                                    </Button>
                                </TableCell>
                            </TableBody>
                        </Table>
                    </Box>
                    <Box flex flexDirection="row" variant="white">

                        <Table>

                            <TableBody>
                                <TableCell>
                                    <Text fontSize="h4" fontWeight="5px">Escolher cota inicial</Text>
                                </TableCell>

                                <TableCell>
                                    <Text fontSize="h5" fontWeight="2px">Cota</Text>
                                    <Input id="cotaInicial"
                                        onChange={(e) => {
                                            let valorDigitado = e.target.value;
                                            this.setState({ cotaInicial: valorDigitado });
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Text fontSize="h5" fontWeight="2px">Buscar</Text>
                                    <Button alignSelf="center" onClick={this.bucarCotaInicial}>
                                        <Text fontSize="h5" fontWeight="2px"><strong>...</strong></Text>
                                    </Button>
                                </TableCell>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>

            );

        }
        while (cota == 0) {


            return (
                <Box justifyContent="space-between" margin="2%" variant="white">
                   <Text></Text>
                </Box>
            )
        }

        /*
        let diaEncerramento = encerramento.substring(8, 10);
                let mesEncerramento = encerramento.substring(5, 7);
                let anoEncerramento = encerramento.substring(0, 4);



                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                                <TableCell><Text fontSize="h5" fontWeight="2px">teste</Text></TableCell>
                 */

    }
}

export default embracon;
