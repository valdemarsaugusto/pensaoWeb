import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importe sempre do caminho 'environment' sem o .development

@Injectable({
  providedIn: 'root'
})
export class FilhoService {
  // Agora usamos a variável do ambiente
  private readonly API = `${environment.ApiUrl}/Filho`; 

  constructor(private http: HttpClient) { }

  criar(filho: any): Observable<any> {
    return this.http.post(this.API, filho);
  }

  // Aproveitando para criar o método que lista os genitores para o Select
  listarGenitores(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.ApiUrl}/Genitor`);
  }


}