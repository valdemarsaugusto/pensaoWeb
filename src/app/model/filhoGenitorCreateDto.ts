export interface FilhoGenitorCreateDto {
    genitorId: number;
    tipo: number; // 1-Socioeducativo, 2-Alimentante
    valorPensao: number;
}