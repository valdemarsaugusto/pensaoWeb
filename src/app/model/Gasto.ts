interface Gasto {
  id: number;
  descricao: string;
  valor: number;
  fluxo: 'Entrada' | 'Saída'; // Mudamos de 'tipo' para 'fluxo'
  pagoPor: string;
  data: string;
}