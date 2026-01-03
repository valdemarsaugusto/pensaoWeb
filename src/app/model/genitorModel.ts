import { GenitorEmpregoModel } from "./genitorEmpregoModel";
import { TipoGenitor } from "./tipoGenitor";

export interface GenitorModel {
    id: number;

    // Dados pessoais
    nomeCompleto: string;
    nacionalidade: string;
    profissao: string;
    cPF: string;
    dataNascimento?: Date | string; // No Angular, datas chegam como string ISO

    // Contato
    telefone: string;
    email: string;

    // Endereço
    cep: string;
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,

    numero: string,      // Novo campo
    complemento: string, // Novo campo
    // Informações jurídicas
    tipo: TipoGenitor; // Certifique-se de criar esse enum no Angular também
    empregoId: number;
    empregoCNPJ: string,
    nomeEmpresa: string,
    possuiVinculoFormal: boolean,
    salarioMensal: number;
    valorPensao: number;
    dataPagamento: number; // Geralmente o dia do mês (1 a 31)
    ativo: boolean
}

