import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenitorCreateDto } from '../../model/genitorCreateDto';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { GenitorService } from '../../services/genitor';
import Swal from 'sweetalert2';
import { UtilsService } from '../../services/utils/utils';

@Component({
  selector: 'app-genitor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './genitor.html',
  styleUrl: './genitor.css'
})
export class GenitorComponent {
  etapa: number = 1;
  carregandoEmpresa: boolean = false; // Controla o ícone de carregamento
  // Aqui você define o tipo e já inicializa os valores padrão
  genitor: GenitorCreateDto = {
    nomeCompleto: '',
    nacionalidade: '',
    profissao: '',
    cPF: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    cEP: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',      // Novo campo
    complemento: '',  // Novo campo
    tipo: null, // Guardião
    empregoId: 0,
    empregoCNPJ: '',
    nomeEmpresa: '',
    possuiVinculoFormal: true,
    salarioMensal: 0,
    valorPensao: 0,
    dataPagamento: 0,
    ativo: true // Geralmente o dia do mês (1 a 31)
  };

  constructor(private genitorService: GenitorService, private utils: UtilsService){

  }

  proximo() { 
    
    const emailValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.genitor.email);

    if (this.etapa < 3) this.etapa++; 


  }
  voltar() { if (this.etapa > 1) this.etapa--; }

  limparFormulario() {
    this.etapa = 1;
    this.genitor = {
      nomeCompleto: '',
      nacionalidade: 'Brasileira',
      cPF: '',
      tipo: null, // Volta a ficar vazio como solicitado
      dataNascimento: '',
      telefone: '',
      email: '',
      cEP: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
      numero: '',      // Novo campo
      complemento: '',  // Novo campo
      profissao: '',
      empregoId: 0,
      empregoCNPJ: '',
      nomeEmpresa: '',
      possuiVinculoFormal: true,
      salarioMensal: 0,
      valorPensao: 0,
      dataPagamento: 0,
      ativo: true
    };
  }

  validarDados() {
    const cpfValido = this.validarCPF(this.genitor.cPF);
    const emailValido = /^\S+@\S+\.\S+$/.test(this.genitor.email);
    const cnpjValido = this.genitor.empregoCNPJ ? this.validarCNPJ(this.genitor.empregoCNPJ) : true;

    if (!cpfValido) alert("CPF Inválido!");
    if (!emailValido) alert("E-mail com formato incorreto!");
    
    return cpfValido && emailValido && cnpjValido;
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

  // No TypeScript
  getmensagemErro(): string {
    if (this.etapa === 1) return "* Preencha Nome, Nacionalidade, CPF válido, Data e Função Familiar.";
    if (this.etapa === 2) return "* Informe Telefone, E-mail válido e CEP.";
    if (this.etapa === 3) return "* Informe a Profissão e um Dia entre 1 e 31.";
    return "";
  }

  etapaValida(): boolean {
    if (this.etapa === 1) {
       // Garante que uma opção foi escolhida
      return this.genitor.tipo !== null && 
              !!this.genitor.nomeCompleto && 
              this.validarCPF(this.genitor.cPF) && 
              !!this.genitor.dataNascimento &&
              !!this.genitor.nacionalidade // Novo campo obrigatório;
    }

    if (this.etapa === 2) {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.genitor.email);
        // Remove a máscara para conferir se tem 8 números
        const cepLimpo = this.genitor.cEP ? this.genitor.cEP.replace(/\D/g, '') : '';
        
        return (
          this.genitor.telefone?.length >= 10 && 
          emailValido && 
          cepLimpo.length === 8 // CEP agora é obrigatório e precisa estar completo
        );
    }

    if (this.etapa === 3) {
      return !!this.genitor.profissao && (this.genitor.dataPagamento > 0 && this.genitor.dataPagamento <= 31);
    }
    return false;
  }  


  salvar() {
    if (this.etapaValida()) {

      this.genitorService.CriarGenitor(this.genitor).subscribe({
            next: (res) => {
                this.utils.showSuccess('Genitor cadastrado com sucesso!')
                .then(() => this.limparFormulario());
            },
            error: (err) => {
              Swal.fire('Erro!', 'Não foi possível salvar os dados.', 'error');
            }
          });
    }
  }

  buscarCep() {
    const cepLimpo = this.genitor.cEP?.replace(/\D/g, '');
    
    if (cepLimpo?.length === 8) {
      this.utils.buscarCep(cepLimpo).then(dados => {


        if (dados && !dados.erro) {
          // Atribuição com mapeamento correto
          this.genitor.logradouro = dados.logradouro;
          this.genitor.bairro = dados.bairro;
          this.genitor.cidade = dados.localidade;
          this.genitor.estado = dados.uf;
          
          // No genitor.component.ts dentro do buscarCep
          this.genitor.logradouro = dados.logradouro;
          // ... preenche o resto
          // Opcional: focar no campo número após o CEP carregar
          document.getElementsByName('numero')[0]?.focus();
        } else {
          this.utils.showWarning('CEP não encontrado.');
        }
      }).catch(error => {
        this.utils.showError('Erro ao buscar o CEP.');
      });
    }
  }

  buscarEmpresa() {
    const cnpjLimpo = this.genitor.empregoCNPJ?.replace(/\D/g, '');

    // Só dispara a busca se tiver exatamente 14 números
    if (cnpjLimpo?.length === 14) {
      this.carregandoEmpresa = true; // Ativa o "hourglass"

      this.utils.buscarEmpresa(cnpjLimpo).then(dados => {
        if (dados && dados.razao_social) {
          this.genitor.nomeEmpresa = dados.razao_social;
        } else {
          this.utils.showWarning('CNPJ não encontrado.');
        }
      })
      .catch(() => this.utils.showError('Erro ao consultar CNPJ.'))
      .finally(() => {
        this.carregandoEmpresa = false; // Desativa o "hourglass"
      });
    }
  }
}