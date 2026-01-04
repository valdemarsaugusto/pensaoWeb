import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FilhoCreateDto } from '../model/filhoCreateDto';
import { FilhoService } from '../services/filho';
import { GenitorService } from '../services/genitor';
import { UtilsService } from '../services/utils/utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-filho',
  templateUrl: './filho.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  styleUrls: ['./filho.css']
})
export class FilhoComponent implements OnInit {
  // Controle de Navegação
  etapaAtual: number = 1;
  
  // Variáveis de busca e controle (Etapa 4)
  cpfBuscaResponsavel: string = '';
  nomeResponsavelEncontrado: string = '';
  idResponsavelEncontrado: number | null = null;
  tipoResponsavelEncontrado: number | null = null;
  valorPensaoTemp: number = 0;
  responsaveisGrid: any[] = [];

  // Variáveis de busca (Etapa 2)
  cpfGenitorBusca: string = '';
  nomeGenitorEncontrado: string = '';
  cpfInvalido: boolean = false;
  cpfFilhoInvalido: boolean = false;

  // Objeto principal (DTO)
  filho: FilhoCreateDto = {
    nomeCompleto: '', nacionalidade: 'Brasileira', cpf: '', dataNascimento: '',
    genitorMoraCriancaId: true, cep: '', logradouro: '', numero: '',
    bairro: '', cidade: '', estado: '', uf: '', complemento: '',
    escola: '', serie: '', turno: '', dataInicioPeriodoLetivo: '',
    dataTerminoPeriodoLetivo: '', dataInicioRecessoEscolar: '',
    dataTerminoRecessoEscolar: '', dataInicioFeriasEscolar: '',
    dataTerminoFeriasEscolar: '', Responsaveis: []
  };

  constructor(
    private filhoService: FilhoService,
    private genitorService: GenitorService,
    private utils: UtilsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  // --- LÓGICA DA GRID (ETAPA 4) ---

  validarCPFResponsavel() {
    const cpfLimpo = this.cpfBuscaResponsavel.replace(/\D/g, '');
    if (cpfLimpo.length === 11) {
      this.genitorService.obterPorCpf(cpfLimpo).subscribe({
        next: (res: any) => {

          if (res && res.status && res.dados) {
            // Puxa ID e TIPO direto do cadastro do Genitor no banco
            this.idResponsavelEncontrado = res.dados.id; 
            this.nomeResponsavelEncontrado = res.dados.nomeCompleto;
            this.tipoResponsavelEncontrado = res.dados.tipo; 

          this.filho.cep = res.dados.cep;
          this.filho.logradouro = res.dados.logradouro;
          this.filho.numero = res.dados.numero;
          this.filho.bairro = res.dados.bairro;
          this.filho.cidade = res.dados.cidade;
          this.filho.estado = res.dados.estado;
          this.filho.uf = res.dados.estado;

          } else {
            this.idResponsavelEncontrado = null;
            this.utils.showWarning('Responsável não cadastrado.');
          }
        }
      });
    }
  }

  adicionarResponsavelGrid() {
    if (!this.idResponsavelEncontrado || this.tipoResponsavelEncontrado === null) {
        this.utils.showWarning('Busque um responsável válido primeiro.');
        return;
    }

    if (this.responsaveisGrid.find(r => r.genitorId === this.idResponsavelEncontrado)) {
        this.utils.showWarning('Este responsável já está na lista.');
        return;
    }

    this.responsaveisGrid.push({
        genitorId: this.idResponsavelEncontrado,
        nomeCompleto: this.nomeResponsavelEncontrado,
        tipo: this.tipoResponsavelEncontrado, //
        valorPensao: this.tipoResponsavelEncontrado === 2 ? Number(this.valorPensaoTemp) : 0
    });

    this.limparCamposBusca();
  }

  // MÉTODO QUE ESTAVA FALTANDO E CAUSANDO O ERRO NO HTML:
  removerResponsavel(index: number) {
    this.responsaveisGrid.splice(index, 1);
  }

  // --- LÓGICA DE ENDEREÇO (ETAPA 2) ---

  buscarCep() {
    let valor = this.filho.cep?.replace(/\D/g, '');
    if (valor?.length === 8) {
      this.utils.buscarCep(valor).then(dados => {
        if (dados && !dados.erro) {
          this.filho.logradouro = dados.logradouro;
          this.filho.bairro = dados.bairro;
          this.filho.cidade = dados.localidade;
          this.filho.estado = dados.uf;
          this.filho.uf = dados.uf;
        }
      });
    }
  }

  buscarEnderecoPorCpf() {
    const v = this.cpfGenitorBusca.replace(/\D/g, '');

    this.genitorService.obterPorCpf(v).subscribe({
      next: (res: any) => {
        if (res && res.status && res.dados) {
          const g = res.dados;
          this.nomeGenitorEncontrado = g.nomeCompleto;
          
          // Atribuição direta ao objeto filho
          this.filho.cep = g.cep;
          this.filho.logradouro = g.logradouro;
          this.filho.numero = g.numero;
          this.filho.bairro = g.bairro;
          this.filho.cidade = g.cidade;
          this.filho.estado = g.estado;
          this.filho.uf = g.estado;

          // Força o Angular a renderizar os novos valores na tela
          this.cd.detectChanges(); 
        }
      }
    });
  }

  etapaValida(): boolean {
    if (this.etapaAtual === 1) {
      return !!(this.filho.nomeCompleto && this.filho.cpf && this.filho.dataNascimento);
    }
    if (this.etapaAtual === 2) {
      // Se não mora com o genitor, valida se preencheu o CEP
      if (!this.filho.genitorMoraCriancaId) {
        return !!(this.filho.cep && this.filho.logradouro && this.filho.numero);
      }
      return true;
    }
    if (this.etapaAtual === 4) {
      // Garante que existe pelo menos um responsável na grid
      return this.responsaveisGrid.length > 0;
    }
    return true;
  }
  // --- SALVAMENTO E NAVEGAÇÃO ---

  salvar() {
    if (this.etapaValida()) {
      const payload = {
        ...this.filho,
        genitorMoraCriancaId: !!this.filho.genitorMoraCriancaId, 
        Responsaveis: this.responsaveisGrid.map(res => ({
          genitorId: res.genitorId,
          tipo: res.tipo,
          valorPensao: res.valorPensao,
          genitor: { id: res.genitorId } 
        }))
      };

      this.filhoService.CriarFilho(payload).subscribe({
        next: (res: any) => {
          // AQUI ESTÁ A CORREÇÃO: Verifica o status da regra de negócio
          if (res && res.status === true) {
            this.utils.showSuccess('Cadastro realizado com sucesso!')
              .then(() => window.location.reload());
          } else {
            // Se o status for false, mostramos a mensagem real: "CPF já cadastrado"
            this.utils.showWarning(res.mensagem || 'Não foi possível salvar.');
            console.warn("Aviso da API:", res.mensagem);
          }
        },
        error: (err) => {
          // O error só é disparado em falhas graves (404, 500, ou falta de internet)
          console.error("Erro técnico de conexão ou validação severa:", err.error);
          this.utils.showError('Erro de servidor. Verifique os campos ou sua conexão.');
        }
      });
    }
  }

  proximaEtapa() {
    if (this.etapaAtual < 4) this.etapaAtual++;
    else this.salvar();
  }

  voltarEtapa() { if (this.etapaAtual > 1) this.etapaAtual--; }

  limparCamposBusca() {
    this.cpfBuscaResponsavel = '';
    this.nomeResponsavelEncontrado = '';
    this.idResponsavelEncontrado = null;
    this.tipoResponsavelEncontrado = null;
    this.valorPensaoTemp = 0;
  }

  validarCPFFilho() {
    let v = this.filho.cpf.replace(/\D/g, '');
    if (v.length > 3) v = v.replace(/(\d{3})(\d)/, '$1.$2');
    if (v.length > 6) v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (v.length > 9) v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    this.filho.cpf = v.substring(0, 14);
  }

  validarCPFDigitado() {
    const cpfLimpo = this.cpfGenitorBusca.replace(/\D/g, '');
    if (cpfLimpo.length === 11) {
      this.cpfInvalido = !this.utils.validarCPF(cpfLimpo);
      if (!this.cpfInvalido) this.buscarEnderecoPorCpf();
    }
  }
}