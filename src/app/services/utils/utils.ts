import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private http: HttpClient) {}

   async buscarCep(cep: string) {
      const cleanCep = cep?.replace(/\D/g, '');
      if (cleanCep?.length !== 8) return null;

      const url = `${environment.viaCepUrl}/${cleanCep}/json/`;
      return await lastValueFrom(this.http.get<any>(url));
  }

  async buscarEmpresa(cnpj: string) {
      const cleanCnpj = cnpj?.replace(/\D/g, '');
      if (cleanCnpj?.length !== 14) return null;

      const url = `${environment.brasilApiUrl}/cnpj/v1/${cleanCnpj}`;
      try {
          return await lastValueFrom(this.http.get<any>(url));
      } catch (error) {
          return null;
      }
  }

  showSuccess(message: string) {
    return Swal.fire({
      title: 'Sucesso!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#0d6efd'
    });
  }

  showError(message: string) {
    return Swal.fire({
      title: 'Erro!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33'
    });
  }

  showWarning(message: string) {
    return Swal.fire({
      title: 'Atenção',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f8bb86'
    });
  }
}