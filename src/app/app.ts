import { Component, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MuralComponent } from './mural/mural';
import { CalendarioComponent } from './calendario/calendario';
import { FotosComponent } from './fotos/fotos';
import { FinanceiroComponent } from './financeiro/financeiro';
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterModule],
  templateUrl: './app.html'
})
export class AppComponent {
  // 1. O Signal para o Login
  usuarioAtivo = signal<string | null>(localStorage.getItem('membro_familia'));

  // 2. O Signal para as Abas (Este é o que estava faltando!)
  abaAtiva = signal<'mural' | 'calendario' | 'fotos' | 'despesas'>('mural');

  constructor() {
    // Salva o nome do usuário automaticamente quando ele entra
    effect(() => {
      const nome = this.usuarioAtivo();
      if (nome) {
        localStorage.setItem('membro_familia', nome);
      }
    });
  }

  // Função para validar e setar o usuário
  setUsuario(nome: string) {
    if (nome && nome.trim().length > 2) {
      this.usuarioAtivo.set(nome.trim());
    }
  }
}