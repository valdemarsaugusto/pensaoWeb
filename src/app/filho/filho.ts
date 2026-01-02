import { Component, OnInit } from '@angular/core';
import { FilhoCreateDto } from '../model/filhoCreateDto';
import { FilhoService } from '../services/filho';
import { GenitorService } from '../services/genitor';
import { UtilsService } from '../services/utils/utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filho',
  templateUrl: './filho.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./filho.css']
})
export class FilhoComponent implements OnInit {
  // Controle de Navegação
  etapaAtual: number = 1;
  moraComGenitor: boolean = true;
// Variáveis de busca e controle
  cpfGenitorBusca: string = '';
  cpfBuscaResponsavel: string = '';
  nomeGenitorEncontrado: string = '';
  
  // Variáveis de Erro
  cpfInvalido: boolean = false;          
  cpfFilhoInvalido: boolean = false;     
  cpfResponsavelInvalido: boolean = false; 

  // Lista para a Grid da Etapa 4
  responsaveisGrid: any[] = [];
  valorPensaoTemp: number = 0;
  pertenceGrupoFamiliar: boolean = false;
  nomeResponsavelEncontrado: string = '';
  tipoResponsavelEncontrado: number | null = null;
  
  // Objeto principal
  filho: FilhoCreateDto = {
    nomeCompleto: '',
    nacionalidade: 'Brasileira',
    cpf: '',
    dataNascimento: '',
    genitorMoraCriancaId: null,
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    uf: '',
    complemento: '',
    escola: '',
    serie: '',
    turno: '',
    dataInicioPeriodoLetivo: '',
    dataTerminoPeriodoLetivo: '',
    dataInicioRecessoEscolar: '',
    dataTerminoRecessoEscolar: '',
    dataInicioFeriasEscolar: '',
    dataTerminoFeriasEscolar: ''
  };

  
  constructor(
    private filhoService: FilhoService,
    private genitorService: GenitorService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {}

  // --- NAVEGAÇÃO ---
  proximo() {
    if (this.etapaAtual < 4) this.etapaAtual++;
  }

  voltar() {
    if (this.etapaAtual > 1) this.etapaAtual--;
  }

  // --- VALIDAÇÕES E MÁSCARAS ---

  validarCPFFilho() {
    this.filho.cpf = this.aplicarMascaraCPF(this.filho.cpf);
    const cpfLimpo = this.filho.cpf.replace(/\D/g, '');
    this.cpfFilhoInvalido = cpfLimpo.length === 11 ? !this.utils.validarCPF(cpfLimpo) : false;
  }

  validarCPFDigitado() {
    this.cpfGenitorBusca = this.aplicarMascaraCPF(this.cpfGenitorBusca);
    const cpfLimpo = this.cpfGenitorBusca.replace(/\D/g, '');
    
    if (cpfLimpo.length === 11) {
      this.cpfInvalido = !this.utils.validarCPF(cpfLimpo);
      
      // Se o CPF for válido e tiver 11 dígitos, busca o endereço automaticamente
      if (!this.cpfInvalido) {
        this.buscarEnderecoPorCpf();
      }
    } else {
      this.cpfInvalido = false;
      // Opcional: limpa os campos se o usuário apagar o CPF
      if (cpfLimpo.length === 0) {
        this.limparCamposEndereco();
      }
    }
  }

  validarCPFResponsavel() {
    this.cpfBuscaResponsavel = this.aplicarMascaraCPF(this.cpfBuscaResponsavel);
    const cpfLimpo = this.cpfBuscaResponsavel.replace(/\D/g, '');
    
    // Sua lógica original de validação
    this.cpfResponsavelInvalido = cpfLimpo.length === 11 ? !this.utils.validarCPF(cpfLimpo) : false;

    // AGORA: Se o CPF for válido e tiver 11 dígitos, busca no banco
    if (cpfLimpo.length === 11 && !this.cpfResponsavelInvalido) {
      this.genitorService.obterPorCpf(cpfLimpo).subscribe({
        next: (res: any) => {
          if (res && res.status && res.dados) {
            const g = res.dados;
            this.nomeResponsavelEncontrado = g.nomeCompleto;
            this.tipoResponsavelEncontrado = g.tipo; // Guarda o tipo (1, 2 ou 3)

            // Lógica de UX: 
            // Se for Tipo 2 (Alimentante), o foco vai para o valor.
            // Se não for, já pode habilitar o botão ADD diretamente.
            if (g.tipo !== 2) {
              this.valorPensaoTemp = 0;
            }
          } else {
            this.utils.showError('Responsável não encontrado.');
            this.nomeResponsavelEncontrado = '';
          }
        },
        error: () => this.utils.showError('Erro ao buscar responsável.')
      });
    }
  }

  private aplicarMascaraCPF(valor: string): string {
    let v = valor.replace(/\D/g, '');
    if (v.length > 3) v = v.replace(/(\d{3})(\d)/, '$1.$2');
    if (v.length > 6) v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (v.length > 9) v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    return v.substring(0, 14);
  }

  // --- LÓGICA ETAPA 2 (Endereço por CPF) ---
  buscarEnderecoPorCpf() {
    const v = this.cpfGenitorBusca.replace(/\D/g, '');
    if (v.length !== 11 || this.cpfInvalido) return;

    // Limpa campos antes de preencher com a nova busca
    this.limparCamposEndereco();

    this.genitorService.obterPorCpf(v).subscribe({
      next: (res: any) => {
        if (res && res.status && res.dados) {
          const g = res.dados; //
          this.nomeGenitorEncontrado = g.nomeCompleto;
          this.filho.genitorMoraCriancaId = g.id;

          // Preenchimento automático com máscara no CEP
          this.filho.cep = g.cep ? g.cep.replace(/(\d{5})(\d{3})/, '$1-$2') : '';
          this.filho.logradouro = g.logradouro;
          this.filho.numero = g.numero;
          this.filho.complemento = g.complemento;
          this.filho.bairro = g.bairro;
          this.filho.cidade = g.cidade;
          this.filho.uf = g.estado; // Conforme log do console: 'estado' mapeia para 'uf'
        } else {
          this.utils.showError(res.mensagem || 'Genitor não encontrado.');
        }
      },
      error: () => this.utils.showError('Erro ao consultar o servidor.')
    });
  }

  buscarCep() {
    let valor = this.filho.cep?.replace(/\D/g, '');
    
    // Aplica máscara visual 00000-000
    if (valor && valor.length > 5) {
      this.filho.cep = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    } else {
      this.filho.cep = valor;
    }

    if (valor?.length === 8) {
      this.utils.buscarCep(valor).then(dados => {
        if (dados && !dados.erro) {
          this.filho.logradouro = dados.logradouro;
          this.filho.bairro = dados.bairro;
          this.filho.cidade = dados.localidade;
          this.filho.uf = dados.uf;
          setTimeout(() => (document.getElementsByName('numero')[0] as HTMLElement)?.focus(), 100);
        }
      });
    }
  }

  
  limparCamposEndereco() {
    this.nomeGenitorEncontrado = '';
    this.filho.genitorMoraCriancaId = null;
    this.filho.cep = '';
    this.filho.logradouro = '';
    this.filho.numero = '';
    this.filho.complemento = '';
    this.filho.bairro = '';
    this.filho.cidade = '';
    this.filho.uf = '';
  }

adicionarResponsavelGrid() {
    // 1. Verificação de segurança: Só adiciona se o nome foi encontrado na busca prévia
    if (!this.nomeResponsavelEncontrado) {
        this.utils.showWarning('Busque um responsável válido antes de adicionar.');
        return;
    }

    // 2. Verifica duplicidade (evita adicionar a mesma pessoa duas vezes)
    if (this.responsaveisGrid.find(r => r.nomeCompleto === this.nomeResponsavelEncontrado)) {
        this.utils.showWarning('Este responsável já está na lista.');
        return;
    }

    // 3. Adiciona ao Grid (usando os dados que já estão nas variáveis da classe)
    this.responsaveisGrid.push({
        cpf: this.cpfBuscaResponsavel,
        nomeCompleto: this.nomeResponsavelEncontrado,
        tipo: this.tipoResponsavelEncontrado,
        // Só grava o valor se for tipo 2 (Alimentante), senão grava 0
        valorPensao: this.tipoResponsavelEncontrado === 2 ? this.valorPensaoTemp : 0
    });

    // 4. Limpeza total dos campos para a próxima inclusão
    this.limparCamposBusca();
    this.utils.showSuccess('Responsável adicionado com sucesso.');
}

// Método auxiliar para manter o código limpo
  limparCamposBusca() {
    this.cpfBuscaResponsavel = '';
    this.nomeResponsavelEncontrado = '';
    this.tipoResponsavelEncontrado = null;
    this.valorPensaoTemp = 0;
}


  removerResponsavel(index: number) {
    this.responsaveisGrid.splice(index, 1);
  }

  salvar() {
    const dadosParaEnvio = {
      ...this.filho,
      responsaveisIds: this.responsaveisGrid.map(r => r.id)
    };

    this.filhoService.criar(dadosParaEnvio).subscribe({
      next: () => this.utils.showSuccess('Cadastro realizado com sucesso!'),
      error: () => this.utils.showError('Erro ao salvar o cadastro.')
    });
  }
}