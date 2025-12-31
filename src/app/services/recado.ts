import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecadoModel } from '../model/recadoModel';
import { ResponseModel } from '../model/responseModel';
import { RecadoCreateDto } from '../model/recadoCreateDto';
import { RecadoUpdateDto } from '../model/recadoUpdateDto';


@Injectable({
  providedIn: 'root',
})
export class RecadoService {
  
  ApiUrl = environment.ApiUrl;

  constructor(private http: HttpClient){}

  BuscarRecado() : Observable<ResponseModel<RecadoModel[]>> {
    return this.http.get<ResponseModel<RecadoModel[]>>(`${this.ApiUrl}/Recado`)
  }

  BuscarRecadoPorId(id: number) : Observable<ResponseModel<RecadoModel[]>> {
    return this.http.get<ResponseModel<RecadoModel[]>>(`${this.ApiUrl}/Recado/${id}`)
  }

  RemoverRecado(id: number):Observable<ResponseModel<RecadoModel>>{
    return this.http.delete<ResponseModel<RecadoModel>>(`${this.ApiUrl}/Recado/${id}`)
  }

  CriarRecado(recadoCreateDto: RecadoCreateDto): Observable<ResponseModel<RecadoModel>> {
    return this.http.post<ResponseModel<RecadoModel>>(`${this.ApiUrl}/Recado`, recadoCreateDto);
  }

  AtualizarRecado(id: number, recadoUpdateDto: RecadoUpdateDto ): Observable<ResponseModel<RecadoModel>> {
    recadoUpdateDto.id = id;
    return this.http.put<ResponseModel<RecadoModel>>(`${this.ApiUrl}/Recado`, recadoUpdateDto);
  }
}
