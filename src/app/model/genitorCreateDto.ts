import { GenitorEmpregoModel } from "./genitorEmpregoModel";
import { TipoGenitor } from "./tipoGenitor";

export interface GenitorCreateDto {
    // Dados pessoais
    nomeCompleto: string;
    nacionalidade: string;
    profissao: string;
    cPF: string;
    dataNascimento?: Date | string; // No Angular, datas chegam como string ISO
    telefone: string;
    email: string;
    cEP: string;
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string
    numero: string,      // Novo campo
    complemento: string,  // Novo campo
    nomeEmpresa: string,
    possuiVinculoFormal: boolean,
    tipo: TipoGenitor | null; // Adicione o | null aqui
    empregoId: number;
    empregoCNPJ: string,
    salarioMensal: number;
    valorPensao: number;
    dataPagamento: number; // Geralmente o dia do mês (1 a 31)
    ativo: boolean
}

