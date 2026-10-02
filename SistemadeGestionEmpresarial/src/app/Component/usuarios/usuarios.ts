import { Component, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../Interfaces/usuarioModel';
import { RolModel } from '../../Interfaces/rolModel';
import { UsuarioService } from '../../Services/usuarioService';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink, CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios = signal<UsuarioModel[]>([]);
  usuario: UsuarioModel | null = null;
  roles = signal<RolModel[]>([]);
  rolUsuario: string = '';

  paginaActual = signal<number>(1);
  itemsPorPagina = signal<number>(3);

  usuariosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina();
    const fin = inicio + this.itemsPorPagina();
    return this.usuarios().slice(inicio, fin);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.usuarios().length / this.itemsPorPagina());
  });

  arrayPaginas = computed(() => {
    return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
  });

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.usuarioService.getall().subscribe({
      next: (data) => {
        this.usuarios.set(data.Objects || []);
        this.paginaActual.set(1);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  bajalogica(idUsuario: number, estatusActual: number) {
    const nuevoEstatus = estatusActual === 1 ? 0 : 1;
    const data = { estatus: nuevoEstatus };

    this.usuarioService.bajalogica(idUsuario, data).subscribe({
      next: () => {
        this.getAll();
        Swal.fire(
          '¡Actualizado!',
          `Usuario ${nuevoEstatus === 1 ? 'activado' : 'desactivado'} con éxito.`,
          'success',
        );
      },
      error: (err) => console.error('Error al cambiar estatus:', err),
    });
  }

  confirmarEliminacion(idUsuario: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(idUsuario).subscribe({
          next: (res: any) => {
            if (res.correct || res.Correct) {
              Swal.fire('¡Eliminado!', 'El usuario ha sido borrado correctamente.', 'success');
              this.getAll();
            } else {
              Swal.fire('Error', res.errorMessage || 'No se pudo eliminar', 'error');
            }
          },
          error: (err) => {
            console.error('Error en Oracle:', err);
            Swal.fire('Error', 'Fallo en el servidor o base de datos.', 'error');
          },
        });
      }
    });
  }

  EsconderBoton(): boolean {
    const rol = this.rolUsuario;
    return rol === 'Usuario';
  }
}
