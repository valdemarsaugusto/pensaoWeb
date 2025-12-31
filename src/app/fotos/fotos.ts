import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fotos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fotos.html'
})
export class FotosComponent {
  
  // Signal para armazenar as fotos (URL e Legenda)
  galeria = signal([
    { url: 'https://picsum.photos/id/10/400/300', legenda: 'Passeio no Parque' },
    { url: 'https://picsum.photos/id/20/400/300', legenda: 'Almoço de Domingo' },
    { url: 'https://picsum.photos/id/30/400/300', legenda: 'Aniversário da Vovó' },
    { url: 'https://picsum.photos/id/40/400/300', legenda: 'Natal em Família' }
  ]);

  // Função para simular o upload (para você praticar depois)
  adicionarFoto() {
    alert('Aqui vamos abrir a galeria do celular em breve!');
  }
}