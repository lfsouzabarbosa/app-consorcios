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
        const cotaInicial = this.state.cotaInicial;
        console.log(cotaInicial)
        //console.log(this.state.token)
        this.setState({ loader: 1 })


        axios({
            method: 'get',
            url: "https://api.embraconnet.com.br/app-cliente/v1/cota/" + cotaInicial + "?access_token=" + this.state.token + "&client_id=530f6324-16c7-3e67-b33f-4115e4205ae6",

        }).then(response => {
            //console.log(response.data)
            this.setState({ detalhesCota: response.data[0] })
            this.setState({ cotaDetalhes: 0 })
            this.setState({ loader: 0 })
        })

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
            //const result = new Uint8Array(13)
            //let tokenDecode = base64Decode(detalhesCota.token, result)
            //console.log(tokenDecode)
            //console.log(atob(detalhesCota.token))

            /*
                        let tokenEncode = this.state.detalhesCota.token.substr(37, 268)
            let tokenEncondeString = toString(tokenEncode)
            let tokenDecodeString = Base64.decode(tokenEncondeString)
            let tokenDecodeJson = JSON.parse(tokenDecodeString)
            console.log(tokenDecodeJson)
            let documento = tokenDecodeJson.unique_name
            console.log(documento)

            */
            let tokenEncode2 = this.state.detalhesCota.token.substr(37, 60)
            let tokenDecodeString = Base64.decode(tokenEncode2)
        //let tokenDecodeString = window.atob(tokenEncode)
        //console.log(atob(new String(tokenEncode)))
        let tokenDecodeStringFormated = tokenDecodeString.replace(',"sub":"null","jt',"").replace(',"sub":"null"',"")+"}"
        let tokenDecodeStringFormatedNoComma = tokenDecodeStringFormated.replace(",","")
        let documento = JSON.parse(tokenDecodeStringFormatedNoComma)


            let data_entrega_bem = detalhesCota.data_entrega_bem;
            let data_devolucao = detalhesCota.data_devolucao;
            let data_contemplacao = detalhesCota.data_contemplacao;
            let data_encerramento = detalhesCota.data_encerramento;
            let data_adesao = detalhesCota.data_adesao;

            let data_entrega_bem_FORMATED;
            let data_devolucao_FORMATED;
            let data_contemplacao_FORMATED;
            let data_encerramento_FORMATED;
            let data_adesao_FORMATED;

            if (data_entrega_bem != null) {
                data_entrega_bem_FORMATED = detalhesCota.data_entrega_bem.substring(8, 10) + "/" + detalhesCota.data_entrega_bem.substring(5, 7) + "/" + detalhesCota.data_entrega_bem.substring(0, 4)
            }
            if (data_devolucao != null) {
                data_devolucao_FORMATED = detalhesCota.data_devolucao.substring(8, 10) + "/" + detalhesCota.data_devolucao.substring(5, 7) + "/" + detalhesCota.data_devolucao.substring(0, 4)
            }
            if (data_contemplacao != null) {
                data_contemplacao_FORMATED = detalhesCota.data_contemplacao.substring(8, 10) + "/" + detalhesCota.data_contemplacao.substring(5, 7) + "/" + detalhesCota.data_contemplacao.substring(0, 4)
            }
            if (data_encerramento != null) {
                data_encerramento_FORMATED = detalhesCota.data_encerramento.substring(8, 10) + "/" + detalhesCota.data_encerramento.substring(5, 7) + "/" + detalhesCota.data_encerramento.substring(0, 4)
            }
            if (data_adesao != null) {
                data_adesao_FORMATED = detalhesCota.data_adesao.substring(8, 10) + "/" + detalhesCota.data_adesao.substring(5, 7) + "/" + detalhesCota.data_adesao.substring(0, 4)
            }
            

            let valorBem = detalhesCota.valor_bem.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
            let totalPago = detalhesCota.valor_total_pago.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

            let perc_total_pago = detalhesCota.perc_total_pago.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
            let valor_saldo_devedor = detalhesCota.valor_saldo_devedor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });


            //{detalhesCota.cota}
            return (
                <Box justifyContent="space-between" margin="2%" variant="white">
                    <Table display={["block"]} justifyContent="space-between">
                        <TableHead >
                            <TableCell><Text fontSize="h5" fontWeight="1px">Nome</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">ID</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Cota</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Grupo</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Bem</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">V. bem</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Situação</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Total pago</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Data entrega</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Data devolução</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Data adesão</Text></TableCell>
                        </TableHead>
                        <TableBody>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.nome_pessoa}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.id_cota}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.cota}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.grupo}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.nome_bem}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{valorBem}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.situacao_cota}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{totalPago}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{data_entrega_bem_FORMATED}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{data_devolucao_FORMATED}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{data_adesao_FORMATED}</Text></TableCell>
                        </TableBody>
                    </Table>
                    <br>
                    </br>
                    <br>
                    </br>
                    <br>
                    </br>
                    <Table>
                        <TableHead>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Data contemplação</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Data encerramento</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">% Total pago</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Saldo devedor</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Parcelas atrasadas</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">Parcelas pagas</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="1px">CPF/CNPJ</Text></TableCell>
                        </TableHead>
                        <TableBody>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{data_contemplacao_FORMATED}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{data_encerramento_FORMATED}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{perc_total_pago}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{valor_saldo_devedor}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.quantidade_parcelas_atraso}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{detalhesCota.quantidade_parcelas_pagas}</Text></TableCell>
                            <TableCell><Text fontSize="h5" fontWeight="2px">{documento.unique_name}</Text></TableCell>
                        </TableBody>
                    </Table>
                    <br>
                    </br>
                    <br>
                    </br>
                    <br>
                    </br>
                    <Table>
                        <TableHead>

                        </TableHead>
                        <TableBody>
                            <TableCell><Button onClick={this.cotaAnterior}><Text fontSize="h5" fontWeight="2px">Anterior</Text></Button></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell><Button onClick={this.cotaProxima}><Text fontSize="h5" fontWeight="2px">Próxima</Text></Button></TableCell>
                        </TableBody>
                    </Table>
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
