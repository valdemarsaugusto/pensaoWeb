import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventoService } from '../services/evento';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../services/utils/utils';

declare var bootstrap: any;

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, CommonModule],
  templateUrl: './calendario.html'
})
export class CalendarioComponent implements OnInit {
  dataSelecionada: string = '';
  novoEventoTitulo: string = '';
  categoriaSelecionada: number = 1;
  eventoIdSelecionado: number | null = null;
  eventoAtivoSelecionado: boolean = true;
  eventoSelecionado: any; 

  constructor(
    private eventoService: EventoService, 
    private cdr: ChangeDetectorRef, 
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.carregarEventos();
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia'
    },
    selectable: true,
    dateClick: (arg) => this.prepararCadastro(arg.dateStr),
    eventClick: (arg) => {
      arg.jsEvent.preventDefault();
      this.prepararEdicao(arg.event);
    }
  };

  prepararCadastro(data: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionadaObj = new Date(data + 'T12:00:00');

    if (dataSelecionadaObj < hoje) {
      alert("Segurança: Não é permitido registrar agendamentos em datas passadas.");
      return;
    }

    this.eventoIdSelecionado = 0;
    this.eventoAtivoSelecionado = true;
    this.dataSelecionada = data;
    this.novoEventoTitulo = '';
    this.categoriaSelecionada = 1;

    this.cdr.detectChanges();
    this.abrirModal();
  }

  prepararEdicao(event: any) {
    // 1. Extração segura do título (FullCalendar organiza dados em _def)
    const tituloReal = event.title || (event._def ? event._def.title : '');
    
    // 2. Bloqueio Robusto: Verifica se o título contém "CANCELADO"
    if (tituloReal && tituloReal.toUpperCase().includes('CANCELADO')) {
        this.utils.showError("Este agendamento está cancelado e não pode ser editado.");
        return; 
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // 3. Tratamento de data para evitar 'Invalid time value'
    const dataStr = event.startStr || (event.start ? event.start.toISOString().split('T')[0] : '');
    const dataEvento = new Date(dataStr + 'T12:00:00');

    // 4. Preenchimento das variáveis
    this.eventoIdSelecionado = Number(event.id);
    this.novoEventoTitulo = tituloReal;
    this.dataSelecionada = dataStr;
    
    this.eventoSelecionado = {
        id: event.id,
        titulo: tituloReal,
        data: dataStr
    };

    if (dataEvento < hoje) {
      alert("Segurança: Não é permitido editar agendamentos em datas passadas.");
      return;
    }

    this.cdr.detectChanges();
    this.abrirModal();
  }

  carregarEventos() {
    this.eventoService.ListarEventos().subscribe(res => {
      if (res.status && res.dados) {
        const eventosFormatados = res.dados.map((e: any) => ({
          id: e.id.toString(),
          title: e.titulo,
          start: e.dataInicio,
          color: e.ativo === false ? '#e9ecef' : this.obterCorPorCategoria(e.categoria),
          className: e.ativo === false ? 'event-cancelado' : '' 
        }));
        this.calendarOptions.events = eventosFormatados;
        this.cdr.detectChanges();
      }
    });
  }

  obterCorPorCategoria(categoria: number): string {
    const cores: { [key: number]: string } = { 1: '#0d6efd', 2: '#ffc107', 3: '#198754', 4: '#dc3545' };
    return cores[categoria] || '#6c757d';
  }

  abrirModal() {
    const modalElement = document.getElementById('modalEvento');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  salvarEvento() {
    if (!this.novoEventoTitulo) return alert("Digite um título!");

    const dadosDto = {
      id: Number(this.eventoIdSelecionado),
      titulo: this.novoEventoTitulo,
      dataInicio: new Date(this.dataSelecionada).toISOString(),
      cor: this.obterCorPorCategoria(Number(this.categoriaSelecionada)),
      categoria: Number(this.categoriaSelecionada),
      ativo: true
    };

    if (this.eventoIdSelecionado) {
        this.eventoService.AtualizarEvento(this.eventoIdSelecionado, dadosDto as any).subscribe({
          next: (res) => { 
            if (res.status) {
              this.posSalvar();
            } 
          },
          error: (err) => console.error("Erro na API:", err)
        });
    } else {
      this.eventoService.CriarEvento(dadosDto).subscribe(res => {
        if (res.status) { this.posSalvar(); }
      });
    }
  }

  excluirEvento() {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;

    // Limpa o título para evitar duplicação do prefixo
    const tituloLimpo = this.novoEventoTitulo.replace('CANCELADO - ', '');

    const dadosDto = {
      id: Number(this.eventoIdSelecionado),
      titulo: `CANCELADO - ${tituloLimpo}`,
      dataInicio: new Date(this.dataSelecionada).toISOString(),
      cor: '#e9ecef', 
      categoria: Number(this.categoriaSelecionada),
      ativo: false
    };

    if (this.eventoIdSelecionado) {
        this.eventoService.AtualizarEvento(this.eventoIdSelecionado, dadosDto as any).subscribe({
          next: (res) => { 
            if (res.status) {
              this.posSalvar();
              this.utils.showSuccess("Agendamento cancelado!");
            } 
          },
          error: (err) => console.error("Erro na API:", err)
        });
    }
  }

  posSalvar() {
    this.carregarEventos();
    this.fecharModal();
  }

  fecharModal() {
    const modalElement = document.getElementById('modalEvento');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  }
}