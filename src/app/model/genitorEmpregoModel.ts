import { GenitorModel } from "./genitorModel";

export interface GenitorEmpregoModel {
    id: number;
    cnpj: string;
    empresa: string;
    cargo: string;
    tipoVinculo: string; // Ex: 'CLT', 'Autônomo', etc.
    rendaMensal?: number; // Equivalente ao decimal? do C#
    genitorId: number;
    
    // Referência opcional para evitar recursão infinita em formulários
    genitor?: GenitorModel; 
}