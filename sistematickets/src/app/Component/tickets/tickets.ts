import { Component, signal } from '@angular/core';
import { TicketModel } from '../../Interfaces/ticketModel';
import { TicketService } from '../../Services/ticketService';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tickets',
  imports: [CommonModule, RouterLink],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  tickets = signal<TicketModel[]>([]);
  cargando: boolean = true;
  idUsuarioLogueado!: number;
  rolUsuario: string = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.revisarDatosToken();
    this.getAll();
  }

  getAll() {
    this.cargando = true;
    if (this.rolUsuario != 'Usuario') {
      this.ticketService.getall().subscribe({
        next: (data: any) => {
          this.tickets.set(data.Objects);
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error de conexión:', err);
          this.tickets.set([]);
          this.cargando = false;
        },
      });
    } else {
      this.ticketService.getallbyidUsuario(this.idUsuarioLogueado).subscribe({
        next: (data: any) => {
          this.tickets.set(data.Objects);
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error de conexión:', err);
          this.tickets.set([]);
          this.cargando = false;
        },
      });
    }
  }

  revisarDatosToken() {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const payloadDecodificado = JSON.parse(window.atob(base64));
        this.idUsuarioLogueado = payloadDecodificado.id;
        this.rolUsuario = payloadDecodificado.role;
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    } else {
      console.log('No hay token');
    }
  }
  EsconderBoton(): boolean {
    const rol = this.rolUsuario;
    return rol !== 'Usuario';
  }
  EsconderBotonAdmin(): boolean {
    const rol = this.rolUsuario;
    return rol !== 'Administrador';
  }
}
