import { CategoriaEvento } from "./categoriaEvento";

export interface EventoModel{

    id: number,
    titulo: string,
    descricao?: string,
    dataInicio: Date,
    dataFim?: Date,
    cor: string,
    categoria: CategoriaEvento,
    aivo: boolean
}