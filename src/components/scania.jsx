import React, { Component } from 'react';
import {
    Input,
    Box,
    Button,
    Text,
    Table,
    TableRow,
    TableCell,
    TableBody,
    Loader,
    InputProps, InputCSS,
    DatePicker,
    DatePickerProps
} from '@adminjs/design-system';
import axios from "axios";
import JSONPretty from 'react-json-pretty';
import ReactInputDateMask from 'react-input-date-mask';


class Consulta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documento: '',
            dataNascimentoFundacao: '',
            cota: '',
            contrato: '',
            cotasResposta1: '',
            cotasResposta2: '',
            cotaCompleta: '',
            cotaEndereco: '',
            cotaTelefone: '',
            cotasVerify: '',
            encerramento: '',
            adesao: '',
            contemplacao: '',
            token: '',
            idCota: '',
            tokenExtratoImprimir: '',
            loader: ''
        }
        this.salvar = this.salvar.bind(this);
        this.bucarCotaPorID = this.bucarCotaPorID.bind(this)
        this.imprimirExtrato = this.imprimirExtrato.bind(this)
    }

    async salvar() {
        this.setState({ loader: 1 })
        let dados = new Object();
        dados.documento = this.state.documento
        dados.dataNascimentoFundacao = this.state.dataNascimentoFundacao
        //console.log(dados);


        this.setState({ cotasVerify: 0 })
        axios.post('https://sistemas.consorcioscania.com.br/AutoAtendimento.Gateway/autoatendimento/v1//login/valores-devolver', {
            inscricaoNacional: dados.documento,
            dataNascimentoFundacao: dados.dataNascimentoFundacao,
            grupo: "",
            cota: 0,
            versao: 0,
            tokenCaptcha: ""
        })
            .then(response => {
                console.log(response.data.token.token)
                const token = response.data.token.token
                this.setState({ token: token })
                this.setState({ loader: 0 })
                axios({
                    method: 'get',
                    headers: { 'Authorization': 'Bearer ' + token },
                    url: "https://sistemas.consorcioscania.com.br/AutoAtendimento.Gateway/autoatendimento/v1//cotas"
                })
                    .then(response => {
                        this.setState({ cotasVerify: 1 })
                        let resposta = response.data
                        let CotasJSON = JSON.stringify(resposta, (key, value) => {
                            if (key == "versao") {
                                return undefined;
                            }
                            if (key == "tipo") {
                                return undefined;
                            }
                            if (key == "bem") {
                                return undefined;
                            }
                            if (key == "valorBem") {
                                return undefined;
                            }
                            if (key == "valorParcela") {
                                return undefined;
                            }
                            if (key == "situacaoRelacionamento") {
                                return undefined;
                            }
                            if (key == "acessoPermitido") {
                                return undefined;
                            }
                            if (key == "idempresa") {
                                return undefined;
                            }


                            return value;
                        })
                        // console.log(CotasJSON);
                        const cotasJSONparse = JSON.parse(CotasJSON)
                        this.setState({ cotasResposta1: cotasJSONparse[0].grupos });
                        //this.setState({ cotasResposta2: cotasJSONparse[1].grupos });
                    })
                    .catch(function (error) {
                        alert('Erro: ' + error + ' Não foi possível localizar os dados do consórcio.. Por favor, veririfique os dados e tente novamente!');
                    });

            })



    };

    bucarCotaPorID() {
        const { idCota } = this.state
        const { token } = this.state
        //(idCota, ' Token >> ', token)
        axios({
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + token },
            url: "https://sistemas.consorcioscania.com.br/AutoAtendimento.Gateway/autoatendimento/v1//cotas/" + idCota + "/dashboard/consorciado"
        })
            .then(response => {
                //console.log(response.data)
                const resposta = response.data
                this.setState({ cotaCompleta: resposta });
                const encerramento = resposta.dataEncerramento
                let diaEncerramento = encerramento.substring(8, 10);
                let mesEncerramento = encerramento.substring(5, 7);
                let anoEncerramento = encerramento.substring(0, 4);
                const dataEncerramento = diaEncerramento + '/' + mesEncerramento + '/' + anoEncerramento;
                this.setState({ encerramento: dataEncerramento });

                const adesao = resposta.dataAdesao
                let diaAdesao = adesao.substring(8, 10);
                let mesAdesao = adesao.substring(5, 7);
                let anoAdesao = adesao.substring(0, 4);
                const dataAdesao = diaAdesao + '/' + mesAdesao + '/' + anoAdesao;
                this.setState({ adesao: dataAdesao });
            });
        axios({
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + token },
            url: "https://sistemas.consorcioscania.com.br/AutoAtendimento.Gateway/autoatendimento/v1//cotas/" + idCota + "/dados-cadastrais/enderecos/0/CO"
        })
            .then(response => {
                //console.log(response.data)
                const resposta = response.data
                this.setState({ cotaEndereco: resposta[0] });

            });
        axios({
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + token },
            url: "https://sistemas.consorcioscania.com.br/AutoAtendimento.Gateway/autoatendimento/v1//cotas/" + idCota + "/dados-cadastrais/telefones/0/CO"
        })
            .then(response => {
                //console.log(response.data)
                const resposta = response.data
                this.setState({ cotaTelefone: resposta[0] });

            });
    }
    imprimirExtrato() {
        const { idCota } = this.state;
        const { token } = this.state;
        axios({
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + token },
            url: "https://sistemas.consorcioscania.com.br/AutoAtendimento.Gateway/autoatendimento/v1//cotas/" + idCota + "/extrato/imprimir"
        })
            .then(response => {
                //console.log(response.data)
                const resposta = response.data
                this.setState({ tokenExtratoImprimir: resposta });
                axios({
                    method: 'get',
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    url: "https://sistemas.consorcioscania.com.br/AutoAtendimento.Gateway/autoatendimento/v1/relatorios/" + resposta
                })
                    .then((response) => {
                        //console.log(response)
                        let blob = new Blob([response.data], { type: 'application/pdf' }),
                            url = window.URL.createObjectURL(blob)
                        window.open(url);
                    });
            });
    }
    render() {
        const { loader } = this.state
        while (loader == 1) {
            return (
                <div>
                    <Loader />
                </div>
            );
        }
        const cotasVazias = this.state.cotasVerify
        while (cotasVazias == 0) {
            return (
                <Box display={["block", "flex"]} flexDirection="row" justifyContent="space-between" margin="2%">
                    <Box flex flexDirection="row" variant="white">
                        <Table>
                            <TableBody>
                            <TableCell>
                                    <img src={"https://upload.wikimedia.org/wikipedia/commons/c/ce/Scania_Logo_seit_2016.png"} width={170} alt="BigCo Inc. logo" />
                                </TableCell>
                                <TableCell>
                                    <Text fontSize="h5" fontWeight="2px">CPF/CNPJ</Text>
                                    <Input id="documento"
                                        onChange={(e) => {
                                            let valorDigitado = e.target.value;
                                            this.setState({ documento: valorDigitado });
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Text fontSize="h5" fontWeight="2px">Data de Nasc./Fundação da Empresa</Text>
                                    <Input id="dataNascimentoFundacao" type="date"
                                        onChange={(e) => {
                                            let valorDigitado = e.target.value;
                                            this.setState({ dataNascimentoFundacao: valorDigitado });
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Text fontSize="h5" fontWeight="2px">Consultar</Text>
                                    <Button alignSelf="center" onClick={this.salvar}>
                                        <Text fontSize="h5" fontWeight="2px"><strong>...</strong></Text>
                                    </Button>
                                </TableCell>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            )
        }

        const cotas = this.state.cotasVerify;
        const { cotasResposta1 } = this.state;
        const { cotasResposta2 } = this.state;
        const { cotaCompleta } = this.state;
        const { cotaEndereco } = this.state;
        const { cotaTelefone } = this.state;
        const { encerramento } = this.state;
        const { adesao } = this.state;
        const CotasJSON = JSON.stringify(cotaCompleta);
        const cotaUnica = JSON.parse(CotasJSON);
        const enderecoPrincipalJSON = JSON.stringify(cotaEndereco);
        const enderecoPrincipal = JSON.parse(enderecoPrincipalJSON);




        if (cotas == 1) {

            let valorBem = cotaUnica.valorBem == null ? " " : cotaUnica.valorBem.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            let valorPago = cotaUnica.valorPago == null ? " " : cotaUnica.valorPago.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            let valorSaldoDevedor = cotaUnica.valorSaldoDevedor == null ? " " : cotaUnica.valorSaldoDevedor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

            return (
                <Box align-items="left" variant="grey" animate="true" >
                    <Box display={["block", "flex"]} flexDirection="row">
                        <Box flex flexDirection="row" variant="white">
                            <Table>
                                <TableBody>
                                    <TableCell>
                                        <Text fontSize="h5" fontWeight="6px">Buscar cota específica por ID</Text>
                                        <Input id="cota"
                                            onChange={(e) => {
                                                let valorDigitado = e.target.value;
                                                this.setState({ idCota: valorDigitado });
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Text fontSize="h5" fontWeight="2px">Consultar</Text>
                                        <Button alignSelf="right" onClick={this.bucarCotaPorID}>
                                            <Text fontSize="h5" fontWeight="2px"><strong>...</strong></Text>
                                        </Button>
                                    </TableCell>
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                    <Box variant="white">
                        <Table>
                            <TableBody>
                                <TableCell>
                                    <Text fontWeight="bold">Nome</Text>
                                    <Text fontSize="h7">{cotaUnica.nome}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Grupo</Text>
                                    <Text fontSize="h7">{cotaUnica.grupo}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Cota</Text>
                                    <Text fontSize="h7">{cotaUnica.cota}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Bem</Text>
                                    <Text fontSize="h7">{cotaUnica.bem}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Adesão</Text>
                                    <Text fontSize="h7">{adesao}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Encerramento</Text>
                                    <Text fontSize="h7">{encerramento}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Valor bem</Text>
                                    <Text fontSize="h7">{valorBem}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Pago</Text>
                                    <Text fontSize="h7">{valorPago}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Devedor</Text>
                                    <Text fontSize="h7">{valorSaldoDevedor}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Extrato</Text>
                                    <Button onClick={this.imprimirExtrato}>Gerar</Button>
                                </TableCell>
                            </TableBody>
                        </Table>
                        <Table>
                            <TableBody>

                                <TableCell>
                                    <Text fontWeight="bold">Logradouro</Text>
                                    <Text fontSize="h7">{enderecoPrincipal.endereco}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Número</Text>
                                    <Text fontSize="h7">{enderecoPrincipal.numeroEndereco}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Complemento</Text>
                                    <Text fontSize="h7">{enderecoPrincipal.complemento}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">CEP</Text>
                                    <Text fontSize="h7">{enderecoPrincipal.cep}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Bairro</Text>
                                    <Text fontSize="h7">{enderecoPrincipal.bairro}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">Cidade</Text>
                                    <Text fontSize="h7">{enderecoPrincipal.nomeCidade}</Text>
                                </TableCell>
                                <TableCell>
                                    <Text fontWeight="bold">UF</Text>
                                    <Text fontSize="h7">{enderecoPrincipal.idUF}</Text>
                                </TableCell>
                            </TableBody>
                        </Table>
                        <Table>

                        </Table>
                        <hr></hr>
                    </Box>
                    <Box variant="white">

                        <Table>
                            <TableBody>
                                <TableRow>
                                    <JSONPretty id="json-pretty" style={{ fontSize: "1.1em" }} data={cotasResposta1} mainStyle="padding:1em"></JSONPretty>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            );
        }
    }
}

export default Consulta;
