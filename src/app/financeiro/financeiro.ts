import { Component, signal, effect, input, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Gasto {
  id: number;
  descricao: string;
  valor: number;
  fluxo: 'Entrada' | 'Saída'; // Usamos fluxo para Entradas/Saídas
  pagoPor: string;
  data: string;
}

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financeiro.html' // Certifique-se que o nome do arquivo está correto (financeiro.html ou financeiro.component.html)
})
export class FinanceiroComponent {
  autorAtivo = input.required<string>();
  
  listaGastos = signal<Gasto[]>(this.carregarGastos());

  // Campos do formulário (Sincronizados com o HTML)
  novaDescricao = signal('');
  novoValor = signal<number | null>(null);
  novoFluxo = signal<'Entrada' | 'Saída'>('Entrada'); // Mudamos de novoTipo para novoFluxo

  // Cálculos automáticos (Computed signals são excelentes para performance)
  totalEntradas = computed(() => 
    this.listaGastos()
      .filter(g => g.fluxo === 'Entrada')
      .reduce((acc, curr) => acc + curr.valor, 0)
  );

  totalSaidas = computed(() => 
    this.listaGastos()
      .filter(g => g.fluxo === 'Saída')
      .reduce((acc, curr) => acc + curr.valor, 0)
  );

  saldo = computed(() => this.totalEntradas() - this.totalSaidas());

  constructor() {
    // Salva automaticamente sempre que a lista mudar
    effect(() => {
      localStorage.setItem('financeiro_filho', JSON.stringify(this.listaGastos()));
    });
  }

  carregarGastos() {
    const salvo = localStorage.getItem('financeiro_filho');
    return salvo ? JSON.parse(salvo) : [];
  }

  adicionarGasto() {
    if (this.novaDescricao() && this.novoValor()) {
      const novo: Gasto = {
        id: Date.now(),
        descricao: this.novaDescricao(),
        valor: this.novoValor()!,
        fluxo: this.novoFluxo(), // Usando o sinal correto aqui
        pagoPor: this.autorAtivo(),
        data: new Date().toLocaleDateString('pt-BR')
      };

      // Adiciona o novo gasto no topo da lista
      this.listaGastos.update(atual => [novo, ...atual]);
      
      // Limpar campos após adicionar
      this.novaDescricao.set('');
      this.novoValor.set(null);
      this.novoFluxo.set('Entrada');
    }
  }

  // Adicione esta função no seu financeiro.component.ts
  excluirGasto(id: number) {
    if (confirm('Deseja realmente remover este lançamento?')) {
      this.listaGastos.update(atual => atual.filter(g => g.id !== id));
    }
  }
}