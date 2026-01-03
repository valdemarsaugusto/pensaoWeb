import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/responseModel';
import { GenitorModel } from '../model/genitorModel';
import { GenitorUpdateDto } from '../model/genitorUpdateDto';


@Injectable({
  providedIn: 'root'
})
export class GenitorService {
  private ApiUrl = `${environment.ApiUrl}/Genitor`;

  constructor(private http: HttpClient) { }

  ListarGenitors(): Observable<ResponseModel<GenitorModel[]>> {
    return this.http.get<ResponseModel<GenitorModel[]>>(this.ApiUrl);
  }

  CriarGenitor(genitor: any): Observable<ResponseModel<GenitorModel>> {
    return this.http.post<ResponseModel<GenitorModel>>(this.ApiUrl, genitor);
  }

  ExcluirGenitor(Genitor: any): Observable<ResponseModel<GenitorModel>> {
    return this.http.delete<ResponseModel<GenitorModel>>(`${this.ApiUrl}/${Genitor.id}`);
  }

  AtualizarGenitor(id: number, genitorUpdateDto: any): Observable<ResponseModel<GenitorUpdateDto>> {
    genitorUpdateDto.id = id;
    return this.http.put<ResponseModel<GenitorUpdateDto>>(this.ApiUrl, genitorUpdateDto);
  }

   obterPorCpf(cpfBuscaEndereco: string): Observable<ResponseModel<GenitorModel>> {
    return this.http.get<ResponseModel<GenitorModel>>(`${environment.ApiUrl}/Genitor/buscar-cpf/${cpfBuscaEndereco}`);
  }
}