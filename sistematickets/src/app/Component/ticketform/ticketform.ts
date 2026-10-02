import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../Services/ticketService';
import { PrioridadService } from '../../Services/prioridadService';
import { PrioridadModel } from '../../Interfaces/prioridadModel';

@Component({
  selector: 'app-ticketform',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticketform.html',
  styleUrl: './ticketform.css',
})
export class Ticketform implements OnInit {
  ticketForm!: FormGroup;
  idUsuarioLogueado: number = 0;
  prioridades = signal<PrioridadModel[]>([]);

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private prioridadService: PrioridadService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.recuperarIdDelToken();
    this.cargarPrioridades();
    this.ticketForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      idEstado: [5],
      idPrioridad: [null, Validators.required],
    });
  }

  recuperarIdDelToken() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      this.idUsuarioLogueado = Number(payload.id);
    }
  }

  cargarPrioridades() {
    this.prioridadService.getall().subscribe({
      next: (res: any) => {
        this.prioridades.set(res.Objects);
      },
      error: (err) => console.error('Error al cargar prioridades', err),
    });
  }

  enviarTicket() {
    if (this.ticketForm.valid) {
      const formValues = this.ticketForm.value;

      const hoy = new Date();
      const fechaISO = hoy.toISOString().split('T')[0];

      const ticketParaEnviar = {
        titulo: formValues.titulo,
        descripcion: formValues.descripcion,
        Fecha: fechaISO,
        Estado: { idEstado: Number(formValues.idEstado) },
        Prioridad: { idPrioridad: Number(formValues.idPrioridad) },
        usuario: { idUsuario: this.idUsuarioLogueado },
      };
      
      this.ticketService.add(ticketParaEnviar as any).subscribe({
        next: (res) => {
          this.router.navigate(['/tickets']);
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }
  }
}
