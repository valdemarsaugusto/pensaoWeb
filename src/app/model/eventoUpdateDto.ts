import { CategoriaEvento } from "./categoriaEvento";

export interface EventoUpdateDto{

    id: number,
    titulo: string,
    descricao?: string,
    dataInicio: string,
    dataFim?: string,
    cor: string,
    categoria: CategoriaEvento,
    ativo: boolean
}