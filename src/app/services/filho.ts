import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/responseModel';
import { FilhoModel } from '../model/filhoModel';
import { FilhoUpdateDto } from '../model/filhoUpdateDto';


@Injectable({
  providedIn: 'root'
})
export class FilhoService {
  private ApiUrl = `${environment.ApiUrl}/Filho`;

  constructor(private http: HttpClient) { }

  ListarFilhos(): Observable<ResponseModel<FilhoModel[]>> {
    return this.http.get<ResponseModel<FilhoModel[]>>(this.ApiUrl);
  }

  CriarFilho(filho: any): Observable<ResponseModel<FilhoModel>> {
    return this.http.post<ResponseModel<FilhoModel>>(this.ApiUrl, filho);
  }

  ExcluirFilho(Filho: any): Observable<ResponseModel<FilhoModel>> {
    return this.http.delete<ResponseModel<FilhoModel>>(`${this.ApiUrl}/${Filho.id}`);
  }

  AtualizarFilho(id: number, filhoUpdateDto: any): Observable<ResponseModel<FilhoUpdateDto>> {
    filhoUpdateDto.id = id;
    return this.http.put<ResponseModel<FilhoUpdateDto>>(this.ApiUrl, filhoUpdateDto);
  }
}