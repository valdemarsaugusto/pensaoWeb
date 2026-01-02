export interface FilhoUpdateDto {
    id: number,
    nomeCompleto: string;
    nacionalidade: string;
    cpf: string;
    dataNascimento: string;
    genitorMoraCriancaId: number | null;
    
    // Endereço (se for diferente do genitor)
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    uf: string;

    // Dados Escolares que você definiu
    escola: string;
    serie:string;
    turno: string;
    dataInicioPeriodoLetivo: string;
    dataTerminoPeriodoLetivo: string;
    dataInicioRecessoEscolar: string;
    dataTerminoRecessoEscolar: string;
    dataInicioFeriasEscolar: string;
    dataTerminoFeriasEscolar: string;
}