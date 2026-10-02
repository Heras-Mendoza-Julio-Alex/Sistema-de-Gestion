import { Component, OnInit, NgModule, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TicketModel } from '../../Interfaces/ticketModel';
import { TicketService } from '../../Services/ticketService';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComentarioModel } from '../../Interfaces/comentarioModel';
import { ComentarioService } from '../../Services/comentarioService';
import { PrioridadService } from '../../Services/prioridadService';
import { EstadoService } from '../../Services/estadoService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.html',
  imports: [CommonModule, RouterLink, FormsModule],
  styleUrl: './ticket.css',
})
export class Ticket implements OnInit {
  ticketSubject = new BehaviorSubject<TicketModel | null>(null);
  comentariosSubject = new BehaviorSubject<ComentarioModel[]>([]);
  cargando = true;
  idTicketActual: number = 0;
  idUsuarioLogueado: number = 0;
  rolUsuario: string = '';
  prioridades = signal<any[]>([]);
  estados = signal<any[]>([]);
  ticketEdicion: any = null;

  constructor(
    private ticketService: TicketService,
    private comentarioService: ComentarioService,
    private prioridadService: PrioridadService,
    private estadoService: EstadoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.idTicketActual = Number(this.route.snapshot.paramMap.get('idTicket'));
    this.recuperarIdDelToken();
    this.cargarPrioridades();
    this.cargarEstados();

    if (this.idTicketActual) {
      this.getById(this.idTicketActual);
      this.getComentarios(this.idTicketActual);
    }
  }

  recuperarIdDelToken() {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        this.idUsuarioLogueado = Number(payload.id);
        this.rolUsuario = String(payload.role);
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    }
  }

  getById(idTicket: number) {
    this.cargando = true;
    this.ticketService.getallbyid(idTicket).subscribe({
      next: (data: any) => {
        const ticket = data.Object || data.object;
        this.ticketSubject.next(ticket);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener el ticket:', err);
        this.cargando = false;
      },
    });
  }

  getComentarios(idTicket: number) {
    this.comentarioService.getallbyidticket(idTicket).subscribe({
      next: (data: any) => {
        const lista = data.Objects || data.objects;
        this.comentariosSubject.next(lista);
      },
      error: (err) => console.error('Error al cargar comentarios:', err),
    });
  }

  agregarComentario(texto: string) {
    if (!texto.trim()) return;

    const nuevoComentario: any = {
      contenido: texto,
      usuario: { idUsuario: this.idUsuarioLogueado },
      ticket: { idTicket: this.idTicketActual },
    };

    this.comentarioService.add(nuevoComentario).subscribe({
      next: () => {
        this.getComentarios(this.idTicketActual);
      },
      error: (err) => console.error('Error al guardar comentario:', err),
    });
  }

  EsconderBoton(): boolean {
    const rol = this.rolUsuario;
    return rol === 'Usuario';
  }

  cargarPrioridades() {
    this.prioridadService.getall().subscribe({
      next: (res: any) => this.prioridades.set(res.Objects || res.objects),
      error: (err) => console.error(err),
    });
  }

  cargarEstados() {
    this.estadoService.getall().subscribe({
      next: (res: any) => this.estados.set(res.Objects || res.objects),
      error: (err) => console.error(err),
    });
  }

  abrirModal() {
    const ticketActual = this.ticketSubject.value;
    if (ticketActual) {
      this.ticketEdicion = JSON.parse(JSON.stringify(ticketActual));
    }
  }

  guardarCambios() {
    if (!this.ticketEdicion) return;

    this.ticketService.update(this.ticketEdicion).subscribe({
      next: (res: any) => {
        if (res.Correct || res.correct) {
          this.getById(this.idTicketActual);
        }
      },
      error: (err) => console.error('Error al actualizar:', err),
    });
  }
}
