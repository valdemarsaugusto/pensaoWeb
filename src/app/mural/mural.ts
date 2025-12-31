import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para pipes e diretivas
import { FormsModule } from '@angular/forms'; // Necessário para o ngModel funcionar
import { RecadoService } from '../services/recado';
import { RecadoModel } from '../model/recadoModel';

@Component({
  selector: 'app-mural',
  standalone: true, // Adicione se o seu projeto for standalone (Angular 15+)
  imports: [CommonModule, FormsModule], // Adicione os módulos aqui
  templateUrl: './mural.html',
  styleUrls: ['./mural.css']
})
export class MuralComponent implements OnInit {
  
  novoRecado = signal('');
  listaRecados = signal<RecadoModel[]>([]);
  @Input() autorAtivo: string = ''; 

  constructor(private recadoService: RecadoService) {}

  ngOnInit(): void {
    this.obterTodosOsRecados();
  }

  obterTodosOsRecados() {
    this.recadoService.BuscarRecado().subscribe({
      next: (resposta) => {
        if (resposta.status) {
          this.listaRecados.set(resposta.dados);
        }
      },
      error: (err) => console.error('Erro na API:', err)
    });
  }

  adicionarRecado() {
    // Verificação simples para não enviar recado vazio
    if (!this.novoRecado().trim()) return;

    const novo = {
      autor: this.autorAtivo,
      mensagem: this.novoRecado()
    };

    // NO SEU MURAL.TS, DENTRO DO SUBSCRIBE DO ADICIONAR
    this.recadoService.CriarRecado(novo).subscribe((resposta) => {
      if (resposta.status) {
        
        // CORREÇÃO AQUI:
        // 'listaAtual' representa os recados que já estão na tela.
        // O '[...listaAtual, resposta.dados]' cria uma nova lista com o novo recado no fim.
        this.listaRecados.update(listaAtual => [...listaAtual, resposta.dados]);

        this.novoRecado.set(''); // Limpa o textarea
      }
    });
  }

  excluirRecado(id: number | undefined) {
    if (!id) return;

    // Opcional: Adicionar uma confirmação simples antes de apagar do banco
    if (confirm('Tem certeza que deseja remover permanentemente este recado?')) {
      this.recadoService.RemoverRecado(id).subscribe({
        next: (resposta) => {
          if (resposta.status) {
              this.listaRecados.update(listaAtual => 
                listaAtual.filter(recado => recado.id !== id))
          }
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          alert('Não foi possível excluir o recado.');
        }
      });
    }
  }
}