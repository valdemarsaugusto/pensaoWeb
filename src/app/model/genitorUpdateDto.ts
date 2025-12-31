import { GenitorEmpregoModel } from "./genitorEmpregoModel";
import { TipoGenitor } from "./tipoGenitor";

export interface GenitorUpdateDto {
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
    cEP: string;
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string
    numero: string,      // Novo campo
    complemento: string, // Novo campo
    nomeEmpresa: string,
    possuiVinculoFormal: boolean,
    // Informações jurídicas
    tipo: TipoGenitor; // Certifique-se de criar esse enum no Angular também
    empregoId: number;
    empregoCNPJ: string,
    //emprego: GenitorEmpregoModel[]; // ICollection vira um Array []

    salarioMensal: number;
    valorPensao: number;
    dataPagamento: number; // Geralmente o dia do mês (1 a 31)
    ativo: boolean
}

