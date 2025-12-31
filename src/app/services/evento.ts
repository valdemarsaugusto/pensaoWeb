import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/responseModel';
import { EventoModel } from '../model/eventoModel';
import { EventoUpdateDto } from '../model/eventoUpdateDto';


@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private ApiUrl = `${environment.ApiUrl}/Evento`;

  constructor(private http: HttpClient) { }

  ListarEventos(): Observable<ResponseModel<EventoModel[]>> {
    return this.http.get<ResponseModel<EventoModel[]>>(this.ApiUrl);
  }

  CriarEvento(evento: any): Observable<ResponseModel<EventoModel[]>> {
    return this.http.post<ResponseModel<EventoModel[]>>(this.ApiUrl, evento);
  }

  ExcluirEvento(evento: any): Observable<ResponseModel<EventoModel>> {
    console.log(`${this.ApiUrl}/${evento.id}`)
    return this.http.delete<ResponseModel<EventoModel>>(`${this.ApiUrl}/${evento.id}`);
  }

  AtualizarEvento(id: number, eventoUpdateDto: any): Observable<ResponseModel<EventoUpdateDto>> {
    eventoUpdateDto.id = id;
    console.log(eventoUpdateDto);
    console.log(this.ApiUrl)
    return this.http.put<ResponseModel<EventoUpdateDto>>(this.ApiUrl, eventoUpdateDto);
  }
  // No seu service:
}