import React, { Component } from 'react';
import { Input, Box, Button, Text, Loader, Table, TableBody, TableRow, TableCell } from '@adminjs/design-system';
import axios from 'axios';
import io from 'socket.io-client';

class Consulta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cpf: '',
      codeStart: '',
      loading: false,
      result: null,
      errorMessage: '',
      lastAttempt: '', // Novo estado para armazenar o último código tentado
      attempts: [] // Lista de tentativas
    };
    this.socket = null;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Conectar ao servidor Socket.IO
    this.socket = io('http://localhost:3001'); // Endereço do servidor Socket.IO

    // Ouvir as tentativas do backend
    this.socket.on('attempt', (attempt) => {
      console.log('Nova tentativa recebida:', attempt);
      this.setState((prevState) => ({
        attempts: [...prevState.attempts, attempt],
      }));
    });
  }

  async handleSubmit() {
    const { cpf, codeStart } = this.state;

    if (!cpf || !codeStart) {
      this.setState({ errorMessage: 'Por favor, preencha o CPF e o código inicial.' });
      return;
    }

    this.setState({ loading: true, errorMessage: '', attempts: [], lastAttempt: '' });

    try {
      const response = await axios.post('http://localhost:3001/api/consultar', { cpf, codeStart });

      this.setState({
        result: response.data.message,
        loading: false,
        lastAttempt: response.data.lastAttempt || ''
      });

      console.log(`Último código tentado: ${response.data.lastAttempt}`);
    } catch (error) {
      const lastAttempt = error.response?.data?.lastAttempt || 'Desconhecido';
      this.setState({
        errorMessage: `Erro ao consultar a API. Último código tentado: ${lastAttempt}`,
        loading: false,
        lastAttempt
      });
    }
  }

  render() {
    const { loading, result, attempts, errorMessage, lastAttempt } = this.state;

    return (
      <Box variant="white" padding="2em">
        <Text fontSize="h3" fontWeight="bold">Buscador Código de Acesso</Text>

        {errorMessage && <Text color="red">{errorMessage}</Text>}

        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Text fontSize="h5">CPF</Text>
                <Input
                  value={this.state.cpf}
                  onChange={(e) => this.setState({ cpf: e.target.value })}
                  placeholder="Digite o CPF"
                />
              </TableCell>

              <TableCell>
                <Text fontSize="h5">Código Inicial</Text>
                <Input
                  value={this.state.codeStart}
                  onChange={(e) => this.setState({ codeStart: e.target.value })}
                  placeholder="Digite o código inicial"
                />
              </TableCell>

              <TableCell>
                <Button onClick={this.handleSubmit} variant="contained" color="primary" mt={2}>
                  {loading ? <Loader /> : <Text>Consultar</Text>}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box marginTop="2em">
          <Text fontSize="h4">Tentativas:</Text>
          <Table>
            <TableBody>
              {attempts.map((attempt, index) => (
                <TableRow key={index}>
                  <TableCell>{attempt.code}</TableCell>
                  <TableCell>{attempt.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {lastAttempt && (
          <Box marginTop="2em">
            <Text fontSize="h4">Último Código Tentado:</Text>
            <Text>{lastAttempt}</Text>
          </Box>
        )}

        {result && (
          <Box marginTop="2em">
            <Text fontSize="h4">Resultado da Consulta:</Text>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        )}
      </Box>
    );
  }
}

export default Consulta;