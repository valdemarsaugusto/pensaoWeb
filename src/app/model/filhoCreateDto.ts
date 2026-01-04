import { FilhoGenitorCreateDto } from "./filhoGenitorCreateDto";

export interface FilhoCreateDto {
    nomeCompleto: string;
    nacionalidade: string;
    cpf: string;
    dataNascimento: string;

    // Endereço e Controle
    genitorMoraCriancaId: boolean;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    uf: string;

    // Dados Escolares
    escola: string;
    serie: string;
    turno: string;
    dataInicioPeriodoLetivo: string;
    dataTerminoPeriodoLetivo: string;
    dataInicioRecessoEscolar: string;
    dataTerminoRecessoEscolar: string;
    dataInicioFeriasEscolar: string;
    dataTerminoFeriasEscolar: string;

    // --- ADICIONE ESTE CAMPO ABAIXO ---
    // Esta lista deve bater com o nome esperado no C#
    Responsaveis: FilhoGenitorCreateDto[]; 
}

// Interface auxiliar para a tabela intermediária
