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

// Validação de CPF
  validarCPF(cpf: string): boolean {
    if (!cpf) return false;
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove máscara
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    
    let soma = 0;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    let resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  // Validação de CNPJ
  validarCNPJ(cnpj: string): boolean {
    if (!cnpj) return false;
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove máscara
    if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }
}