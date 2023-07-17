import React, { Component } from 'react';
import {
    Input,
    Box,
    Illustration,
    Button,
    Text,
    Table,
    TableCell,
    TableBody,
    Loader
} from '@adminjs/design-system';
import axios from "axios";

class dashboard extends Component {

    render() {

        return (
            <Box display={["block", "flex"]} flexDirection="row" justifyContent="space-between" margin="1%">
                <Box flex flexDirection="row" variant="white">
                    <Text fontSize="h5" fontWeight="2px">Consultar cotas</Text>
                    <Illustration variant="DocumentSearch" />
                </Box>
                <Box flex flexDirection="row" variant="white">
                    <Text fontSize="h5" fontWeight="2px">Baixar extratos</Text>
                    <Illustration variant="Folders" />
                </Box>
                <Box flex flexDirection="row" variant="white">
                    <Text fontSize="h5" fontWeight="2px">Editar dados</Text>
                    <Illustration variant="DocumentCheck" />
                </Box>
                
            </Box>

        )

    }
}

export default dashboard;
